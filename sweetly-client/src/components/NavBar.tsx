import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Button from "./ui/Button";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const nav = useNavigate();
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  // Calculate total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const grandTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToCheckout = () => {
    setCartOpen(false);
    nav("/checkout");
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-md bg-gradient-to-br from-primary-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-display text-2xl group-hover:scale-110 transition-transform duration-300">
            🪔
          </div>
          <div className="text-3xl font-display text-slate-900 font-extrabold tracking-tight group-hover:text-primary-600 transition-colors">
            Sweetly
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-10">
          <NavLink to="/">Home</NavLink>
          {role === "admin" && <NavLink to="/admin">Admin</NavLink>}

          {/* Cart */}
          <button
            className="relative flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            onClick={() => setCartOpen((v) => !v)}
            aria-label="Open cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {!token ? (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button className="px-6 py-3 text-slate-700 hover:text-primary-600 font-semibold rounded-lg transition-all">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-700 font-medium">
                Welcome back 👋
              </span>
              <Button
                onClick={() => {
                  logout();
                  nav("/login");
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed top-0 right-0 w-96 max-w-full h-full bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Your Cart
            </span>
            <button
              onClick={() => setCartOpen(false)}
              className="text-2xl font-bold text-slate-500 hover:text-primary-500 transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-slate-500 text-center mt-10 text-sm">
                Your cart is empty
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.sweetId}
                    className="flex justify-between items-center text-slate-900 bg-gray-50 rounded-md px-4 py-3 shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-lg">
                        {item.sweetName}
                      </span>
                      <span className="text-slate-600 text-sm">
                        Price: ₹{item.price} x {item.quantity} = ₹
                        {item.price * item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-lg">
                      ₹{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Grand Total & Checkout */}
          {cart.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <button
                onClick={goToCheckout}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-lg"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative text-slate-700 hover:text-primary-600 font-semibold text-lg transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-pink-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
    </Link>
  );
}
