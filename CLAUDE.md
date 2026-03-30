# 🧠 BrainCheck - Quiz Application

## ⚠️ Important Notes
- **IGNORE**: `SA.docx`, `SA.pdf` files
- **Architecture diagrams**: See `/diagrams` folder (PDFs with system components, DB schema, auth flows)
- **Updated**: March 2026 - Containerized with Docker, dependencies updated, security vulnerabilities fixed

---

## 📋 Project Overview

**BrainCheck** is a full-stack quiz application that allows users to create, share, and take quizzes with real-time statistics and scoring.

### Tech Stack

#### Backend (Server/)
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.22.1
- **ORM**: Sequelize 6.37.8
- **Database**: MySQL 8.0 (mysql2 driver)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer 8.0.4
- **Validation**: express-validator 7.3.1
- **File Upload**: Multer 1.4.5-lts.2
- **Testing**: Vitest 4.1.2

#### Frontend (UI/)
- **Library**: React 18.3.1
- **Router**: React Router 6.30.3
- **UI Framework**: Bootstrap 5.3.8 + React Bootstrap 2.10.10
- **Charts**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **Testing**: React Testing Library 16.3.2

#### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (auto-build & publish to ghcr.io)
- **Web Server**: Nginx (for production UI)

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React UI  │─────▶│  Express    │─────▶│   MySQL     │
│   (Port     │◀─────│  API Server │◀─────│   Database  │
│    3000)    │      │  (Port 3001)│      │             │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │
      │                     │
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│   Nginx     │      │  Nodemailer │
│  (Reverse   │      │  (Email     │
│   Proxy)    │      │   Service)  │
└─────────────┘      └─────────────┘
```

### Database Models (Sequelize ORM)

**Auth Module:**
- `User` - User accounts with roles (user/admin)

**Quiz Module:**
- `Quiz` - Quiz metadata (title, category, visibility)
- `Question` - Base question model
- `TrueOrFalse` - Boolean questions
- `ChoiceOne` - Single choice questions
- `MultipleChoice` - Multiple choice questions
- `FillInTheBlank` - Text input questions
- `Option` - Answer options for choice questions
- `Participant` - Quiz participants and their answers

**Statistics Module:**
- `Statistics` - Quiz statistics
- `Score` - Individual user scores
- `Answer` - Submitted answers for analytics

**Enums:**
- `QUESTIONTYPE`: TRUEORFALSE, CHOICEONE, MULTIPLECHOICE, FILLINTHEBLANK
- `QUIZCATEGORY`: ALLGEMEIN, MATH, SPORT, SCIENCE, FUN
- `VISIBILITY`: PRIVATE, PUBLIC

---

## 📁 Project Structure

### Server/ (Backend)
```
Server/
├── app.js                    # Express app configuration
├── index.js                  # Server entry point (dev/test mode)
├── routes/                   # API route definitions
│   ├── admin.js             # Admin-only routes
│   ├── auth.js              # Authentication routes (login, signup, verify)
│   ├── loaders.js           # Data loader endpoints
│   ├── quiz.js              # Quiz CRUD operations
│   ├── statistic.js         # Statistics endpoints
│   └── user.js              # User profile operations
├── controller/              # Business logic handlers
│   ├── admin/               # Admin panel actions
│   ├── auth/                # Auth controllers (login, signup, email verification)
│   ├── loader/              # Data loading controllers
│   ├── quiz/                # Quiz controllers (create, answer, delete)
│   ├── statistic/           # Statistics generation
│   └── user/                # User profile management
├── middleware/
│   ├── is-auth.js           # JWT authentication middleware
│   └── is-admin.js          # Admin role verification
├── module/                  # Sequelize models
│   ├── auth/
│   │   ├── user.js          # User model
│   │   └── email.js         # Email verification model
│   ├── quiz/
│   │   ├── quiz.js          # Quiz model
│   │   ├── participant.js   # Participant model
│   │   └── question/        # Question models (polymorphic)
│   │       ├── question.js
│   │       ├── trueOrFalse.js
│   │       ├── choiceone.js
│   │       ├── multipleChoice.js
│   │       ├── fillInTheBlank.js
│   │       └── option.js
│   ├── chart/               # Statistics models
│   │   ├── statistics.js
│   │   ├── scoure.js
│   │   └── answer.js
│   └── enum/                # Enumerations
├── util/
│   ├── db.js                # Sequelize database connection
│   ├── db_relation.js       # Model associations
│   ├── mail.js              # Email sending utility
│   ├── quiz/                # Quiz utilities
│   │   ├── calculat_score.js
│   │   └── create_quiz_object.js
│   ├── statistics/          # Statistics utilities
│   │   ├── ubdate_statistic.js
│   │   ├── create_chart_bar_obj.js
│   │   ├── create_chart_doughnut_obj.js
│   │   └── chart_bar_data_update.js
│   └── validation/          # Input validation
│       ├── requestValidation.js
│       ├── answer_validation.js
│       └── create_validation.js
├── tests/                   # Vitest test files
└── tester_util/             # Test data generators
```

### UI/ (Frontend)
```
UI/
├── public/                  # Static assets
├── src/
│   ├── index.js             # React entry point
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── lists/       # List components
│   │   │   └── nav/         # Navigation components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   ├── profile/         # Profile components
│   │   └── quiz-elements/   # Quiz-specific components
│   │       ├── questions/   # Question type components
│   │       ├── showResult/  # Result display
│   │       └── view/        # Quiz view components
│   ├── views/               # Page components (React Router)
│   │   ├── admin/           # Admin control panel
│   │   ├── auth/            # Auth pages (login, signup, verify)
│   │   ├── home/            # Home page
│   │   ├── quiz/            # Quiz pages (create, view, answer)
│   │   ├── profielPage/     # User profile
│   │   ├── statisticPage/   # Statistics dashboard
│   │   ├── layout/          # Root layout
│   │   └── error/           # Error pages
│   ├── util/
│   │   ├── enum/            # Enums (matches backend)
│   │   ├── hooks/           # Custom React hooks (use-input, use-search)
│   │   ├── validation/      # Form validation
│   │   ├── fetch_function.js # API calls
│   │   ├── storeToken.js    # JWT token management
│   │   └── createQuestionObject.js
│   ├── css/                 # Stylesheets
│   ├── img/                 # Images
│   └── resources/           # Other resources
└── nginx.conf               # Nginx config for production
```

---

## 🔑 Key Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (User/Admin)
- ✅ Email verification system
- ✅ Password reset functionality

### Quiz Management
- ✅ Create quizzes with multiple question types
- ✅ 4 Question types: True/False, Single Choice, Multiple Choice, Fill-in-the-Blank
- ✅ Quiz categories: General, Math, Sport, Science, Fun
- ✅ Public/Private visibility settings
- ✅ Quiz sharing and participation
- ✅ Real-time answer submission

### Statistics & Analytics
- ✅ User performance tracking
- ✅ Quiz statistics (completion rate, average score)
- ✅ Chart.js visualizations (bar charts, doughnut charts)
- ✅ Answer analytics
- ✅ Leaderboard functionality

### Admin Panel
- ✅ User management
- ✅ Quiz moderation
- ✅ System statistics
- ✅ Content management

---

## 🚀 API Endpoints

### Auth (`/auth`)
- `POST /signup` - User registration
- `POST /login` - User login (returns JWT)
- `GET /verify-email/:token` - Email verification
- `POST /reset-password` - Password reset request
- `PUT /update-password` - Update password

### Quiz (`/quiz`)
- `POST /create` - Create new quiz (requires auth)
- `GET /:quizId` - Get quiz details
- `POST /:quizId/answer` - Submit quiz answers (requires auth)
- `DELETE /:quizId` - Delete quiz (requires auth + ownership)
- `GET /public` - List public quizzes
- `GET /my-quizzes` - Get user's quizzes (requires auth)

### User (`/user`)
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update profile (requires auth)
- `GET /quizzes` - Get user's quiz history

### Statistics (`/statistics`)
- `GET /quiz/:quizId` - Quiz statistics
- `GET /user/:userId` - User statistics
- `GET /leaderboard/:quizId` - Quiz leaderboard

### Admin (`/admin`)
- `GET /users` - List all users (requires admin)
- `DELETE /user/:userId` - Delete user (requires admin)
- `GET /quizzes` - List all quizzes (requires admin)
- `PUT /quiz/:quizId/visibility` - Change quiz visibility

### Loaders (`/loader`)
- `GET /categories` - Get quiz categories
- `GET /question-types` - Get question types

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# API Security
API_KEY=your_secret_api_key

# Database Configuration
SCHEMA=braincheck
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_TYPE=mysql
DB_HOST=localhost  # Use 'db' in Docker

# Email Configuration (Nodemailer)
MailKey=your_smtp_password
MailHOST=smtp.gmail.com
MailPORT=587
MailUSER=your_email@gmail.com

# Frontend (Optional)
REACT_APP_API_URL=http://localhost:3001
```

