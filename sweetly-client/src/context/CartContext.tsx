import { createContext, useContext, useState } from "react";

interface CartItem {
  sweetId: string;
  sweetName: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (sweet: { _id: string; name: string; price: number }) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (sweet: { _id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.sweetId === sweet._id);
      if (existing) {
        return prev.map((item) =>
          item.sweetId === sweet._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          sweetId: sweet._id,
          sweetName: sweet.name,
          price: sweet.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setCart((prev) => prev.filter((item) => item.sweetId !== sweetId));
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.sweetId === sweetId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
