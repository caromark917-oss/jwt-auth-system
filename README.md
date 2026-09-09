# JWT Authentication System

A complete, production-ready JWT authentication flow with Node.js, Express, and MongoDB.

## Features

✅ **User Registration** - Create accounts with password hashing  
✅ **User Login** - Secure authentication with JWT  
✅ **Access & Refresh Tokens** - Dual token system for security  
✅ **Token Refresh** - Rotate tokens without re-login  
✅ **Logout** - Token revocation on logout  
✅ **Role-Based Access Control** - User and Admin roles  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **Protected Routes** - JWT middleware for endpoints  
✅ **Account Management** - Update profile, deactivate account  

## Prerequisites

- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone and install:
```bash
git clone https://github.com/caromark917-oss/jwt-auth-system.git
cd jwt-auth-system
npm install
```

2. Setup environment:
```bash
cp .env.example .env
```

3. Update `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jwt-auth
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

4. Start server:
```bash
npm run dev  # development with hot reload
npm start   # production
```

## API Endpoints

### Authentication (`/api/auth`)

**Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Refresh Token**
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Get Current User**
```
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**Logout**
```
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### Users (`/api/users`)

**Get All Users** (Admin only)
```
GET /api/users
Authorization: Bearer {adminToken}
```

**Get User by ID**
```
GET /api/users/:id
Authorization: Bearer {accessToken}
```

**Update User**
```
PUT /api/users/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Change Role** (Admin only)
```
PUT /api/users/:id/role
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "role": "admin"
}
```

**Deactivate Account**
```
PATCH /api/users/:id/deactivate
Authorization: Bearer {accessToken}
```

**Delete User** (Admin only)
```
DELETE /api/users/:id
Authorization: Bearer {adminToken}
```

## How It Works

1. **Registration/Login** → User receives `accessToken` (15m) + `refreshToken` (7d)
2. **API Calls** → Send `accessToken` in Authorization header as `Bearer {token}`
3. **Token Expired** → Use `refreshToken` endpoint to get new `accessToken`
4. **Logout** → `refreshToken` is revoked in database
5. **Admin Functions** → Only users with admin role can access admin endpoints

## Security Features

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT signed with secret keys
- ✅ Refresh tokens stored in database for revocation
- ✅ Automatic token expiration (15m access, 7d refresh)
- ✅ Environment variables for sensitive data
- ✅ Role-based authorization checks
- ✅ Inactive account protection

## Project Structure

```
jwt-auth-system/
├── models/
│   └── User.js              # User schema with methods
├── routes/
│   ├── auth.js              # Authentication endpoints
│   └── users.js             # User management
├── middleware/
│   └── auth.js              # JWT verification & role check
├── utils/
│   └── tokenUtils.js        # Token generation utilities
├── server.js                # Express app setup
├── package.json
├── .env.example
└── README.md
```

## Quick Start

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### 3. Use the accessToken
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh token when expired
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 5. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Token Details

**Access Token:**
- Expires in: 15 minutes
- Used for: API requests
- Header: `Authorization: Bearer {accessToken}`

**Refresh Token:**
- Expires in: 7 days
- Used for: Getting new access tokens
- Stored in: MongoDB database

## Role-Based Access Control

- **User**: Can access their own profile, update profile, deactivate account
- **Admin**: Can access all endpoints, manage all users, change roles, delete users

## Error Handling

Common error responses:

```json
{
  "message": "Error description",
  "error": "Details"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