---

## 🐳 Docker Deployment

### Quick Start
```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your values

# 2. Start all services
docker-compose up -d

# 3. Access application
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Database: localhost:3306
```

### Services
- **db**: MySQL 8.0 database
- **server**: Node.js backend (Express API)
- **ui**: React frontend (Nginx)

See `README.Docker.md` for complete Docker documentation.

---

## 🛠️ Development

### Prerequisites
- Node.js 20.x or higher
- MySQL 8.0
- npm 9.x or higher

### Local Development

#### Backend
```bash
cd Server
npm install
# Configure .env file
npm start  # Runs with nodemon (auto-reload)
npm test   # Run Vitest tests
```

#### Frontend
```bash
cd UI
npm install
npm start  # Starts dev server on port 3000
npm test   # Run tests
npm run build  # Production build
```

---

## 📊 Database Schema

See `/diagrams/db.pdf` and `/diagrams/schema.pdf` for detailed ER diagrams.

**Key Relations:**
- User 1:N Quiz (creator)
- Quiz 1:N Question
- Quiz 1:N Participant
- Question 1:N Option
- User 1:N Participant (quiz taker)
- Quiz 1:1 Statistics

---

## 🧪 Testing

### Backend Tests (Vitest)
- Located in `Server/tests/`
- Tests run before server starts in dev mode
- Test preparation & cleanup scripts included

