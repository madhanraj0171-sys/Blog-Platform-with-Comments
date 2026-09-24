# WriteSpace

> **"Write. Share. Discuss."**

A complete full-stack blogging platform with user authentication, role-based authorization, blog CRUD operations, an interactive comment system, and an admin moderation panel. Designed and developed as a college internship capstone project.

---

## 1. Project Name
**WriteSpace** — A modern, accessible editorial platform for students and developers to write articles, read technical write-ups, and engage in meaningful discussions.

---

## 2. Project Overview
WriteSpace was built to simulate a real-world production blogging system. The project features clean typography, a warm paper aesthetic, zero AI-slop design, and robust security practices including salted bcrypt password hashing and JSON Web Tokens (JWT). Users can publish articles, edit their content, comment on posts, edit and delete their comments, and search and filter posts by category and creation date.

---

## 3. Features
- **User Authentication**: Secure sign-up, login, and session persistence using JWT and bcrypt.
- **Role-Based Access Control**:
  - `user`: Can create posts, edit/delete their own posts, write comments, and edit/delete their own comments.
  - `admin`: Can moderate all blog posts, delete any comment, and inspect registered users.
- **Blog Publishing (CRUD)**:
  - Create posts with title, excerpt, full content, category, and featured image URL.
  - Edit posts (restricted strictly to the author or admin).
  - Delete posts with confirmation prompt (cascades to delete associated comments).
- **Interactive Comment System**:
  - Add comments with real-time optimistic updates.
  - Inline comment editing for comment authors.
  - Comment deletion with confirmation prompt.
- **Search, Filter & Sorting**:
  - Live search across post titles, excerpts, and content.
  - Filter by category: *Technology*, *Programming*, *Education*, *Travel*, *Lifestyle*, *Other*.
  - Sort by Newest or Oldest.
- **Author Profile**:
  - View personal profile information, registration date, and post count.
  - "My Posts" dashboard with quick View, Edit, and Delete actions.
- **Admin Moderation Dashboard**:
  - Dedicated dashboard with quick metrics (Total Users, Posts, Comments).
  - Tabular view of all registered accounts.
  - Moderate and remove inappropriate posts and comments.
- **Mobile Responsive & Accessible**:
  - Full support for desktop, laptop, tablet, and mobile displays.
  - Mobile hamburger navigation drawer.

---

## 4. Technologies Used

### Frontend
- **React.js** (Functional components, custom hooks, Context API)
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS** (Utility-first styling with typography presets)
- **Lucide Icons** (Clean, lightweight iconography)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (RESTful API routing and middleware)
- **MongoDB & Mongoose** (NoSQL document database and schema modeling)
- **jsonwebtoken (JWT)** (Stateless authorization tokens)
- **bcryptjs** (10-round salted password hashing)

---

## 5. Authentication
Authentication is implemented using JSON Web Tokens (JWT).
1. When a user registers or logs in, their password is verified using `bcrypt.compare` (passwords are never saved in plain text).
2. A signed JWT containing the user's ID, email, and role is issued with a 7-day validity.
3. Protected routes verify the token via the `Authorization: Bearer <token>` HTTP header using the `protect` middleware.
4. An `adminOnly` middleware checks if `req.user.role === 'admin'`.

### Demo Credentials for Evaluation
| Role | Email | Password |
|---|---|---|
| **Student / User** | `alex@student.edu` | `student123` |
| **Admin** | `admin@writespace.com` | `admin123` |

---

## 6. Blog Functionality
- **Listings**: Paginated / queryable grid showing cards with featured images, category tags, author, date, and read time.
- **Details**: Full article view displaying rich body text, metadata, author bio, and nested comments.
- **Ownership Verification**: Edit and Delete options are only rendered and accepted on the backend if `post.author === req.user._id` or `req.user.role === 'admin'`.

---

## 7. Comment Functionality
- Comments are linked to both the `Post` and the `User`.
- Logged-in users can post comments directly beneath any blog post.
- Comment owners can edit their comments inline or delete them.
- Admins can delete any comment directly from the post or from the Admin Dashboard.

---

## 8. Admin Functionality
- Accessible at `/admin` for users with role `admin`.
- Overview of all platform statistics: Total Users, Total Posts, Total Comments.
- Tabular views to audit users, view all articles, and delete content violating community standards.

---

