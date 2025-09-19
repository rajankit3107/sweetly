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
    <Card className="group overflow-hidden minimal-card rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultImage("default");
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {sweet.quantity === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-xl">Out of Stock</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-display text-slate-800 group-hover:text-slate-700 transition-colors font-bold mb-2">
          {sweet.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full shadow-sm">
            {sweet.category}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold text-slate-800">
            ₹{sweet.price}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                sweet.quantity > 0
                  ? "bg-green-500 animate-diwali-glow"
                  : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                sweet.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {sweet.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {sweet.description && (
          <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
            {sweet.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500 mb-8">
          <span className="font-semibold">
            Available: {sweet.quantity} pieces
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={sweet.quantity === 0}
          className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
            sweet.quantity === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "diwali-accent shadow-lg hover:shadow-xl hover:scale-105"
          }`}
        >
          {sweet.quantity === 0 ? "Sold Out" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
