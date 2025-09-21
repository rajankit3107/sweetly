# 🪔 Sweetly - Diwali Sweets E-commerce Platform

A full-stack e-commerce application for ordering traditional Diwali sweets, built with modern web technologies and featuring a beautiful, responsive user interface.

## 🌟 Project Overview

Sweetly is a complete e-commerce solution designed specifically for Diwali celebrations, offering a seamless shopping experience for customers and comprehensive management tools for administrators. The platform showcases traditional Indian sweets with an elegant, festive-themed interface.

## 📸 Screenshots

### Home Page

![Home Page](screenshots/home.png)
_A vibrant hero section with Diwali sweets and search functionality_

### User Registration

![User Registration](screenshots/register.png)
_Clean and intuitive registration form with festive branding_

### Product Catalog

![Product Catalog](screenshots/products.png)
_Responsive product grid displaying sweet varieties with pricing and availability_

### Purchase History

![Purchase History](screenshots/purchase-history.png)
_Comprehensive order tracking system with detailed purchase history_

### Admin Panel - Order Management

![Admin Orders](screenshots/admin-panel.png)
_Powerful admin interface for managing orders, inventory, and customer information_

## 🏗️ Architecture

The project follows a modern full-stack architecture with clear separation of concerns:

```
ankit-sweets/
├── sweetly-client/     # React + TypeScript Frontend
├── sweets-server/      # Node.js + Express + MongoDB Backend
└── README.md          # This file
```

## ✨ Key Features

### 🛍️ **Customer Experience**

- **Product Catalog**: Browse through curated Diwali sweets collection
- **Advanced Search**: Real-time search with suggestions and category filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Multi-step Checkout**: Streamlined 3-step checkout process
- **Order Management**: Track orders and delivery status
- **Responsive Design**: Optimized for all devices

### 👨‍💼 **Admin Features**

- **Product Management**: Full CRUD operations for sweets
- **Inventory Control**: Real-time stock level management
- **Category Management**: Organize products by categories
- **Image Upload**: Support for custom product images
- **User Management**: Admin user administration

### 🔐 **Security & Authentication**

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate interfaces for users and admins
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Tech Stack

### Frontend (`sweetly-client/`)

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6
- **Styling**: Tailwind CSS 4.1.13
- **Animations**: Framer Motion 12.23.16
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.12.2
- **State Management**: React Context API
- **Authentication**: JWT with jwt-decode

### Backend (`sweets-server/`)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.18.1
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod 4.1.9
- **Testing**: Jest with Supertest
- **Security**: Express Rate Limit, CORS

## 📁 Project Structure

```
ankit-sweets/
├── sweetly-client/                 # Frontend Application
│   ├── public/                    # Static assets
│   │   ├── sweet.mp4             # Hero section video
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/                  # API configuration
│   │   ├── components/           # React components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── NavBar.tsx       # Navigation
│   │   │   ├── SweetCard.tsx    # Product card
│   │   │   └── SweetForm.tsx    # Admin form
│   │   ├── context/             # React contexts
│   │   │   ├── auth-context.tsx # Authentication
│   │   │   └── CartContext.tsx  # Shopping cart
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Product listing
│   │   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   │   ├── Checkout.tsx     # Checkout process
│   │   │   ├── Login.tsx        # User login
│   │   │   └── Register.tsx     # User registration
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── package.json
│   ├── tailwind.config.cjs
│   ├── vite.config.ts
│   └── README.md
│
├── sweets-server/                 # Backend Application
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   ├── db.ts           # Database connection
│   │   │   └── seedAdmin.ts    # Admin seeding
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── admin.sweetcontroller.ts
│   │   │   └── user.sweetController.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/              # Database models
│   │   │   ├── sweets.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.services.ts
│   │   │   └── sweets.services.ts
│   │   ├── tests/               # Test files
│   │   ├── utils/               # Utility functions
│   │   ├── validators/          # Zod schemas
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Server entry point
│   ├── dist/                    # Compiled JavaScript
│   ├── package.json
│   ├── jest.config.ts
│   └── README.md
│
└── README.md                    # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** or **yarn** package manager

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ankit-sweets
   ```

2. **Backend Setup**

   ```bash
   cd sweets-server
   npm install

   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB connection string

   # Start backend
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd sweetly-client
   npm install

   # Create environment file
   echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

   # Start frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - Health Check: `http://localhost:3000/health`

### Environment Configuration

#### Backend (`.env` in `sweets-server/`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/sweetly
# or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/sweetly

# Admin Seeding (Optional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

#### Frontend (`.env` in `sweetly-client/`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚀 Development

### Backend Development

```bash
cd sweets-server

# Development with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Frontend Development

```bash
cd sweetly-client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Endpoints

- `GET /api/user/sweets` - Get all sweets
- `GET /api/user/sweets/search?name={query}` - Search sweets

### Admin Endpoints (Require Admin Authentication)

- `POST /api/admin/sweets` - Create new sweet
- `PUT /api/admin/sweets/:id` - Update sweet
- `DELETE /api/admin/sweets/:id` - Delete sweet
- `GET /api/admin/sweets` - Get all sweets (admin view)