## 9. Folder Structure
```
WriteSpace/
├── backend/
│   ├── models/
│   │   ├── User.js          # Mongoose schema for users
│   │   ├── Post.js          # Mongoose schema for blog posts
│   │   └── Comment.js       # Mongoose schema for comments
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth endpoints
│   │   ├── postRoutes.js    # /api/posts endpoints
│   │   ├── commentRoutes.js # /api/comments endpoints
│   │   └── adminRoutes.js   # /api/admin endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification middleware
│   │   └── adminMiddleware.js  # Role check middleware
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── adminController.js
│   ├── server.js            # Express server entry point
│   ├── seed.js              # Database seed script
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Blogs.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── .env.example
│
├── server.ts                # Integrated full-stack runner with Vite middleware
├── package.json
└── README.md
```

---

## 10. MongoDB Setup
You can use either a local MongoDB installation or MongoDB Atlas (free cloud database):

### Option A: Local MongoDB
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   ```bash
   # On macOS / Linux
   sudo systemctl start mongod
   # Or using brew
   brew services start mongodb-community
   ```
3. Your connection string will be:
   `mongodb://localhost:27017/writespace`

### Option B: MongoDB Atlas (Free Cloud Cluster)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere).
5. Click **Connect** > **Drivers** > copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/writespace?retryWrites=true&w=majority`

---

## 11. Environment Variables

### Backend `.env` (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/writespace
JWT_SECRET=writespace_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 12. Installation

Clone the repository:
```bash
git clone https://github.com/your-username/writespace.git
cd writespace
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 13. Running Backend
From the `backend` directory:
```bash
# Create .env from example
cp .env.example .env

# Run development server with auto-reload
npm run dev
```
The backend will start at `http://localhost:5000`.

---

## 14. Running Frontend
From the `frontend` directory:
```bash
# Create .env from example
cp .env.example .env

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 15. Seed Database Instructions
To populate the database with realistic sample users, articles, and discussions:
```bash
cd backend
npm run seed
```
This script creates:
- 1 Administrator account (`admin@writespace.com` / `admin123`)
- 2 Student accounts (`alex@student.edu` / `student123`, `priya@student.edu` / `priya123`)
- 4 Realistic, in-depth blog posts across Programming, Technology, and Education
- Threaded comments demonstrating real student interactions

---

## 16. API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user & return JWT | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Private |

### Blog Posts
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/posts` | Get posts (filters: search, category, sort) | Public |
| `GET` | `/api/posts/:id` | Get single post with author | Public |
| `POST` | `/api/posts` | Create new post | Private |
| `PUT` | `/api/posts/:id` | Update post | Private (Owner/Admin) |
| `DELETE` | `/api/posts/:id` | Delete post and comments | Private (Owner/Admin) |

### Comments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/posts/:id/comments` | Get comments for a post | Public |
| `POST` | `/api/posts/:id/comments` | Add a comment to a post | Private |
| `PUT` | `/api/comments/:id` | Update comment | Private (Owner) |
| `DELETE` | `/api/comments/:id` | Delete comment | Private (Owner/Admin) |

### User Profile
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users/profile/posts` | Get posts created by current user | Private |

### Admin Moderation
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all registered users | Admin only |
| `GET` | `/api/admin/posts` | List all posts | Admin only |
| `DELETE` | `/api/admin/posts/:id` | Admin delete post | Admin only |
| `GET` | `/api/admin/comments` | List all comments | Admin only |
| `DELETE` | `/api/admin/comments/:id` | Admin delete comment | Admin only |

---

## 17. GitHub Upload Instructions
To upload this project to your GitHub account:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Ensure .gitignore excludes node_modules and .env
git status

# 3. Add all files and commit
git add .
git commit -m "feat: complete WriteSpace full-stack blog platform"

# 4. Create a repository on GitHub (e.g. 'writespace')

# 5. Link remote repository and push
git remote add origin https://github.com/<your-github-username>/writespace.git
git branch -M main
git push -u origin main
```

---

## 18. Deployment Instructions

### Deploying Backend (Render / Railway)
1. Push your code to GitHub.
2. Sign up on [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Create a **New Web Service** pointing to the repository.
4. Set Root Directory to `backend`.
5. Set Build Command: `npm install`.
6. Set Start Command: `node server.js`.
7. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://writespace.vercel.app`).
   - `PORT`: `5000` (or leave default assigned by platform).

### Deploying Frontend (Vercel / Netlify)
1. Sign up on [Vercel.com](https://vercel.com).
2. Import the GitHub repository.
3. Set Root Directory to `frontend`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend service URL (e.g. `https://writespace-api.onrender.com`).
6. Click **Deploy**.

---

### Author
Developed by a Student Developer for Web Development Internship Evaluation.
Questions or feedback? Please open an issue on the GitHub repository.
