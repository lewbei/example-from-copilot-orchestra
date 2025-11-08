## Plan: Express API JWT Authentication System

Building a production-ready Express API with JWT-based authentication supporting user registration, login, and protected routes using TypeScript, PostgreSQL, and comprehensive test coverage.

**Phases: 7**

1. **Phase 1: Project Setup and Configuration**
    - **Objective:** Initialize Express TypeScript project with essential dependencies, environment configuration, and basic server structure
    - **Files/Functions to Modify/Create:** 
        - `package.json` - project dependencies and scripts
        - `tsconfig.json` - TypeScript configuration
        - `.env.example` - environment variable template
        - `.gitignore` - ignore sensitive files
        - `src/config/env.ts` - environment variable validation
        - `src/server.ts` - main server entry point
    - **Tests to Write:**
        - `tests/config/env.test.ts` - validate environment configuration loads correctly
        - `tests/server.test.ts` - validate server starts and responds to health check
    - **Steps:**
        1. Write test for environment configuration validation
        2. Run test to see it fail
        3. Initialize npm project with TypeScript, Express, and essential packages (bcryptjs, jsonwebtoken, dotenv, pg, express-validator)
        4. Create environment configuration module that validates required variables
        5. Write test for basic server health check endpoint
        6. Run test to see it fail
        7. Create basic Express server with health check endpoint
        8. Run tests to confirm they pass
        9. Run linter and formatter

2. **Phase 2: Database Schema and Connection**
    - **Objective:** Set up PostgreSQL connection, create users table schema, and implement database initialization
    - **Files/Functions to Modify/Create:**
        - `src/config/database.ts` - database connection pool and initialization
        - `src/database/schema.sql` - SQL schema for users table
        - `src/database/migrations/001_create_users_table.sql` - migration file
        - `src/models/User.ts` - User type definitions
    - **Tests to Write:**
        - `tests/config/database.test.ts` - validate database connection succeeds
        - `tests/database/schema.test.ts` - validate users table exists with correct columns
    - **Steps:**
        1. Write test for database connection establishment
        2. Run test to see it fail
        3. Create database configuration with connection pool
        4. Create users table schema with id, email, password_hash, created_at, updated_at
        5. Run test to confirm connection works
        6. Write test to validate users table structure
        7. Run test to see it fail
        8. Implement database initialization function that creates tables
        9. Run tests to confirm they pass
        10. Run linter and formatter

3. **Phase 3: User Registration Endpoint**
    - **Objective:** Implement user registration with password hashing, email validation, and duplicate email prevention
    - **Files/Functions to Modify/Create:**
        - `src/routes/auth.routes.ts` - authentication routes
        - `src/controllers/auth.controller.ts` - registration logic
        - `src/services/user.service.ts` - user database operations
        - `src/utils/password.ts` - password hashing utilities
        - `src/middleware/validation.ts` - request validation middleware
        - `src/server.ts` - mount auth routes
    - **Tests to Write:**
        - `tests/utils/password.test.ts` - validate password hashing and comparison
        - `tests/services/user.service.test.ts` - validate user creation in database
        - `tests/routes/auth.test.ts` - validate registration endpoint (success, duplicate email, invalid email, weak password)
    - **Steps:**
        1. Write test for password hashing function
        2. Run test to see it fail
        3. Implement password hashing using bcrypt
        4. Run test to confirm it passes
        5. Write test for user service createUser function
        6. Run test to see it fail
        7. Implement user service with database insert
        8. Run test to confirm it passes
        9. Write tests for registration endpoint (success and error cases)
        10. Run tests to see them fail
        11. Implement registration controller with validation
        12. Mount auth routes in server
        13. Run tests to confirm they pass
        14. Run linter and formatter

4. **Phase 4: Login Endpoint and JWT Token Generation**
    - **Objective:** Implement login endpoint that validates credentials and returns JWT access token
    - **Files/Functions to Modify/Create:**
        - `src/controllers/auth.controller.ts` - add login function
        - `src/services/user.service.ts` - add findUserByEmail function
        - `src/utils/jwt.ts` - JWT token generation and validation utilities
        - `src/routes/auth.routes.ts` - add login route
    - **Tests to Write:**
        - `tests/utils/jwt.test.ts` - validate token generation and verification
        - `tests/routes/auth.test.ts` - validate login endpoint (success, wrong password, non-existent user, invalid email format)
    - **Steps:**
        1. Write test for JWT token generation and verification
        2. Run test to see it fail
        3. Implement JWT utilities (generateToken, verifyToken)
        4. Run test to confirm it passes
        5. Write test for findUserByEmail service function
        6. Run test to see it fail
        7. Implement findUserByEmail in user service
        8. Run test to confirm it passes
        9. Write tests for login endpoint (success and error cases)
        10. Run tests to see them fail
        11. Implement login controller with credential validation and token generation
        12. Add login route
        13. Run tests to confirm they pass
        14. Run linter and formatter

