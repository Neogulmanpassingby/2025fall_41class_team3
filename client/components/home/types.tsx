export interface PolicyCardData {
  id: number;
  title: string;
  summary: string;
  reason?: string;
  tags?: string[];
}
/*
export interface PolicyDetail extends PolicyCardData {
  description?: string;
  support?: string;
  applyMethod?: string;
  applyPeriod?: string;
  projectPeriod?: string;
  category?: string;
  rating?: number;
  badge?: string;
}
*/


export interface PolicyDetail {
  id: number;
  plcyNm: string;
  lclsfNm?: string;
  mclsfNm?: string;
  plcyKywdNm?: string[]; // ★ 중요: 서버 코드에서 배열로 변환해서 줌
  plcyExplnCn?: string;
  plcySprtCn?: string;
  plcyAplyMthdCn?: string;
  aplyYmd?: string;
  bizPrdBgngYmd?: string;
  bizPrdEndYmd?: string;
  aplyUrlAddr?: string;
  srngMthdCn?: string;
  sbmsnDcmntCn?: string;

  /* additional optional fields used by UI */
  sprtTrgtAgeLmtYn?: string;
  sprtTrgtMinAge?: string | number;
  sprtTrgtMaxAge?: string | number;
  zipCd?: string;
  earnEtcCn?: string;
  schoolCd?: string;
  jobCd?: string;
  plcyMajorCd?: string;
  addAplyQlfcCndCn?: string;
  ptcpPrpTrgtCn?: string;
  etcMttrCn?: string;
  refUrlAddr1?: string;
  refUrlAddr2?: string;
  sprtSclCnt?: number;
  sbizCd?: string;
}
