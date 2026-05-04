# TaskFlow — Team Task Manager

A full-stack team task management web app built with React, Node.js, Express, and MongoDB.

## Features

-Authentication — JWT-based signup/login with role selection (Admin/Member)
-Projects — Create, manage, and delete projects with status, priority, deadlines, and tags
-Tasks — Kanban board with To Do / In Progress / Review / Done columns
-Team Management — Add/remove members per project, assign tasks, manage roles
-Dashboard — Real-time stats: task breakdown, overdue tasks, recent activity
-Role-Based Access Control — Admins can manage all projects/users; members can only access their own

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd team-task-manager
npm run install-all
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### 3. Run in Development
```bash
# For BE
npm run dev
# For FE
npm run start
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project + tasks |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |
| GET | `/api/projects/:id/stats` | Project statistics |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (filtered) |
| GET | `/api/tasks/dashboard` | Dashboard statistics |
| GET | `/api/tasks/project/:projectId` | Tasks by project |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/comments` | Add comment |

### Users & Team
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id/role` | Change role (admin only) |
| GET | `/api/teams/members` | Team members across projects |


## 🛠 Tech Stack

- **Frontend**: React 18, React Router 6, Tailwind CSS, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator
- **Deployment**: Railway (backend), Vercel (frontend)
