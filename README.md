# Maroc Scolarisation Web Application

This is a web application designed for the Maroc Scolarisation association to manage donors, students, financial transactions, budgets, and expenses efficiently. It provides a centralized platform built with modern web technologies.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Firebase](https://img.shields.io/badge/Firebase-orange?logo=firebase) ![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-red?logo=reactquery) ![TanStack Router](https://img.shields.io/badge/TanStack%20Router-v1-blue) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2-purple?logo=redux) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue?logo=tailwindcss) ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?logo=vercel)

## Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [Project Structure](#project-structure)
- [Core Concepts & Workflows](#core-concepts--workflows)
  - [Authentication](#authentication)
  - [Routing](#routing)
  - [Data Fetching (Firestore & Tanstack Query)](#data-fetching-firestore--tanstack-query)
  - [State Management (Redux Toolkit)](#state-management-redux-toolkit)
  - [Styling (Tailwind & Shadcn/ui)](#styling-tailwind--shadcnui)
- [Building For Production](#building-for-production)
- [Testing](#testing)

## Technology Stack

*   **Frontend Framework:** React (v18+) with TypeScript
*   **Build Tool:** Vite
*   **Backend / BaaS:** Firebase (Serverless)
    *   Authentication (Email/Password, Google, Apple, Twitter, Facebook)
    *   Firestore (NoSQL Database)
    *   Cloud Storage (for file uploads like documents/avatars - *if implemented*)
*   **Routing:** TanStack Router (v1 - File-Based Routing)
*   **Data Fetching & Server State:** TanStack Query (v5) - interacting directly with Firebase SDK
*   **Global Client State:** Redux Toolkit (v2)
*   **Auth State Helper:** React Firebase Hooks (`useAuthState`)
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn/ui
*   **Form Handling:** React Hook Form with Zod resolver
*   **Schema Validation:** Zod
*   **Package Manager:** pnpm

## Prerequisites

*   **Node.js:** Version 18.x or later recommended.
*   **pnpm:** Make sure pnpm is installed globally (`npm install -g pnpm`).
*   **Firebase Project:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable the following services for your project:
        *   **Authentication:** Enable Email/Password sign-in and the desired OAuth providers (Google, Facebook, Twitter, Apple). Make sure to configure OAuth consent screens and add authorized domains as required by Firebase.
        *   **Firestore Database:** Create a Firestore database instance (choose a location). Start in "Production mode" and set up appropriate Security Rules (see [Authentication](#authentication) section).
        *   **Storage (Optional):** Enable Cloud Storage if you plan to store files.

## Getting Started

### Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd <repo-name>
pnpm install
```

### Environment Variables

This project uses Vite for environment variables. You need to create a `.env` file in the root of the project. Copy the `.env.example` file (if one exists) or create a new `.env` file with the following content, replacing the placeholder values with your actual Firebase project configuration keys:

```dotenv
# Firebase Configuration - Get these from your Firebase project settings
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Optional: Measurement ID for Google Analytics for Firebase
# VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

**Important:** Never commit your `.env` file with actual secrets to version control. Ensure `.env` is listed in your `.gitignore` file.

### Running the Development Server

Start the Vite development server:

```bash
pnpm dev
```

This will typically start the application on `http://localhost:5173/` (or another port if 5173 is busy). The application should automatically redirect to `/login` if configured correctly.

## Project Structure

A brief overview of the key directories in `src/`:

```
src/
├── assets/          # Static assets like images, fonts
├── components/      # Reusable UI components ( Shadcn UI, custom)
│   ├── ui/          # Unmodified Shadcn UI components
│   └── ...          # Custom composite components
├── config/          # Configuration files (e.g., firebase.ts)
├── hooks/           # Custom React hooks (e.g., useAuthListener - if kept)
├── lib/             # Utility functions, helper libraries
├── routes/          # TanStack Router file-based routes definitions
│   ├── __root.tsx   # Absolute root layout, providers
│   ├── _auth/       # Pathless layout & routes for unauthenticated users (login, signup)
│   ├── _mainLayout/ # Pathless layout & routes for authenticated users (dashboard, donors)
│   └── index.tsx    # Root route (usually redirects to /login)
├── services/        # Data interaction logic (Firebase SDK + TanStack Query wrappers)
│   ├── auth/        # Authentication related API calls, hooks
│   └── donors/      # Donor related API calls, query/mutation hooks
│   └── ...          # Other features (students, transactions)
├── store/           # Redux Toolkit setup
│   ├── auth/        # Auth slice and selectors
│   └── store.ts     # Redux store configuration
├── types/           # TypeScript type definitions (e.g., user.ts, donor.ts), Zod schemas
└── main.tsx         # Application entry point, router/provider setup
```

## Core Concepts & Workflows

### Authentication

*   **Provider:** Firebase Authentication handles user sign-up, sign-in (Email/Password, Google, Facebook, Twitter, Apple), and session management.
*   **Session Persistence:** Firebase Auth automatically persists user sessions using IndexedDB by default.
*   **State Listening:**
    *   `react-firebase-hooks` (`useAuthState`) is used within protected layout components (`_mainLayout`) to reliably determine the authentication status and loading state, preventing redirects on refresh.
    *   *(Optional/Alternative)* A custom `useAuthListener` hook might still be used (e.g., in `__root.tsx`) primarily to fetch the full user profile from Firestore upon authentication changes and update the Redux store.
*   **Firestore Profile:** User details beyond basic auth info (like `role`, `firstName`, `lastName`, `isActive`) are stored in a `/users/{userId}` document in Firestore. The `manageFirestoreUser` helper function in `services/auth/api.ts` handles creating/updating this document during sign-in/sign-up.
*   **Protected Routes:** Implemented using Tanstack Router's pathless layout routes (`_mainLayout`). The layout component uses `useAuthState` to check authentication status *after* the initial loading state is resolved, redirecting to `/login` if the user is not authenticated.
*   **Security Rules:** **Crucially**, Firestore security rules **must** be configured to allow authenticated users to read/write their own data and perform actions based on their roles. The default test rules expire and are insecure. Implement rules based on `request.auth.uid` and potentially custom claims for role-based access control (RBAC).

### Routing

*   **Library:** TanStack Router (v1).
*   **Strategy:** File-Based Routing is configured. Routes are defined by files within the `src/routes` directory.
*   **Layouts:** Implemented using pathless layout routes (folders/files prefixed with `_`, e.g., `_auth`, `_mainLayout`). The root layout is `__root.tsx`. Layouts render an `<Outlet />` for child routes.
*   **Navigation:** Use the `<Link>` component from `@tanstack/react-router` for client-side navigation.
*   **Data Loading (Loaders):** Tanstack Router's `loader` functions can be added to route definitions (`createFileRoute`) to fetch data *before* the component renders, often using `queryClient.ensureQueryData` for integration with Tanstack Query. This is recommended for pages displaying primary data (like lists) to improve perceived performance. See `src/routes/(protected)/_mainLayout/donors/index.tsx` for an example.

### Data Fetching (Firestore & Tanstack Query)

*   **Backend:** This application uses Firestore directly via the Firebase SDK (v9+ modular API). There is no custom backend API server.
*   **Service Structure:** Data interaction logic is organized within the `src/services/` directory, typically with subfolders per feature (e.g., `donors`, `students`). Each feature folder often contains:
    *   `api.ts`: Raw functions interacting directly with the Firebase SDK (`getDoc`, `getDocs`, `addDoc`, `updateDoc`, `setDoc`).
    *   `queries.ts`: Exports TanStack Query hooks (`useQuery` wrappers like `useGetDonors`, `useGetDonor`) for fetching data. Includes query key factories.
    *   `mutations.ts`: Exports TanStack Query hooks (`useMutation` wrappers like `useAddDonor`, `useUpdateDonor`, `useDeactivateDonor`) for creating, updating, or deleting data. These hooks typically handle calling the API function and invalidating relevant queries on success.
*   **Server State Management:** TanStack Query is the primary tool for managing server state (data fetched from Firestore). It handles caching, background refetching, loading/error states, request deduplication, etc.

### State Management (Redux Toolkit)

*   **Library:** Redux Toolkit.
*   **Purpose:** Used for managing **global client state** – state that is specific to the user interface or session but isn't directly fetched server data. Examples:
    *   UI state (e.g., `isSidebarOpen`).
    *   Storing the *currently authenticated user's profile* (fetched via Firebase/Firestore) for easy access across components (though this can also be managed via Tanstack Query).
    *   Potentially complex form state shared across multiple steps.
*   **Distinction from Tanstack Query:** Redux is *not* typically used for caching or managing the loading/error states of Firestore data fetching; Tanstack Query handles that ("server state").
*   **Structure:** Configured in `src/store/`, typically with feature slices (e.g., `src/store/auth/authSlice.ts`).

### Styling (Tailwind & Shadcn/ui)

*   **Core:** Tailwind CSS is used for utility-first styling. Configure via `tailwind.config.js`.
*   **Component Library:** Shadcn/ui provides beautifully designed, accessible components that you copy into your project (`src/components/ui`). Use the `shadcn-ui` CLI to add new components.
*   **Custom Components:** Build custom, reusable components in `src/components/`, often composing Shadcn/ui primitives.

## Building For Production

To create an optimized production build:

```bash
pnpm build
```

This will generate static files in the `dist/` directory, which can then be deployed to any static hosting provider (like Firebase Hosting, Vercel, Netlify).

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

Run the tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```
