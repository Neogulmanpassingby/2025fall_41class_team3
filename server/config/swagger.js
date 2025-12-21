const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Policy RAG API',
      version: '1.0.0',
      description: '정책 정보 검색 및 추천 API 명세',
      contact: {
        name: 'Team 3'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '로컬 개발 서버'
      },
      {
        url: 'https://2025fall41classteam3.vercel.app',
        description: '프로덕션 서버'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Access Token (로그인 후 발급받음)'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            nickname: { type: 'string' },
            password: { type: 'string' },
            birthDate: { type: 'string', format: 'date' },
            location: { type: 'string' },
            income: { type: 'string' },
            education: { type: 'string' },
            maritalStatus: { type: 'string' },
            major: { type: 'string' },
            employmentStatus: { type: 'array', items: { type: 'string' } },
            specialGroup: { type: 'array', items: { type: 'string' } },
            interests: { type: 'array', items: { type: 'string' } }
          },
          required: ['email', 'nickname', 'password', 'birthDate', 'location', 'income', 'education']
        },
        Policy: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            plcyNm: { type: 'string', description: '정책명' },
            plcyExplnCn: { type: 'string', description: '정책 설명' },
            plcySprtCn: { type: 'string', description: '지원 내용' },
            plcyAplyMthdCn: { type: 'string', description: '신청 방법' },
            plcyKywdNm: { type: 'array', items: { type: 'string' }, description: '정책 키워드' },
            inqCnt: { type: 'integer', description: '조회수' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Access Token' },
            refreshToken: { type: 'string', description: 'Refresh Token' },
            expires_in: { type: 'integer', description: '토큰 만료 시간 (초)' },
            nickname: { type: 'string' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            policyId: { type: 'integer' },
            email: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            content: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: [
    './routes/auth.js',
    './routes/policies.js',
    './routes/mypage.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
