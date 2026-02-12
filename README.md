# Ticket AI — AI-Powered Support Ticket Management System

> An intelligent, full-stack support ticket management platform that leverages AI (Gemini 2.0 Flash) to automatically triage, prioritize, and assign support tickets to the most qualified moderators based on skill matching.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Entry Point](#entry-point)
  - [Database Layer](#database-layer)
  - [Data Models](#data-models)
  - [Authentication & Authorization](#authentication--authorization)
  - [API Routes & Controllers](#api-routes--controllers)
  - [AI Agent Pipeline](#ai-agent-pipeline)
  - [Background Job Processing (Inngest)](#background-job-processing-inngest)
  - [Email System](#email-system)
  - [Utilities](#utilities)
- [Frontend](#frontend)
  - [Application Shell](#application-shell)
  - [State Management](#state-management)
  - [Routing & Auth Guard](#routing--auth-guard)
  - [Pages](#pages)
  - [Reusable Components](#reusable-components)
  - [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React SPA)                         │
│  React 19 · Redux Toolkit · React Router v7 · Tailwind CSS v4      │
│  DaisyUI · Framer Motion · React Hook Form · Lucide Icons           │
└──────────────────────┬───────────────────────────────────────────────┘
                       │  REST API (JSON over HTTPS)
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        SERVER (Express v5)                          │
│  JWT Auth · Cookie-based Sessions · CORS · Bcrypt Hashing           │
│  Inngest Event Bus · AI Agent Kit (Gemini 2.0 Flash)                │
└────────┬────────────────────┬────────────────────┬───────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌────────────────────┐
│   MongoDB    │   │     Inngest      │   │  Resend / Mailtrap │
│  (Mongoose)  │   │ (Background Jobs)│   │  (Transactional    │
│              │   │                  │   │   Email Delivery)  │
└──────────────┘   └──────────────────┘   └────────────────────┘
```

**Request lifecycle for ticket creation:**

1. Authenticated user submits a ticket via `POST /api/tickets`
2. Ticket is persisted in MongoDB with status `TODO`
3. An Inngest event `ticket/created` is dispatched
4. Inngest orchestrates a multi-step background pipeline:
   - Fetches the ticket from the database
   - Sends the ticket to the **Gemini 2.0 Flash** AI agent for triage
   - AI returns `priority`, `helpfulNotes`, `summary`, and `relatedSkills`
   - The ticket is updated with AI analysis results
   - A moderator with matching skills is auto-assigned (falls back to admin)
5. The frontend reflects the updated ticket in real time on the next fetch

---

## Tech Stack

### Backend

| Technology                | Version  | Purpose                                          |
| ------------------------- | -------- | ------------------------------------------------ |
| **Node.js**               | 18+      | JavaScript runtime                               |
| **Express**               | 5.1.0    | HTTP server framework                             |
| **Mongoose**              | 8.15.1   | MongoDB ODM with schema validation                |
| **Inngest**               | 3.38.0   | Durable event-driven background job orchestration |
| **@inngest/agent-kit**    | 0.8.0    | AI agent framework (Gemini 2.0 Flash integration) |
| **jsonwebtoken**          | 9.0.2    | JWT-based stateless authentication                |
| **bcrypt**                | 6.0.0    | Password hashing (salted, one-way)                |
| **Resend**                | 4.7.0    | Production transactional email delivery           |
| **Nodemailer**            | 7.0.3    | SMTP email transport (development / Mailtrap)     |
| **React Email**           | 4.2.6    | React-based email template rendering              |
| **cookie-parser**         | 1.4.7    | HTTP cookie parsing middleware                    |
| **cors**                  | 2.8.5    | Cross-Origin Resource Sharing middleware           |
| **dotenv**                | 16.5.0   | Environment variable management                   |

### Frontend

| Technology                | Version  | Purpose                                          |
| ------------------------- | -------- | ------------------------------------------------ |
| **React**                 | 19.1.0   | UI library                                        |
| **React DOM**             | 19.1.0   | DOM rendering engine                              |
| **Vite**                  | 6.3.5    | Build tool and dev server with HMR                |
| **React Router DOM**      | 7.6.2    | Client-side routing with nested layouts            |
| **Redux Toolkit**         | 2.8.2    | Centralized state management                      |
| **React Redux**           | 9.2.0    | React bindings for Redux                          |
| **React Hook Form**       | 7.57.0   | Performant, hook-based form validation             |
| **Tailwind CSS**          | 4.1.9    | Utility-first CSS framework                       |
| **DaisyUI**               | 5.0.43   | Tailwind CSS component library                     |
| **Framer Motion**         | 12.23.12 | Declarative animations and transitions             |
| **Lucide React**          | 0.515.0  | Icon library (tree-shakeable SVG icons)            |
| **React Toastify**        | 11.0.5   | Toast notification system                          |
| **clsx / tailwind-merge** | —        | Conditional and conflict-free class name merging   |
| **usehooks-ts**           | 3.1.1    | Type-safe custom React hooks                       |

---

## Project Structure

```
ai-agent/
├── README.md                         # This file
├── Backend/
│   ├── index.js                      # Express server entry point
│   ├── package.json                  # Backend dependencies & scripts
│   ├── controllers/
│   │   ├── ticket.controller.js      # Ticket CRUD operations
│   │   └── user.controller.js        # Auth, profile, admin operations
│   ├── db/
│   │   └── ConnectDB.js              # MongoDB connection via Mongoose
│   ├── emails/
│   │   ├── ForgotPasswordEmail.js    # OTP email template (React Email)
│   │   ├── RegistrationEmail.jsx     # Welcome email template
│   │   └── TicketEmail.jsx           # Ticket assignment email template
│   ├── helpers/
│   │   ├── sendForgotPasswordEmail.js # Forgot password email dispatch
│   │   ├── sendRegistrationEmail.js   # Registration email dispatch
│   │   └── sendTicketEmail.js         # Ticket notification email dispatch
│   ├── inngest/
│   │   ├── client.js                 # Inngest client initialization
│   │   └── functions/
│   │       ├── on-signup.js          # Post-signup background pipeline
│   │       ├── on-ticket-create.js   # Ticket triage AI pipeline
│   │       └── render-keep-alive.js  # Server keep-alive cron job
│   ├── middlewares/
│   │   └── auth.middleware.js        # JWT authentication middleware
│   ├── models/
│   │   ├── ticket.model.js           # Ticket Mongoose schema
│   │   └── user.model.js             # User Mongoose schema
│   ├── routes/
│   │   ├── ticket.route.js           # Ticket API routes
│   │   └── user.route.js             # User/Auth API routes
│   └── utils/
│       ├── ai-agent.js               # Gemini AI agent configuration
│       ├── ApiResponse.js            # Standardized API response class
│       ├── mailer.js                 # Nodemailer SMTP transport
│       └── resend.js                 # Resend client initialization
├── Front-End/
│   ├── index.html                    # SPA HTML shell
│   ├── package.json                  # Frontend dependencies & scripts
│   ├── vite.config.js                # Vite build & dev config with proxy
│   ├── vercel.json                   # Vercel SPA rewrite rules
│   ├── eslint.config.js              # ESLint configuration
│   ├── public/                       # Static assets
│   └── src/
│       ├── main.jsx                  # Application entry & route definitions
│       ├── index.css                 # Global design system & utility classes
│       ├── assets/                   # Static assets (images, fonts)
│       ├── components/
│       │   ├── AuthCheck.jsx         # Authentication guard HOC
│       │   ├── ConfirmModal.jsx      # Reusable confirmation dialog
│       │   ├── Cursor.jsx            # Custom animated cursor effect
│       │   └── Navbar.jsx            # Global navigation bar
│       ├── features/
│       │   └── data/
│       │       └── dataSlice.js      # Redux slice for user state
│       ├── pages/
│       │   ├── Admin.jsx             # Admin user management panel
│       │   ├── ForgotPassword.jsx    # Password reset initiation
│       │   ├── Login.jsx             # User login page
│       │   ├── Profile.jsx           # User profile view & edit
│       │   ├── ResetPassword.jsx     # New password submission
│       │   ├── SignUp.jsx            # User registration page
│       │   ├── Ticket.jsx            # Single ticket detail view
│       │   ├── Tickets.jsx           # Ticket dashboard (list/create/delete)
│       │   └── VerifyOtp.jsx         # OTP verification step
│       └── store/
│           └── Store.js              # Redux store configuration
```

---

## Backend

### Entry Point

**File:** `Backend/index.js`

Bootstraps the Express v5 server with the following middleware chain:

1. **Static file serving** — Serves the production-built frontend from `dist/`
2. **CORS** — Conditionally applied in development mode only (`http://localhost:5173`)
3. **Body parser** — `express.json()` for JSON request body parsing
4. **Cookie parser** — `cookie-parser` for reading `accessToken` cookies
5. **Route mounting** — Auth routes on `/api/auth`, ticket routes on `/api/tickets`
6. **Inngest serve endpoint** — `/api/inngest` with registered functions and signing key

The server connects to MongoDB before binding to `process.env.PORT` (default `8000`).

---

### Database Layer

**File:** `Backend/db/ConnectDB.js`

Establishes a MongoDB connection using Mongoose. Connects to the URI specified in `MONGO_URI` environment variable. Logs the database host on success. Calls `process.exit(1)` on connection failure to prevent the server from running without a database.

---

### Data Models

#### User Model (`Backend/models/user.model.js`)

| Field            | Type       | Constraints                              | Default |
| ---------------- | ---------- | ---------------------------------------- | ------- |
| `email`          | `String`   | Required, Unique                         | —       |
| `password`       | `String`   | Required (bcrypt-hashed)                 | —       |
| `name`           | `String`   | —                                        | `""`    |
| `phone`          | `String`   | —                                        | `""`    |
| `location`       | `String`   | —                                        | `""`    |
| `bio`            | `String`   | Max 300 chars                            | `""`    |
| `role`           | `String`   | Enum: `user`, `moderator`, `admin`       | `user`  |
| `skills`         | `[String]` | Array of skill identifiers               | `[]`    |
| `resetOtp`       | `String`   | SHA-256 hashed OTP                       | `null`  |
| `resetOtpExpiry` | `Date`     | OTP expiry timestamp                     | `null`  |
| `isOtpVerified`  | `Boolean`  | OTP verification flag                    | `false` |
| `createdAt`      | `Date`     | Auto-generated (timestamps)              | —       |
| `updatedAt`      | `Date`     | Auto-generated (timestamps)              | —       |

#### Ticket Model (`Backend/models/ticket.model.js`)

| Field           | Type         | Constraints                                 | Default |
| --------------- | ------------ | ------------------------------------------- | ------- |
| `title`         | `String`     | Ticket subject line                         | —       |
| `description`   | `String`     | Detailed issue description                  | —       |
| `status`        | `String`     | Enum: `TODO`, `PENDING`, `IN PROGRESS`      | `TODO`  |
| `createdBy`     | `ObjectId`   | Ref → `User`                                | —       |
| `assignedTo`    | `ObjectId`   | Ref → `User` (AI-assigned)                  | `null`  |
| `priority`      | `String`     | AI-determined: `low`, `medium`, `high`      | —       |
| `deadline`      | `Date`       | Optional deadline                           | —       |
| `helpfulNotes`  | `String`     | AI-generated resolution guidance            | —       |
| `relatedSkills` | `[String]`   | AI-identified required skills               | `[]`    |
| `createdAt`     | `Date`       | Auto-generated (timestamps)                 | —       |
| `updatedAt`     | `Date`       | Auto-generated (timestamps)                 | —       |

---

### Authentication & Authorization

#### Middleware (`Backend/middlewares/auth.middleware.js`)

The `authenticate` middleware extracts the JWT from:
1. `accessToken` cookie (primary — via `cookie-parser`)
2. `Authorization: Bearer <token>` header (fallback)

The token is verified against `JWT_SECRET`. On success, the decoded payload (`_id`, `role`, `email`) is attached to `req.user`. All protected routes use this middleware.

#### Token Configuration

- **Algorithm:** HS256 (default `jsonwebtoken`)
- **Expiry:** 7 days
- **Cookie options:** `httpOnly: false`, `secure: true`, `sameSite: "none"`, `maxAge: 7 days`

#### Role-Based Access Control (RBAC)

| Role          | Permissions                                                               |
| ------------- | ------------------------------------------------------------------------- |
| **user**      | Create tickets, view own tickets, delete own tickets, manage own profile  |
| **moderator** | All user permissions + view assigned tickets                              |
| **admin**     | All permissions + view all tickets, manage users, assign roles/skills      |

---

### API Routes & Controllers

#### Authentication Routes — `POST /api/auth/*`

| Method | Endpoint                  | Auth | Controller          | Description                                         |
| ------ | ------------------------- | ---- | ------------------- | --------------------------------------------------- |
| POST   | `/api/auth/signup`        | No   | `signUp`            | Register with email, password, optional skills       |
| POST   | `/api/auth/login`         | No   | `login`             | Authenticate and receive JWT cookie                  |
| POST   | `/api/auth/logout`        | No   | `logout`            | Clear `accessToken` cookie                           |
| POST   | `/api/auth/forgot-password` | No | `forgotPassword`    | Generate and email a 6-digit OTP                     |
| POST   | `/api/auth/verify-otp`    | No   | `verifyOtp`         | Verify the OTP before password reset                 |
| POST   | `/api/auth/reset-password`| No   | `resetPassword`     | Set new password (requires verified OTP)             |
| POST   | `/api/auth/update-user`   | Yes  | `updateUser`        | Admin-only: update user role and skills              |
| GET    | `/api/auth/users`         | Yes  | `getUsers`          | Admin-only: list all users                           |
| GET    | `/api/auth/search/:email` | No   | `searchUser`        | Regex-based user search by email                     |
| GET    | `/api/auth/me`            | Yes  | `authenticateUser`  | Validate token and return current user               |
| GET    | `/api/auth/profile`       | Yes  | `getProfile`        | Get profile data with ticket statistics              |
| PUT    | `/api/auth/profile`       | Yes  | `updateProfile`     | Update name, phone, location, bio                    |

#### Ticket Routes — `/api/tickets/*`

| Method | Endpoint              | Auth | Controller     | Description                                      |
| ------ | --------------------- | ---- | -------------- | ------------------------------------------------ |
| POST   | `/api/tickets`        | Yes  | `createTicket` | Create ticket and trigger AI pipeline             |
| GET    | `/api/tickets`        | Yes  | `getTickets`   | List tickets (admin: all; user: own/assigned)     |
| GET    | `/api/tickets/:id`    | Yes  | `getTicket`    | Get single ticket detail                          |
| DELETE | `/api/tickets/:id`    | Yes  | `deleteTicket` | Delete ticket (admin or creator only)             |

#### Standardized API Response

All API responses use the `ApiResponse` class:

```js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
```

---

### AI Agent Pipeline

**File:** `Backend/utils/ai-agent.js`

Utilizes **@inngest/agent-kit** with **Gemini 2.0 Flash** to perform intelligent ticket triage.

#### Agent Configuration

- **Model:** `gemini-2.0-flash` via `@inngest/agent-kit`
- **Name:** `AI Ticket Triage Assistant`
- **System Prompt:** Instructs the AI to analyze support tickets and respond with strictly structured JSON

#### Analysis Output Schema

```json
{
  "summary": "Short 1-2 sentence summary of the issue",
  "priority": "low | medium | high",
  "helpfulNotes": "Detailed technical explanation with resource links",
  "relatedSkills": ["React", "NodeJS", "MongoDB"]
}
```

#### Response Parsing

The agent response is parsed with a fallback mechanism — if the AI wraps output in markdown code fences, the parser extracts the JSON content using a regex match before parsing.

---

### Background Job Processing (Inngest)

**Client:** `Backend/inngest/client.js`

Initializes the Inngest client with ID `ticketing-system` and an event key for production authentication.

#### Function: `on-user-signup` (`Backend/inngest/functions/on-signup.js`)

- **Trigger:** `user/signup` event
- **Steps:**
  1. `get-user-email` — Fetches the user from MongoDB; throws `NonRetriableError` if not found
  2. *(Placeholder)* `send-welcome-email` — Registration email via Resend (currently disabled)

#### Function: `on-ticket-created` (`Backend/inngest/functions/on-ticket-create.js`)

- **Trigger:** `ticket/created` event
- **Retries:** 2
- **Steps:**
  1. `fetch-ticket` — Retrieves the ticket from MongoDB
  2. `update-ticket-status` — Sets status to `TODO`
  3. `ai-processing` — Sends ticket to Gemini AI agent, updates ticket with `priority`, `helpfulNotes`, `relatedSkills`, and sets status to `IN_PROGRESS`
  4. `assign-moderator` — Queries for a moderator whose `skills` match the AI-identified `relatedSkills` (regex-based, case-insensitive `$elemMatch`). Falls back to an admin if no matching moderator is found

#### Function: `render-keep-alive` (`Backend/inngest/functions/render-keep-alive.js`)

- **Trigger:** Cron schedule (`*/1 * * * *`)
- **Purpose:** Periodically pings the server to prevent idle shutdown on Render's free tier

---

### Email System

The application supports two email transport mechanisms:

#### 1. Resend (Production)

**File:** `Backend/utils/resend.js`

Initializes the Resend client with `RESEND_API_KEY`. Used for production transactional emails.

#### 2. Nodemailer / Mailtrap (Development)

**File:** `Backend/utils/mailer.js`

Configures a Nodemailer SMTP transport using Mailtrap credentials for local email testing.

#### Email Templates (React Email)

All templates are built using `@react-email/components` and rendered to HTML via `@react-email/render`:

| Template                    | File                                      | Purpose                                  |
| --------------------------- | ----------------------------------------- | ---------------------------------------- |
| **ForgotPasswordEmail**     | `Backend/emails/ForgotPasswordEmail.js`   | Sends a styled 6-digit OTP for password reset |
| **RegistrationEmail**       | `Backend/emails/RegistrationEmail.jsx`    | Welcome email on successful signup        |
| **TicketEmail**             | `Backend/emails/TicketEmail.jsx`          | Notifies moderator of a new ticket assignment |

#### Email Helpers

| Helper                       | File                                            | Transport | Status    |
| ---------------------------- | ----------------------------------------------- | --------- | --------- |
| `sendForgotPasswordEmail()`  | `Backend/helpers/sendForgotPasswordEmail.js`     | Resend    | Active    |
| `sendRegistrationEmail()`    | `Backend/helpers/sendRegistrationEmail.js`       | Resend    | Disabled  |
| `sendTicketEmail()`          | `Backend/helpers/sendTicketEmail.js`             | Resend    | Disabled  |

---

### Utilities

#### `ApiResponse` (`Backend/utils/ApiResponse.js`)

A standardized response wrapper ensuring consistent API response structure across all endpoints. Automatically sets `success: true` for status codes below 400.

#### `ai-agent.js` (`Backend/utils/ai-agent.js`)

Contains the `analyzeTicket()` function — the core AI integration that creates an Inngest agent, sends a structured prompt, and parses the JSON response. See [AI Agent Pipeline](#ai-agent-pipeline).

---

## Frontend

### Application Shell

**Entry:** `Front-End/src/main.jsx`

The application renders inside a `<StrictMode>` wrapper with the following providers:

1. **Redux Provider** — Wraps the app with the Redux store (`<Provider store={store}>`)
2. **ToastContainer** — Global toast notifications (dark theme, top-right position)
3. **BrowserRouter** — Client-side routing with `react-router-dom` v7

---

### State Management

**Store:** `Front-End/src/store/Store.js`

Configured with Redux Toolkit's `configureStore`. Contains a single slice:

**Data Slice** (`Front-End/src/features/data/dataSlice.js`)

| State Key   | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `user`      | `Object` | Authenticated user's decoded JWT payload |

| Action        | Purpose                              |
| ------------- | ------------------------------------ |
| `setuserData` | Sets the authenticated user object    |

---

### Routing & Auth Guard

**Component:** `Front-End/src/components/AuthCheck.jsx`

A higher-order component that wraps every route to enforce authentication:

- **Protected routes** (`protected={true}`) — Redirects unauthenticated users to `/login`
- **Public routes** (`protected={false}`) — Redirects authenticated users to `/` (prevents accessing login/signup when already logged in)

Calls `GET /api/auth/me` on mount to verify the current session. Displays a loading state with animated spinner during verification.

#### Route Map

| Path               | Page Component    | Protected | Layout Components |
| ------------------ | ----------------- | --------- | ----------------- |
| `/`                | `Tickets`         | Yes       | Navbar            |
| `/ticket/:id`      | `Ticket`          | Yes       | Navbar            |
| `/login`           | `Login`           | No        | —                 |
| `/signup`          | `SignUp`          | No        | —                 |
| `/forgot-password` | `ForgotPassword`  | No        | —                 |
| `/verify-otp`      | `VerifyOtp`       | No        | —                 |
| `/reset-password`  | `ResetPassword`   | No        | —                 |
| `/admin`           | `Admin`           | Yes       | Navbar            |
| `/profile`         | `Profile`         | Yes       | Navbar            |

---

### Pages

#### `Login.jsx`

User authentication page with email and password fields. Uses **react-hook-form** for form management. On success, stores the JWT in a cookie via the server response and dispatches user data to Redux. Features animated background orbs and glassmorphism card styling.

#### `SignUp.jsx`

User registration page with email, password, and an optional comma-separated skills field. Fires an Inngest `user/signup` event on the backend after successful registration.

#### `Tickets.jsx` (Dashboard)

The primary dashboard displaying all tickets. Features:

- **Create Ticket Form** — Collapsible form with title and description inputs
- **Ticket List** — Filterable by search query (ticket ID), "Assigned to me" toggle (admin), and "My Tickets" toggle
- **Status Badges** — Color-coded: `TODO` (yellow), `PENDING` (blue), `IN PROGRESS` (purple)
- **Delete Action** — Available to admins and ticket creators, with `ConfirmModal` confirmation
- **Refresh** — Manual re-fetch button

#### `Ticket.jsx` (Detail View)

Single ticket detail page accessible via `/ticket/:id`. Displays:

- Ticket title, status, and priority badges
- Full description text
- Metadata grid: related skills, priority level, assigned moderator, ticket creator
- **AI-Generated Helpful Notes** — Rendered in a distinct section
- Delete action with confirmation modal

#### `Admin.jsx`

Admin-only user management panel. Features:

- **User Search** — Debounced email-based search with regex backend matching
- **User List** — Displays email, role (color-coded badge), and skills
- **Inline Edit** — Modify user role (admin/moderator/user) and skills directly from the list
- **Access Control** — Only accessible by users with `admin` role

#### `Profile.jsx`

Authenticated user's profile page. Displays:

- **Profile Header** — Avatar (first letter of email), name, email, role badge, join date
- **Ticket Statistics** — Created, Assigned, and Closed ticket counts
- **Detail Grid** — Name, email, phone, location, skills, and bio
- **Edit Mode** — Inline editing for name, phone, location, and bio fields

#### `ForgotPassword.jsx`

Initiates the password reset flow. Accepts an email address and sends a 6-digit OTP via the backend. Always navigates to `/verify-otp` regardless of whether the email exists (prevents user enumeration).

#### `VerifyOtp.jsx`

OTP verification step with:

- **Six individual digit inputs** with auto-focus and auto-advance
- **Paste support** — Distributes pasted digits across inputs
- **10-minute countdown timer** — Visual expiry indicator
- **Auto-submit** — Automatically submits when all 6 digits are entered
- **Resend OTP** — Re-triggers the forgot password endpoint

#### `ResetPassword.jsx`

Final password reset step. Features:

- New password and confirm password fields with inline validation
- Minimum 6-character requirement with match verification
- Success state with animated checkmark and auto-redirect to `/login` after 3 seconds
- Handles expired/unverified OTP sessions gracefully

---

### Reusable Components

#### `Navbar.jsx`

Global navigation bar with:

- **Logo** — "Ticket AI" branding with gradient icon
- **User Info** — Displays authenticated user's email (desktop)
- **Admin Button** — Conditionally rendered for admin users
- **Profile Button** — Links to user profile
- **Logout Button** — Clears session cookie and redirects to login

#### `ConfirmModal.jsx`

Reusable animated confirmation dialog built with Framer Motion's `AnimatePresence`. Supports:

- `danger` and `warning` variants with distinct color schemes
- Customizable title, description, confirm/cancel text
- Loading state during async operations
- Click-outside-to-dismiss behavior
- Spring-based enter/exit animations

#### `Cursor.jsx`

Custom animated cursor effect (desktop only, ≥768px):

- Primary cursor dot with blue-purple gradient
- Trailing glow ring with scale animation on click
- Automatically hidden on mobile viewports

#### `AuthCheck.jsx`

See [Routing & Auth Guard](#routing--auth-guard).

---

### Design System

**File:** `Front-End/src/index.css`

A comprehensive custom design system layered on top of Tailwind CSS v4 and DaisyUI:

#### CSS Custom Properties

```css
--bg-primary:      #0a0f1a   /* Deep dark blue base */
--bg-secondary:    #111827   /* Card backgrounds */
--bg-card:         #1a2332   /* Elevated card surface */
--accent-blue:     #3b82f6   /* Primary accent */
--accent-purple:   #8b5cf6   /* Secondary accent */
--accent-cyan:     #06b6d4   /* Tertiary accent */
--accent-gradient: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)
--glass-bg:        rgba(17, 24, 39, 0.7)
--glass-border:    rgba(255, 255, 255, 0.08)
```

#### Utility Classes

| Class              | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `.glass`           | Glassmorphism effect with 16px blur and translucent border    |
| `.glass-strong`    | Enhanced glassmorphism with 24px blur for navigation          |
| `.glow-blue`       | Blue box-shadow glow effect                                   |
| `.glow-purple`     | Purple box-shadow glow effect                                 |
| `.glow-border`     | Animated gradient border on hover                             |
| `.gradient-text`   | Blue-purple-cyan gradient text fill                           |
| `.input-modern`    | Dark translucent input with blue focus glow                   |
| `.btn-primary`     | Blue-to-purple gradient button with hover lift                |
| `.btn-danger`      | Red gradient button variant                                   |
| `.btn-success`     | Green gradient button variant                                 |
| `.card-modern`     | Dark card with hover lift and blue border highlight            |
| `.badge-*`         | Color-coded status badges (blue, purple, green, yellow, red)  |
| `.skeleton-line`   | Loading skeleton with shimmer animation                       |
| `.bg-grid`         | Animated background grid pattern                              |

#### Keyframe Animations

- `float` — Gentle floating motion for decorative elements
- `pulse-glow` — Pulsing opacity animation for glow effects
- `shimmer` — Loading skeleton shimmer sweep

---

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=8000                          # Server port
MONGO_URI=mongodb+srv://...        # MongoDB Atlas connection URI
JWT_SECRET=your_jwt_secret         # JWT signing secret
GEMINI_API_KEY=your_gemini_key     # Google Gemini API key

# Inngest
INNGEST_EVENT_KEY=your_event_key   # Inngest event authentication key
INNGEST_SIGNING_KEY=your_sign_key  # Inngest endpoint signing key

# Resend (Production emails)
RESEND_API_KEY=re_...              # Resend API key

# Mailtrap (Development emails)
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_user
MAILTRAP_SMTP_PASS=your_pass
```

### Frontend (`Front-End/.env`)

```env
VITE_BACKEND_URL=http://localhost:8000   # Backend API base URL (used in proxy & production)
```

---

## API Reference

### Authentication Flow

```
POST /api/auth/signup     →  Register  →  JWT cookie set  →  Inngest: user/signup
POST /api/auth/login      →  Authenticate  →  JWT cookie set
POST /api/auth/logout     →  Clear cookie
GET  /api/auth/me         →  Validate session  →  Return user payload
```

### Password Reset Flow

```
POST /api/auth/forgot-password  →  Generate OTP  →  Hash & store  →  Email OTP
POST /api/auth/verify-otp       →  Compare hashed OTP  →  Mark verified
POST /api/auth/reset-password   →  Validate OTP session  →  Bcrypt hash  →  Update
```

### Ticket Lifecycle

```
POST /api/tickets         →  Create ticket  →  Inngest: ticket/created
                                                  ├─ Fetch ticket
                                                  ├─ AI analysis (Gemini 2.0 Flash)
                                                  ├─ Update priority, notes, skills
                                                  └─ Auto-assign moderator by skill match
GET  /api/tickets         →  List (role-filtered)
GET  /api/tickets/:id     →  Detail view
DELETE /api/tickets/:id   →  Remove (admin or creator)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** instance (local or Atlas)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))
- **Inngest Account** ([Sign up](https://www.inngest.com/))
- **Resend API Key** ([Sign up](https://resend.com/)) *(optional — for production emails)*

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-agent.git
cd ai-agent

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Front-End
npm install
```

### Development

```bash
# Terminal 1 — Start the backend server
cd Backend
npm run dev

# Terminal 2 — Start the Inngest dev server
cd Backend
npm run inngest-dev

# Terminal 3 — Start the frontend dev server
cd Front-End
npm run dev
```

The frontend dev server runs on `http://localhost:5173` with Vite's proxy forwarding `/api` requests to the backend on `http://localhost:8000`.

### Production Build

```bash
# Build the frontend
cd Front-End
npm run build

# Copy the built files to Backend/dist for static serving
# The backend serves the built frontend via express.static('dist')

# Start the production server
cd Backend
npm start
```

---

## Deployment

### Backend (Render / Railway / Fly.io)

1. Set all backend environment variables in the hosting provider's dashboard
2. Set the build command to `npm install`
3. Set the start command to `npm start`
4. Register the Inngest serve endpoint URL at [Inngest Dashboard](https://app.inngest.com/) → Sync App

### Frontend (Vercel)

The frontend includes a `vercel.json` with SPA rewrite rules:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

1. Connect the `Front-End` directory to Vercel
2. Set `VITE_BACKEND_URL` environment variable to the deployed backend URL
3. Deploy

### Unified Deployment

For a unified deployment (single server), build the frontend and place the output in `Backend/dist`. The Express server is already configured to serve static files from `dist/`.

---

## License

ISC
