import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/CartContext";
import useAuth from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";
import Navbar from "./components/NavBar";
import ToastContainer from "./components/ui/ToastContainer";
import type { JSX } from "react";

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }: { children: JSX.Element }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/checkout"
                element={
                  <Protected>
                    <Checkout />
                  </Protected>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminOnly>
                    <AdminPanel />
                  </AdminOnly>
                }
              />
            </Routes>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
