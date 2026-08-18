# TalentBridge

A LinkedIn-style professional networking platform (MERN stack) built to match the TalentBridge SRS: user registration & authentication, profile management, a news feed with posts/likes/comments, professional connections, a job portal, direct messaging, and notifications.

## Tech Stack
- Frontend: React 18 (Vite), React Router, Axios, react-icons
- Backend: Node.js, Express 5
- Database: MongoDB (Atlas or local) via Mongoose
- Auth: JWT + bcrypt (this scaffold implements auth directly with JWT rather than Firebase — see the note below if you want to keep Firebase Authentication as stated in the SRS)
- File uploads: Multer (profile pictures, cover photos, post images)

## Project Structure
```
TalentBridge/
├── client/            React frontend (Vite)
│   └── src/
│       ├── components/    Navbar, PostCard, ProtectedRoute
│       ├── pages/          Login, Signup, Home, Profile, Search, Connections, Jobs, Messages, Notifications, Settings
│       ├── context/         AuthContext (global auth state)
│       └── services/        api.js (Axios instance)
├── server/             Express backend
│   ├── config/           db.js (MongoDB connection)
│   ├── models/            User, Post, Job, Message, Notification, ConnectionRequest
│   ├── controllers/       Business logic per feature
│   ├── routes/            REST API endpoints
│   └── middleware/       auth.js (JWT verification), upload.js (Multer)
└── README.md
```

## 1. Prerequisites
- Node.js 18+ and npm installed
- A MongoDB Atlas cluster (free tier is fine) — or a local MongoDB instance
- Git

## 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```
Run it:
```bash
npm run dev
```
The API will be live at `http://localhost:5000`.

## 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
```
Edit `.env` if needed (defaults to `http://localhost:5000/api`):
```
VITE_API_URL=http://localhost:5000/api
```
Run it:
```bash
npm run dev
```
The app will be live at `http://localhost:5173`.

## 4. Test the flow
1. Open `http://localhost:5173/signup` and create an account.
2. You'll be redirected to the Home feed — create a post.
3. Open a second browser (or incognito) and sign up as a second user.
4. Use Search to find the first user, visit their profile, and click Connect.
5. Accept the request from the Connections page (as the first user).
6. Try Messages, Jobs (post a job + apply), and Notifications.

## Note on Authentication (Firebase vs JWT)
Your SRS lists Firebase Authentication as the auth provider. This scaffold uses a self-contained JWT + bcrypt system instead, because it keeps the whole stack runnable without any external service setup or billing account, which is ideal while you're building and testing. If your evaluators specifically require Firebase Authentication, swap `server/controllers/authController.js` and `client/src/context/AuthContext.jsx` to call the Firebase Auth SDK/Admin SDK instead — the rest of the app (models, routes, protected pages) will work unchanged since they only care about a verified `userId`.

## API Reference (quick list)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/me | Get current user (protected) |
| GET | /api/users/:id | Get a profile |
| PUT | /api/users/profile | Update own profile |
| POST | /api/users/upload-picture | Upload profile/cover photo |
| POST | /api/posts | Create a post |
| GET | /api/posts/feed | Get the news feed |
| GET | /api/posts/user/:id | Get a user's posts |
| PUT | /api/posts/:id | Edit a post |
| DELETE | /api/posts/:id | Delete a post |
| PUT | /api/posts/:id/like | Like/unlike a post |
| POST | /api/posts/:id/comment | Comment on a post |
| POST | /api/jobs | Post a job |
| GET | /api/jobs | List/search jobs |
| PUT | /api/jobs/:id/apply | Apply to a job |
| DELETE | /api/jobs/:id | Delete own job posting |
| POST | /api/connections/request/:userId | Send connection request |
| PUT | /api/connections/respond/:requestId | Accept/reject request |
| GET | /api/connections/pending | List incoming requests |
| GET | /api/connections | List my connections |
| GET | /api/messages | List conversations (inbox) |
| POST | /api/messages/:receiverId | Send a message |
| GET | /api/messages/:otherUserId | Get a conversation |
| GET | /api/notifications | List notifications |
| PUT | /api/notifications/:id/read | Mark one as read |
| PUT | /api/notifications/read-all | Mark all as read |
| GET | /api/search?q= | Search users and jobs |

## 5. Deployment (per your SRS)
- **Frontend → Vercel**: import the `client/` folder as a project, set the `VITE_API_URL` environment variable to your deployed backend URL, build command `npm run build`, output directory `dist`.
- **Backend → Render**: create a Web Service pointing at the `server/` folder, set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (your Vercel URL) as environment variables, start command `npm start`.
- **Database → MongoDB Atlas**: whitelist Render's outbound IPs (or `0.0.0.0/0` for simplicity in an academic project) in Atlas Network Access.

## 6. Suggested build order (matches your Phase 8 plan)
1. Auth (done — register/login/protected routes)
2. Profile (done — view/edit, photo upload)
3. Home feed (done — create/like/comment)
4. Search (done)
5. Connections (done — request/accept/reject)
6. Messaging (done)
7. Notifications (done)
8. Jobs (done)
9. Settings (basic scaffold — extend as needed, e.g. change password, notification preferences)

Everything above is implemented and runnable now — this isn't a stub. From here, focus on polish: form validation messages, loading skeletons, pagination on the feed, and image compression before upload.
