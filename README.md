# Modern E-commerce Platform

A fully-featured e-commerce platform built with React, TypeScript, and Supabase. This project was created automatically using AI and took approximately 1 hour to generate a production-ready application.

## 🌐 Demo URLs

- **Customer Portal**: `/`
- **Admin Portal**: `/admin`
- **Login URL**: Click "Sign In" button in the top navigation

### Demo Credentials
- **Admin Login**:
  - Email: `admin@example.com`
  - Password: `admin`

## 🚀 Features

### Customer Features
- 🛍️ Product browsing with categories
- 🔍 Advanced search and filtering
- 🛒 Shopping cart management
- 💝 Wishlist functionality
- ⭐ Product reviews and ratings
- 👤 User authentication
- 📦 Order tracking
- 🔐 Secure checkout process

### Admin Features
- 📊 Dashboard with sales analytics
- 📝 Product management
- 🗂️ Category management
- 📦 Order management
- 👥 Customer management
- 📧 Email campaign tools
- ⚙️ Store settings
- 📈 Sales reports

## 🛠️ Technology Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - React Router
  - Zustand (State Management)

- **Backend:**
  - Supabase (Database & Authentication)
  - PostgreSQL
  - Row Level Security (RLS)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/turzo333/ai-onlineshop-autopilot.git
cd ai-onlineshop-autopilot
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project:
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

4. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Migration Process

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Run migrations in order:
```bash
supabase migration up
```

This will execute all migrations in the following order:
1. Initial schema setup (tables, relationships)
2. Product and category data
3. Order management system
4. Review system
5. Wishlist functionality
6. Admin user system
7. Store settings
8. Security policies

4. Verify admin user:
- The migration automatically creates an admin user
- Use the demo credentials to log in
- You can change the password after first login

5. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
│   ├── admin/        # Admin panel pages
│   └── ...          # Customer-facing pages
├── store/            # Zustand store configurations
├── lib/              # Utilities and types
└── main.tsx          # Application entry point

supabase/
└── migrations/       # Database migrations
```

## 🔐 Authentication

The application uses Supabase Authentication with the following features:
- Email/Password authentication
- Protected routes
- Admin role management
- Session management

## 🛡️ Security

- Row Level Security (RLS) policies for all database tables
- Secure admin access control
- Protected API endpoints
- Secure user data handling

## 🎨 UI/UX Features

- Responsive design
- Mobile-first approach
- Loading states
- Error handling
- Toast notifications
- Modal dialogs
- Form validation

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (e.g., Netlify, Vercel)

3. Set up environment variables on your hosting platform:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤖 AI Generation

This project was generated entirely using AI, demonstrating the power of automated development:
- Complete project structure
- Full-featured components
- Database schema and migrations
- Security policies
- Type definitions
- State management
- API integration

The entire process took approximately 1 hour, resulting in a production-ready e-commerce platform.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Lucide Icons](https://lucide.dev) for the icon system
- [React](https://reactjs.org) for the frontend framework
