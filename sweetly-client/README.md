# 🪔 Sweetly - Diwali Sweets E-commerce Frontend

A modern, responsive React application for ordering traditional Diwali sweets with a beautiful UI and smooth user experience.

## ✨ Features

### 🛍️ **Shopping Experience**

- **Product Catalog**: Browse through a curated collection of traditional Diwali sweets
- **Advanced Search**: Real-time search with suggestions and category filtering
- **Product Details**: Detailed information including price, availability, and descriptions
- **Shopping Cart**: Add/remove items with quantity management
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔐 **Authentication & Authorization**

- **User Registration & Login**: Secure JWT-based authentication
- **Role-based Access**: Separate interfaces for customers and administrators
- **Protected Routes**: Automatic redirection based on authentication status
- **Persistent Sessions**: Login state maintained across browser sessions

### 🛒 **Checkout Process**

- **Multi-step Checkout**: Streamlined 3-step checkout process
- **Delivery Information**: Complete address and contact details collection
- **Payment Options**: Multiple payment methods (COD, UPI, Card)
- **Order Summary**: Real-time calculation with delivery fees
- **Order Confirmation**: Success feedback and cart clearing

### 👨‍💼 **Admin Panel**

- **Product Management**: Add, edit, and delete sweet products
- **Inventory Control**: Track stock levels and availability
- **Category Management**: Organize products by categories
- **Image Upload**: Support for custom product images
- **Real-time Updates**: Instant reflection of changes

### 🎨 **UI/UX Features**

- **Modern Design**: Clean, intuitive interface with Diwali theme
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: Real-time feedback for user actions
- **Video Background**: Engaging hero section with festive video
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Tech Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6
- **Styling**: Tailwind CSS 4.1.13
- **Animations**: Framer Motion 12.23.16
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.12.2
- **Authentication**: JWT with jwt-decode
- **State Management**: React Context API
- **Code Quality**: ESLint with TypeScript support

## 📁 Project Structure

```
sweetly-client/
├── public/
│   ├── sweet.mp4          # Hero section video
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── axios.ts       # API configuration
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   └── ToastContainer.tsx
│   │   ├── NavBar.tsx     # Navigation component
│   │   ├── SweetCard.tsx  # Product card component
│   │   └── SweetForm.tsx  # Admin product form
│   ├── context/
│   │   ├── auth-context.tsx    # Authentication context
│   │   ├── CartContext.tsx     # Shopping cart context
│   │   └── useAuth.tsx         # Authentication hook
│   ├── pages/
│   │   ├── AdminPanel.tsx      # Admin dashboard
│   │   ├── Checkout.tsx        # Checkout process
│   │   ├── Dashboard.tsx       # Main product listing
│   │   ├── Login.tsx           # User login
│   │   └── Register.tsx        # User registration
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Global styles
│   ├── index.css               # Base styles
│   └── main.tsx                # App entry point
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ankit-sweets/sweetly-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration

### API Configuration

The application connects to a backend API. Update the base URL in `src/api/axios.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});
```

### Tailwind CSS

Custom configuration in `tailwind.config.cjs` includes:

- Custom color palette for Diwali theme
- Extended animations and transitions
- Responsive breakpoints

## 🎯 Key Components

### Authentication System

- **AuthProvider**: Manages authentication state globally
- **Protected Routes**: Wrapper components for route protection
- **Role-based Access**: Different interfaces for users and admins

### Shopping Cart

- **CartContext**: Global cart state management
- **Add/Remove Items**: Quantity management
- **Persistent Storage**: Cart state maintained across sessions

### Product Management

- **SweetCard**: Individual product display component
- **SweetForm**: Admin form for product CRUD operations
- **Search & Filter**: Real-time search with category filtering

## 🎨 Design System

### Color Palette

- **Primary**: Amber/Gold tones for festive theme
- **Secondary**: Pink accents for highlights
- **Neutral**: Slate grays for text and backgrounds
- **Status**: Green for success, Red for errors

### Typography

- **Headings**: Serif fonts for elegant appearance
- **Body**: Sans-serif for readability
- **Sizes**: Responsive typography scale

### Animations

- **Page Transitions**: Smooth fade and slide effects
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Skeleton loaders and progress indicators

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Automatic redirection for unauthorized access
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Friendly**: Large touch targets and gestures

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images with fallbacks
- **Bundle Optimization**: Vite's built-in optimizations
- **Memoization**: React.memo for expensive components

## 🧪 Testing

The application includes comprehensive testing setup:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Server**: Nginx, Apache

### Environment Variables

Set the following environment variables for production:

- `VITE_API_BASE_URL`: Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Payment Integration**: Real payment gateway integration
- **Order Tracking**: Real-time order status updates
- **Reviews & Ratings**: Customer feedback system
- **Wishlist**: Save favorite products
- **Multi-language**: Internationalization support
- **PWA**: Progressive Web App features
- **Offline Support**: Service worker implementation

---

**Made with ❤️ for Diwali celebrations** 🪔✨
