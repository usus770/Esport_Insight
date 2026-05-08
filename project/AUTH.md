# Authentication System

## Overview

The EsportInsight project now includes a complete authentication system with user registration, login, and JWT token-based authentication.

## Backend Authentication

### Dependencies Added
- `python-jose[cryptography]` - JWT token handling
- `passlib[bcrypt]` - Password hashing
- `python-multipart` - Form data handling

### Database
- User data stored in SQLite at `/data/users.db`
- Table: `users` with fields: `id`, `username`, `email`, `hashed_password`, `created_at`

### Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: User object (without password)

#### Login
- **POST** `/api/auth/login`
- **Body**: Form data with `username` and `password`
- **Response**: `{ "access_token": "string", "token_type": "bearer", "user": {...} }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user object

### Security Features
- Passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- Tokens are verified on protected endpoints
- Username and email uniqueness enforced

## Frontend Authentication

### Components
- **Login.tsx** - Login form with username/password
- **Register.tsx** - Registration form with username, email, password, and confirm password

### Features
- Automatic token storage in localStorage
- Session persistence (stays logged in on page refresh)
- Protected routes (main app requires authentication)
- Automatic login after registration
- Logout functionality

### User Flow
1. User visits app → sees login page
2. Can switch to register page
3. After registration → automatically logged in
4. After login → redirected to main app
5. Token stored in localStorage
6. On page refresh → token verified, user stays logged in
7. Logout → clears token and redirects to login

## Usage

### Register a New User
```typescript
import { register } from './api';

await register('username', 'email@example.com', 'password123');
```

### Login
```typescript
import { login } from './api';

const result = await login('username', 'password123');
// Token automatically stored in localStorage
```

### Access Protected Endpoints
```typescript
// Token automatically included in requests via getAuthHeaders()
import { predictWinProbability } from './api';

await predictWinProbability(features);
```

### Logout
```typescript
import { removeToken } from './api';

removeToken();
```

## Testing

### Register via API
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Login via API
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=test123"
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

## Notes

- Passwords must be at least 6 characters (enforced in frontend)
- Usernames and emails must be unique
- Tokens expire after 30 days
- User database is automatically created on first startup
- All passwords are hashed before storage





