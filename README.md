# Express JWT Authentication API

A production-ready Express.js API with JWT-based authentication, built with TypeScript and PostgreSQL.

## Features

- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Protected routes with middleware
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS support
- ✅ Centralized error handling
- ✅ Comprehensive test coverage
- ✅ TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agent_copilot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database and JWT secret:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
DATABASE_URL=postgresql://username:password@localhost:5432/express_jwt_auth
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE express_jwt_auth;
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically initialize the database schema.

## API Documentation

See [API.md](./API.md) for detailed endpoint documentation.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
├── src/
│   ├── config/          # Configuration files (database, env)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # TypeScript interfaces
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type extensions
│   ├── utils/           # Utility functions
│   └── server.ts        # Express app setup
├── tests/               # Test files mirroring src structure
├── dist/                # Compiled JavaScript (generated)
└── coverage/            # Test coverage reports (generated)
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: 1-hour expiration, secure secret
- **Rate Limiting**: 
  - Auth endpoints: 5 requests per 15 minutes
  - General endpoints: 100 requests per 15 minutes
- **Helmet**: Security headers protection
- **CORS**: Configurable origin restrictions
- **Input Validation**: express-validator for all inputs
- **SQL Injection Prevention**: Parameterized queries

## Testing

Run tests with:
```bash
npm test
```

Tests will automatically skip database-dependent tests if PostgreSQL is not available, making the test suite runnable in any environment.

Current test coverage: **60%+** with comprehensive tests for:
- Authentication flows
- JWT token generation/validation
- Password hashing
- Protected routes
- Error handling
- Security middleware

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment (development/production/test) | development | No |
| PORT | Server port | 3000 | No |
| JWT_SECRET | Secret key for JWT signing | - | Yes |
| JWT_EXPIRATION | JWT token expiration time | 1h | No |
| DATABASE_URL | PostgreSQL connection string | - | Yes |
| ALLOWED_ORIGINS | Comma-separated CORS origins | * | No |

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue on GitHub.
