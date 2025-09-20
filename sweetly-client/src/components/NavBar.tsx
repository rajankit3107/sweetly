import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white font-medium text-lg group-hover:shadow-md transition-all duration-200">
              🪔
            </div>
            <div className="text-xl font-semibold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
              Sweetly
            </div>
          </Link>
        </motion.div>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          {role === "admin" && <NavLink to="/admin">Admin</NavLink>}

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center text-lg p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => setCartOpen((v) => !v)}
            aria-label="Open cart"
          >
            🛒
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Auth */}
          {!token ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="secondary" className="px-4 py-2 text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2 text-sm">Register</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">
                Welcome back 👋
              </span>
              <Button
                variant="error"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
                className="px-4 py-2 text-sm"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen &&
        createPortal(
          <AnimatePresence>
            {cartOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCartOpen(false)}
                  className="fixed inset-0 bg-black/70 z-[9998]"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                />
                {/* Cart Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 w-96 max-w-full h-full shadow-2xl border-l border-slate-200 z-[9999] flex flex-col overflow-hidden"
                  data-cart-drawer
                  style={{
                    backgroundColor: "#ffffff",
                    opacity: 1,
                    backdropFilter: "none",
                    isolation: "isolate",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                      Your Cart
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCartOpen(false)}
                      className="text-2xl font-bold text-slate-500 hover:text-amber-500 transition-colors"
                    >
                      &times;
                    </motion.button>
                  </div>

                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cart.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-500 text-center mt-10 text-sm"
                      >
                        Your cart is empty
                      </motion.div>
                    ) : (
                      <ul className="space-y-4">
                        {cart.map((item, index) => (
                          <motion.li
                            key={item.sweetId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-center text-slate-900 bg-slate-50 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
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
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Grand Total & Checkout */}
                  {cart.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 py-4 border-t border-slate-100 space-y-4"
                    >
                      <div className="flex justify-between text-lg font-semibold text-slate-900">
                        <span>Total</span>
                        <span>₹{grandTotal}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={goToCheckout}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-lg"
                      >
                        Checkout
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        className="relative text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors group px-3 py-2 rounded-md hover:bg-slate-50"
      >
        {children}
        <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-amber-500 group-hover:w-[calc(100%-1.5rem)] transition-all duration-200 rounded-full"></span>
      </Link>
    </motion.div>
  );
}
