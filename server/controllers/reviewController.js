const db = require('../config/db');

async function ensurePolicyExists(policyId) {
  const [[row]] = await db.query("SELECT EXISTS(SELECT 1 FROM policies WHERE id = ?) AS ok", [policyId]);
  return !!(row && row.ok);
}

exports.writeReview = async (req, res) => {
  const policyId = Number(req.params.id);
  const email = req.user.userId;
  let { rating, content } = req.body;
  rating = Number(rating);
  content = (content ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !content) {
    return res.status(400).json({ message: "입력값 오류" });
  }

  let conn;
  try {
    if (!(await ensurePolicyExists(policyId))) return res.status(404).json({ message: "정책 없음" });

    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.query(`INSERT INTO policy_ratings (policy_id, rater_email, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, updated_at = NOW()`, [policyId, email, rating, rating]);
    await conn.query(`INSERT INTO policy_comments (policy_id, author_email, content, is_review) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE content = ?, is_deleted = 0, updated_at = NOW()`, [policyId, email, content, content]);

    const [[agg]] = await conn.query(`SELECT COUNT(*) AS rating_count, ROUND(AVG(rating), 2) AS rating_avg FROM policy_ratings WHERE policy_id = ?`, [policyId]);
    await conn.commit();
    res.status(201).json({ ok: true, summary: agg });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ message: "작성 실패" });
  } finally {
    if (conn) conn.release();
  }
};

exports.getReviews = async (req, res) => {
  const policyId = req.params.id;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  try {
    const [rows] = await db.query(`
      SELECT pc.id AS comment_id, pc.author_email, u.nickname, pc.content, pc.created_at, pr.rating
      FROM policy_comments pc
      LEFT JOIN policy_ratings pr ON pr.policy_id = pc.policy_id AND pr.rater_email = pc.author_email
      LEFT JOIN users u ON u.email = pc.author_email
      WHERE pc.policy_id = ? AND pc.is_review = 1 AND pc.is_deleted = 0
      ORDER BY pc.created_at DESC LIMIT ? OFFSET ?`, [policyId, limit, offset]);

    const [[agg]] = await db.query(`SELECT COUNT(*) AS rating_count, ROUND(AVG(rating), 2) AS rating_avg FROM policy_ratings WHERE policy_id = ?`, [policyId]);
    res.json({ items: rows, summary: agg });
  } catch (err) {
    res.status(500).json({ message: "조회 실패" });
  }
};

exports.deleteReview = async (req, res) => {
  const policyId = req.params.id;
  const email = req.user.userId;
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();
    await conn.query(`UPDATE policy_comments SET is_deleted=1, updated_at=NOW() WHERE policy_id=? AND author_email=? AND is_review=1`, [policyId, email]);
    await conn.query(`DELETE FROM policy_ratings WHERE policy_id=? AND rater_email=?`, [policyId, email]);
    const [[agg]] = await conn.query(`SELECT COUNT(*) AS rating_count, ROUND(AVG(rating), 2) AS rating_avg FROM policy_ratings WHERE policy_id = ?`, [policyId]);
    await conn.commit();
    res.json({ ok: true, summary: agg });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ message: "삭제 실패" });
  } finally {
    if (conn) conn.release();
  }
};