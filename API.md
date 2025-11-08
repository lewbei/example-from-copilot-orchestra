# API Documentation

Base URL: `http://localhost:3000`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

Check if the API is running.

**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T12:00:00.000Z"
}
```

---

### Register User

Create a new user account.

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- Email must be valid email format
- Password minimum 8 characters
- Password must contain uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-11-08T12:00:00.000Z",
    "updated_at": "2025-11-08T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "User with this email already exists"
}
```

---

### Login

Authenticate and receive a JWT token.

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-11-08T12:00:00.000Z",
    "updated_at": "2025-11-08T12:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### Get Profile

Get the current user's profile (protected route).

**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "error": "No token provided"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
Invalid input data or validation errors.

```json
{
  "errors": [
    {
      "msg": "Must be a valid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
Missing or invalid authentication token.

```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
Resource not found.

```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 429 Too Many Requests
Rate limit exceeded.

```json
{
  "message": "Too many authentication attempts, please try again later"
}
```

### 500 Internal Server Error
Server error.

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Authentication endpoints** (`/api/auth/*`): 5 requests per 15 minutes
- **All other endpoints**: 100 requests per 15 minutes

Rate limit information is included in response headers:
- `RateLimit-Limit`: Total requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when the limit resets

---

## Example Usage

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript (fetch)

```javascript
// Register
const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'SecurePass123!'
  })
});
const registerData = await registerResponse.json();

// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'SecurePass123!'
  })
});
const { token } = await loginResponse.json();

// Get Profile
const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const profileData = await profileResponse.json();
```
