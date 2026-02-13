# Authify - Full Stack Authentication System

A comprehensive authentication system built with Node.js and Express, featuring user registration, login/logout, email verification, and password reset functionality.

## Features

- ✅ **User Registration** - Create new user accounts with password hashing
- ✅ **User Login** - Authenticate users with email and password
- ✅ **User Logout** - Secure session termination
- ✅ **JWT Authentication** - Token-based authentication with 7-day expiration
- ✅ **Password Hashing** - Secure password storage using bcrypt
- 🔄 **Email Verification** - Verify user email addresses (In Progress)
- 🔄 **Forgot Password** - Reset forgotten passwords (In Progress)
- 🔄 **Reset Password** - Secure password reset functionality (In Progress)
- 🛡️ **CSRF Protection** - SameSite cookie policy for security
- 🍪 **HTTP-Only Cookies** - Secure token storage

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer
- **Security:** Crypto

## Project Structure

```
User- Auth system/
├── Server/
│   ├── controllers/
│   │   └── authController.js      # Authentication logic
│   ├── models/
│   │   └── usermodel.js           # User schema & model
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js                  # Main server file
├── .env                           # Environment variables
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yamansharma5/Authify---Full-Stack-Authentication-System.git
   cd "User- Auth system"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/authify
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** `{ "success": true, "message": "User registered successfully" }`

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** `{ "success": true, "message": "User logged in successfully" }`

#### Logout User
- **POST** `/api/auth/logout`
- **Response:** `{ "success": true, "message": "User logged out successfully" }`

#### Verify Email
- **POST** `/api/auth/verify-email`
- *Status: In Development*

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- *Status: In Development*

#### Reset Password
- **POST** `/api/auth/reset-password`
- *Status: In Development*

## Security Features

- 🔐 **Password Hashing** - Bcrypt with 10 salt rounds
- 🎫 **JWT Tokens** - 7-day expiration
- 🍪 **HTTP-Only Cookies** - Protection against XSS attacks
- 🛡️ **CSRF Protection** - SameSite cookie policy set to "strict"
- 📧 **Email Verification** - Prevent fake email registrations
- 🔑 **Password Reset** - Secure token-based password reset

## Usage Example

### Register & Login Flow
```javascript
// Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

// Logout
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST'
});
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `EMAIL_USER` | Email for Nodemailer | Yes |
| `EMAIL_PASSWORD` | Email app password | Yes |

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common error messages:
- "Please fill all the fields" - Missing required fields
- "User already exists" - Email already registered
- "Invalid email or password" - Incorrect credentials
- "Internal Server Error" - Server-side error

## Future Enhancements

- [ ] Email verification with OTP
- [ ] Forgot password functionality
- [ ] Reset password with secure token
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Rate limiting
- [ ] Account lockout after failed attempts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Yaman Sharma**
- GitHub: [@yamansharma5](https://github.com/yamansharma5)
- Repository: [Authify - Full Stack Authentication System](https://github.com/yamansharma5/Authify---Full-Stack-Authentication-System)

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Last Updated:** February 13, 2026
