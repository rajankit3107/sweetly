import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import { useCart } from "../context/CartContext";

declare global {
  interface Window {
    appToast?: (message: string, type: string) => void;
  }
}

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onPurchased?: () => void;
}

export default function SweetCard({ sweet }: SweetCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ _id: sweet._id, name: sweet.name, price: sweet.price });
    window.appToast?.("Added to cart!", "success");
  };

  // Default sweet images based on category
  const getDefaultImage = (category: string) => {
    const categoryImages: { [key: string]: string } = {
      mithai:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center",
      laddu:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
      barfi:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center",
      "gulab jamun":
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
      rasgulla:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center",
      "kaju katli":
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
      default:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center",
    };
    return categoryImages[category.toLowerCase()] || categoryImages["default"];
  };

  const imageUrl = sweet.imageUrl || getDefaultImage(sweet.category);
  const imageAlt = sweet.imageAlt || `${sweet.name} - ${sweet.category}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getDefaultImage("default");
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {sweet.quantity === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </motion.div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-slate-900 mb-3">
            {sweet.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              {sweet.category}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-slate-900">
              ₹{sweet.price}
            </span>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  sweet.quantity > 0 ? "bg-green-500" : "bg-red-500"
                }`}
                animate={sweet.quantity > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className={`text-xs font-medium ${
                  sweet.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {sweet.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {sweet.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
              {sweet.description}
            </p>
          )}

          <div className="text-xs text-slate-500 mb-4">
            <span className="font-medium">
              Available: {sweet.quantity} pieces
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAddToCart}
              disabled={sweet.quantity === 0}
              className={`w-full py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                sweet.quantity === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {sweet.quantity === 0 ? "Sold Out" : "Add to Cart"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
