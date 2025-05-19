# Linktree Clone Backend

A backend API for a Linktree-like service where users can create a profile page with multiple customizable links, enabling easy sharing of all social profiles or important links with a single URL.

---

## Features

- User registration and login (email/password and OAuth)
- Email verification workflow for user accounts
- JWT-based authentication and authorization
- CRUD operations for managing user links (create, read, update, delete)
- Public user profiles accessible by username, showing all links
- Role-based user validation (e.g., only verified users can log in)
- Structured error handling with custom error classes

---

## Technology Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication
- OAuth 2.0 (Google) for social login
- Nodemailer for email notifications
- dotenv for environment variables

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL database
- Google OAuth credentials (for social login)
- An email SMTP service for sending verification emails

---

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/linktree-clone-backend.git
cd linktree-clone-backend
```

2. Install dependencies

```bash
npm install
```

3. Set up your environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=email_password
FRONTEND_URL=http://localhost:3000
```

4. Run Prisma migrations and generate client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start the development server

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint                | Description                           | Auth Required |
| ------ | ----------------------- | ------------------------------------- | ------------- |
| POST   | `/auth/signup`          | Register a new user                   | No            |
| POST   | `/auth/login`           | Login with email and password         | No            |
| GET    | `/auth/google`          | Initiate Google OAuth login           | No            |
| GET    | `/auth/google/callback` | Google OAuth callback                 | No            |
| GET    | `/user/profile`         | Get authenticated user profile        | Yes           |
| POST   | `/links`                | Create a new link                     | Yes           |
| GET    | `/links`                | Get all links for authenticated user  | Yes           |
| PUT    | `/links/:id`            | Update an existing link               | Yes           |
| DELETE | `/links/:id`            | Delete a link                         | Yes           |
| GET    | `/:username`            | Public profile page with user’s links | No            |

---

## Project Structure

```
/src
  /controllers      # Route controllers
  /middlewares      # Middleware for auth, error handling, etc.
  /routes           # Express routes
  /utils            # Utility functions (JWT, email, encryption)
  prisma.schema     # Prisma database schema
  server.ts         # Entry point
```

---

## Notes

- Only users with verified emails (`isVerified: true`) are allowed to log in.
- JWT tokens are used to authenticate users on protected routes.
- OAuth users (Google) are automatically marked as verified.
- Email verification links expire in 15 minutes.

---

## Contribution

Feel free to open issues or submit pull requests for improvements!

---

## License

MIT License