5. **Phase 5: Authentication Middleware for Protected Routes**
    - **Objective:** Create middleware that validates JWT tokens and attaches user data to requests
    - **Files/Functions to Modify/Create:**
        - `src/middleware/auth.middleware.ts` - JWT authentication middleware
        - `src/types/express.d.ts` - extend Express Request type with user property
        - `src/routes/user.routes.ts` - protected user routes
        - `src/controllers/user.controller.ts` - user profile controller
    - **Tests to Write:**
        - `tests/middleware/auth.test.ts` - validate middleware (valid token, invalid token, missing token, expired token)
        - `tests/routes/user.test.ts` - validate protected route access (authenticated, unauthenticated)
    - **Steps:**
        1. Write test for authentication middleware with valid token
        2. Run test to see it fail
        3. Implement auth middleware that extracts and verifies JWT from Authorization header
        4. Extend Express Request type to include user property
        5. Run test to confirm it passes
        6. Write tests for middleware error cases (missing, invalid, expired tokens)
        7. Run tests to see them fail
        8. Add error handling to middleware for all cases
        9. Run tests to confirm they pass
        10. Write test for protected profile endpoint
        11. Run test to see it fail
        12. Implement profile controller and protected user routes
        13. Mount user routes in server
        14. Run tests to confirm they pass
        15. Run linter and formatter

6. **Phase 6: Error Handling and Security Hardening**
    - **Objective:** Implement centralized error handling, rate limiting, security headers, and input sanitization
    - **Files/Functions to Modify/Create:**
        - `src/middleware/error.middleware.ts` - centralized error handler
        - `src/middleware/security.middleware.ts` - helmet, cors, rate limiting
        - `src/utils/errors.ts` - custom error classes
        - `src/server.ts` - apply security middleware and error handler
    - **Tests to Write:**
        - `tests/middleware/error.test.ts` - validate error responses are properly formatted
        - `tests/middleware/security.test.ts` - validate rate limiting blocks excessive requests
        - `tests/routes/auth.test.ts` - validate rate limiting on auth endpoints
    - **Steps:**
        1. Write test for custom error classes and error handler
        2. Run test to see it fail
        3. Create custom error classes (ValidationError, AuthenticationError, NotFoundError)
        4. Implement centralized error middleware
        5. Run test to confirm it passes
        6. Write test for rate limiting middleware
        7. Run test to see it fail
        8. Install and configure helmet, cors, and express-rate-limit
        9. Apply security middleware to server
        10. Run test to confirm it passes
        11. Update all error responses to use custom error classes
        12. Run all tests to confirm they pass
        13. Run linter and formatter

7. **Phase 7: Integration Tests and Documentation**
    - **Objective:** Create comprehensive integration tests for complete authentication flows and document API endpoints
    - **Files/Functions to Modify/Create:**
        - `tests/integration/auth-flow.test.ts` - full registration -> login -> access protected route flow
        - `README.md` - API documentation and setup instructions
        - `API.md` - detailed endpoint documentation
        - `src/server.ts` - add API documentation endpoint
    - **Tests to Write:**
        - `tests/integration/auth-flow.test.ts` - complete user journey tests
        - `tests/integration/concurrent-requests.test.ts` - validate thread safety
    - **Steps:**
        1. Write integration test for complete registration -> login -> protected access flow
        2. Run test to see it fail (if any integration issues exist)
        3. Fix any integration issues
        4. Run test to confirm it passes
        5. Write integration test for concurrent registration attempts
        6. Run test to confirm proper handling
        7. Create README with setup instructions and environment variables
        8. Create API documentation with all endpoints, request/response examples
        9. Run all tests to ensure complete coverage
        10. Run linter and formatter on all files

**Open Questions:**
1. Database preference: PostgreSQL (production-ready, recommended) / MongoDB (simpler setup) / SQLite (development only)?
2. Token expiration time: 1 hour (secure) / 24 hours (convenient) / configurable via environment?
3. Refresh token implementation: Include in initial plan / defer to future enhancement?
4. Password requirements: Minimum 8 characters with complexity rules / custom requirements?
5. Additional features: Email verification / password reset / multi-factor authentication in scope?
