import { motion } from "framer-motion";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import SweetCard from "../components/SweetCard";
import { useEffect, useState, useRef } from "react";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);

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

  // Live search suggestions
  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(
          `/user/sweets/search?name=${encodeURIComponent(q)}`
        );
        if (Array.isArray(res.data)) {
          setSuggestions(res.data.map((s: any) => s.name));
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  const filteredSweets =
    selectedCategory === "all"
      ? sweets
      : sweets.filter(
          (sweet) =>
            sweet.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100"
    >
      {/* Full-width Hero Section with Video */}
      <div className="relative w-full overflow-hidden mb-14 min-h-[480px] md:min-h-[600px]">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-none min-h-[480px] md:min-h-[600px]"
          src="/sweet.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />
        <div
          className="relative z-20 flex flex-col items-center justify-center text-center gap-6 px-4"
          style={{
            minHeight: "480px",
            height: "100%",
            paddingTop: "4vh",
            paddingBottom: "4vh",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-5xl lg:text-6xl font-serif font-extrabold text-white mb-4 leading-tight drop-shadow-lg"
          >
            🪔{" "}
            <span className="bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
              Diwali Sweets
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="text-lg lg:text-xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed drop-shadow"
          >
            Celebrate the festival of lights with{" "}
            <span className="font-semibold text-white">
              handcrafted delicacies
            </span>{" "}
            made from authentic recipes, perfect for gifting & family feasts.
          </motion.p>
          {/* Search and Category Controls */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto mt-4 relative z-30">
            <div className="w-full relative">
              <Input
                type="text"
                placeholder="Search for sweets..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-white/30 bg-white/80 text-slate-900 placeholder-slate-500 shadow focus:ring-2 focus:ring-amber-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") search();
                }}
                onFocus={() => {
                  if (suggestions.length) setShowSuggestions(true);
                }}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-amber-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <li
                      key={s + i}
                      className="px-4 py-2 cursor-pointer hover:bg-amber-100 text-slate-800 text-left"
                      onMouseDown={() => {
                        setQ(s);
                        setShowSuggestions(false);
                        search();
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-white/30 bg-white/80 text-slate-900 shadow focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button
              onClick={search}
              className="px-6 py-2 rounded-lg bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              {q ? `Search Results for "${q}"` : "Our Sweet Collection"}
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.4 }}
              className="inline-flex items-center px-5 py-2 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full"
            >
              {filteredSweets.length}{" "}
              {filteredSweets.length === 1 ? "item" : "items"} found
            </motion.div>
          </motion.div>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredSweets.map((s, index) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6 + index * 0.1 }}
                >
                  <SweetCard sweet={s} />
                </motion.div>
              ))}
            </motion.div>
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
        </motion.div>
      </div>
    </motion.div>
  );
}
