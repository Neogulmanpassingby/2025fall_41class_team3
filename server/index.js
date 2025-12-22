const express = require('express');
const cors = require('cors');
const swaggerSpec = require('./config/swagger');

const authRouter = require('./routes/auth');
const policyRouter = require('./routes/policies');
const mypageRouter = require('./routes/mypage');

const app = express();
const PORT = 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'https://2025fall41classteam3.vercel.app',
  'https://2025fall41classteam3-peach.vercel.app'
];


app.use(cors({
  origin: true, // 요청 origin 그대로 반사
  credentials: true
}));


app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  console.log(`Query:`, req.query);
  console.log(`Body:`, req.body);
  next();
});

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

console.log(`Swagger JSON: http://localhost:${PORT}/api-docs.json`);

app.use('/api/auth', authRouter);
app.use('/api/policies', policyRouter);
app.use('/api/mypage', mypageRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on 0.0.0.0:${PORT}`);
  console.log(`Swagger 문서: http://localhost:${PORT}/api-docs`);
});