### Health Check

- `GET /health` - Server health status

## 🧪 Testing

### Backend Testing

The backend includes comprehensive testing with Jest and Supertest:

```bash
cd sweets-server
npm test
```

**Test Coverage:**

- Authentication flows
- Sweet CRUD operations
- User management
- API rate limiting
- Error handling

### Frontend Testing

```bash
cd sweetly-client
npm run test
```

## 🎨 Design System

### Color Palette

- **Primary**: Amber/Gold tones for festive theme
- **Secondary**: Pink accents for highlights
- **Neutral**: Slate grays for text and backgrounds
- **Status**: Green for success, Red for errors

### Typography

- **Headings**: Serif fonts for elegant appearance
- **Body**: Sans-serif for readability
- **Responsive**: Mobile-first typography scale

### Animations

- **Page Transitions**: Smooth fade and slide effects
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Skeleton loaders and progress indicators

## 🔒 Security Features

### Backend Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Zod schemas for data validation
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: Centralized error management

### Frontend Security

- **Route Protection**: Authentication-based route guards
- **Input Sanitization**: XSS protection
- **Secure Storage**: JWT token management
- **Role-based Access**: Admin-only features protection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Friendly**: Large touch targets and gestures

## 🚀 Deployment

### Production Build

**Backend:**

```bash
cd sweets-server
npm run build
npm start
```

**Frontend:**

```bash
cd sweetly-client
npm run build
# Deploy dist/ folder to your hosting service
```

### Deployment Options

**Frontend:**

- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront

**Backend:**

- **Cloud Platforms**: Heroku, Railway, DigitalOcean
- **VPS**: Ubuntu, CentOS with PM2
- **Container**: Docker with MongoDB

### Environment Variables for Production

**Backend:**

```env
PORT=3000
NODE_ENV=production
MONGO_URL=your-production-mongodb-url
```

**Frontend:**

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure responsive design

## 📊 Performance Optimizations

### Frontend

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images with fallbacks
- **Bundle Optimization**: Vite's built-in optimizations
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large product lists

### Backend

- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression for responses
- **Rate Limiting**: API protection and performance

## 🔮 Future Enhancements

### Planned Features

- **Payment Integration**: Real payment gateway integration
- **Order Tracking**: Real-time order status updates
- **Reviews & Ratings**: Customer feedback system
- **Wishlist**: Save favorite products
- **Multi-language**: Internationalization support
- **PWA**: Progressive Web App features
- **Offline Support**: Service worker implementation
- **Email Notifications**: Order confirmations and updates
- **Inventory Management**: Advanced stock tracking
- **Analytics Dashboard**: Sales and user analytics

### Technical Improvements

- **Microservices**: Break down into smaller services
- **GraphQL**: More efficient data fetching
- **Redis Caching**: Improved performance
- **Docker**: Containerized deployment
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application performance monitoring

## 🐛 Troubleshooting

### Common Issues

**Backend Issues:**

- **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
- **Port Conflicts**: Change PORT in .env if 3000 is occupied
- **JWT Errors**: Check JWT_SECRET is set in environment

**Frontend Issues:**

- **API Connection**: Verify VITE_API_BASE_URL is correct
- **Build Errors**: Clear node_modules and reinstall dependencies
- **CORS Issues**: Check backend CORS configuration

### Getting Help

- Check the individual README files in each directory
- Review the API documentation
- Check the test files for usage examples
- Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Design**: Custom Diwali-themed UI/UX
- **Testing**: Jest + Supertest + React Testing Library

## 🙏 Acknowledgments

- **Diwali Theme**: Inspired by traditional Indian festival aesthetics
- **UI Components**: Custom-built with Tailwind CSS
- **Icons**: Emoji-based for universal compatibility
- **Animations**: Framer Motion for smooth interactions

## 🤖 My AI Usage

### Which AI tools were used

- **GitHub Copilot**
- **ChatGPT (OpenAI GPT-4)**
- **Claude (Anthropic)**

### How AI tools were used

- **GitHub Copilot**: Used for code completion, boilerplate generation, and inline code suggestions while writing both backend and frontend code. It helped speed up repetitive coding tasks and provided quick syntax corrections.
- **ChatGPT (OpenAI GPT-4)**: Used for brainstorming API endpoint structures, debugging TypeScript errors, generating documentation, and getting explanations for complex code or error messages. Also used to draft commit messages and improve code comments.
- **Claude (Anthropic)**: Used for code review suggestions, generating alternative implementations, and providing feedback on architectural decisions. Also contributed to some commit messages as a co-author.

### Reflection on AI impact

AI tools significantly accelerated the development process by reducing time spent on boilerplate, debugging, and documentation. They enabled rapid prototyping and provided instant feedback on code quality and best practices. However, careful human review was always applied to ensure correctness, security, and maintainability. The combination of multiple AI assistants led to a more robust and well-documented codebase, while freeing up time for creative problem-solving and design.

---

**Made with ❤️ for Diwali celebrations** 🪔✨

_May this platform bring sweetness to your celebrations!_
