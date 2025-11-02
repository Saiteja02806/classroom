# AI Telugu Summarization - Authentication

A beautiful, modern authentication system built with React, Vite, and Supabase for the AI Telugu Summarization application.

## Features

- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ✅ **Form Validation** - Client-side validation with helpful error messages
- 🔄 **Password Reset** - Email-based password recovery
- 🛡️ **Protected Routes** - Secure dashboard with session management
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast development

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update Supabase credentials (if needed):
   - Edit `src/lib/supabase.js` with your Supabase project URL and anon key

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   ├── Signup.jsx         # Signup page component
│   │   ├── ForgotPassword.jsx # Password reset component
│   │   ├── Dashboard.jsx      # Protected dashboard
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context provider
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Features Overview

### Authentication Pages

1. **Login Page** (`/login`)
   - Email and password authentication
   - Remember me option
   - Forgot password link
   - Redirects to dashboard on success

2. **Signup Page** (`/signup`)
   - User registration with name and email
   - Strong password validation
   - Email verification flow
   - Auto-redirect to login after signup

3. **Forgot Password** (`/forgot-password`)
   - Email-based password reset
   - Success confirmation message

4. **Dashboard** (`/dashboard`)
   - Protected route (requires authentication)
   - Displays user profile information
   - Sign out functionality

## Supabase Configuration

The app uses Supabase for authentication. Make sure your Supabase project has:

1. Email authentication enabled
2. Email templates configured (for password reset)
3. Redirect URLs properly set up

Update the Supabase URL and anon key in `src/lib/supabase.js`:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder, ready to be deployed.

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Supabase** - Backend authentication
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Security Best Practices

- Passwords are hashed and stored securely by Supabase
- Session management handled by Supabase
- Protected routes prevent unauthorized access
- Email verification for new accounts
- Secure password reset flow

## License

MIT

