import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import SweetCard from "../components/SweetCard";
import { useEffect, useState } from "react";

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

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/sweets`);
      setSweets(res.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(res.data.map((sweet: Sweet) => sweet.category)),
      ] as string[];
      setCategories(uniqueCategories);
    } catch {
      window.appToast?.("Failed to load sweets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function search() {
    if (!q.trim()) {
      load();
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/user/sweets/search?name=${encodeURIComponent(q)}`
      );
      setSweets(res.data);
    } catch {
      window.appToast?.("Search failed", "error");
    } finally {
      setLoading(false);
    }
  }

  const filteredSweets =
    selectedCategory === "all"
      ? sweets
      : sweets.filter(
          (sweet) =>
            sweet.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Decorative Lights Row */}
        <div
          className="flex justify-center gap-2 mb-6 select-none"
          aria-hidden="true"
        >
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl md:text-3xl animate-twinkle${
                i % 2 === 0 ? " delay-1" : ""
              }`}
              style={{ animationDelay: `${(i % 4) * 0.3}s` }}
            >
              {i % 3 === 0 ? "🪔" : i % 3 === 1 ? "💡" : "🎇"}
            </span>
          ))}
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-10 lg:p-16 mb-14 shadow-xl bg-gradient-to-br from-white via-amber-50 to-amber-100">
          {/* Floating Emojis */}
          <span className="absolute left-8 top-8 text-3xl animate-bounce-slow">
            🎆
          </span>
          <span className="absolute right-12 top-16 text-2xl animate-bounce-slower">
            🧨
          </span>
          <span className="absolute left-1/2 bottom-8 text-2xl animate-bounce-slowest">
            🎇
          </span>

          <div className="relative z-10 text-center">
            <h1 className="text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 mb-6 leading-tight">
              🪔{" "}
              <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                Diwali Sweets
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Celebrate the festival of lights with{" "}
              <span className="font-semibold text-slate-900">
                handcrafted delicacies
              </span>{" "}
              made from authentic recipes, perfect for gifting & family feasts.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-semibold rounded-full shadow-md">
                ✨ Premium Quality
              </span>
              <span className="px-6 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-sm font-semibold rounded-full shadow-md">
                🏠 Handcrafted
              </span>
              <span className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-md">
                🎉 Festive Ready
              </span>
            </div>

            {/* Search + Category */}
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Find Your Sweet
              </h3>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search sweets..."
                  value={q}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQ(e.target.value)
                  }
                  className="flex-1 px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
                <Button
                  onClick={search}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? "..." : "Search"}
                </Button>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white transition-all"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              {q ? `Search Results for "${q}"` : "Our Sweet Collection"}
            </h2>
            <div className="inline-flex items-center px-5 py-2 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
              {filteredSweets.length}{" "}
              {filteredSweets.length === 1 ? "item" : "items"} found
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-6 bg-white shadow-md animate-pulse"
                >
                  <div className="h-56 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mb-6"></div>
                  <div className="h-5 bg-slate-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredSweets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSweets.map((s) => (
                <SweetCard key={s._id} sweet={s} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-8 animate-bounce-slowest">🪔</div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                No sweets found
              </h3>
              <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                {q
                  ? "Try adjusting your search terms or explore all categories."
                  : "Check back soon for new festive delights!"}
              </p>
              {q && (
                <Button
                  onClick={() => {
                    setQ("");
                    load();
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