### Frontend Tests (React Testing Library)
- Component tests
- Integration tests
- Uses Jest + Testing Library

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Password hashing (bcryptjs)
- ✅ Email verification
- ✅ Input validation (express-validator)
- ✅ CORS configuration
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection
- ✅ Rate limiting ready (can be added)

**Recent Security Updates (March 2026):**
- Express 4.16.3 → 4.22.1 (DoS fixes)
- React Router 6.17.0 → 6.30.3 (XSS fix)
- Nodemailer 6.9.7 → 8.0.4 (SMTP injection fix)
- Body-parser updated (DoS fix)

---

## 📦 Dependencies Summary

### Production Dependencies (26 total)
**Backend:** bcryptjs, body-parser, dotenv, express, express-validator, jsonwebtoken, multer, mysql2, nodemailer, randomcolor, sequelize, uuid

**Frontend:** react, react-dom, react-router-dom, bootstrap, react-bootstrap, chart.js, react-chartjs-2, web-vitals

See `DEPENDENCY_UPDATE.md` for complete update history.

---

## 👥 User Roles

### Default Admin User (Dev Mode)
- Email: `admin@admin.de`
- Password: `admin`
- Role: `admin`

### Test Users (Dev Mode)
- Auto-generated: `1-user@test.de` to `50-user@test.de`
- Default password: `root`

---

## 📚 Additional Documentation

- `README.md` - Setup instructions (German)
- `README.Docker.md` - Docker deployment guide
- `DEPENDENCY_UPDATE.md` - Dependency update history
- `/diagrams/*.pdf` - Architecture and flow diagrams
  - `System Componenten Digramm.pdf` - System architecture
  - `db.pdf` - Database schema
  - `auth.pdf` - Authentication flow
  - `login.pdf` / `signup.pdf` - Auth flows
  - `create_quiz.pdf` - Quiz creation flow
  - `Create&&Antwort_Quiz.pdf` - Quiz answering flow
  - `statistic_update.pdf` - Statistics calculation

---

## 🎯 Skills & Technologies Demonstrated

### Backend Development
- RESTful API design
- MVC architecture
- ORM/Database modeling (Sequelize)
- Authentication & Authorization (JWT)
- Email integration
- File uploads
- Input validation
- Error handling
- Testing (Vitest)

### Frontend Development
- React 18 (Hooks, Context)
- React Router (SPA navigation)
- Form handling & validation
- Custom hooks
- Chart.js integration
- Bootstrap UI framework
- Responsive design

### DevOps & Deployment
- Docker containerization
- Docker Compose orchestration
- Multi-stage builds
- GitHub Actions CI/CD
- Nginx configuration
- Environment management

### Software Engineering Practices
- Modular code organization
- Separation of concerns
- DRY principles
- Security best practices
- Version control (Git)
- Documentation

---

## 🏃 Common Commands

```bash
# Development
npm start                    # Start with tests & hot-reload
npm test                     # Run tests only
npm run checkStyle          # Format with Prettier

# Docker
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop services

# Database
docker-compose exec db mysql -u root -p  # Access MySQL CLI
```

---

## 📝 Notes for AI Assistants

- Database relations are configured in `Server/util/db_relation.js`
- Question types use polymorphic associations
- Statistics are calculated and cached for performance
- Email verification is optional (can be disabled for testing)
- The app uses force sync in dev mode (WARNING: drops tables on restart)
- Production mode should NOT use `{ force: true }` in Sequelize sync
