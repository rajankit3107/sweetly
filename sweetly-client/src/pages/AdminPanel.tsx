import { useEffect, useState } from "react";
import api from "../api/axios";
import SweetForm from "../components/SweetForm";
import Button from "../components/ui/Button";
import SweetCard from "../components/SweetCard";
import AdminOrders from "../components/AdminOrders";

export default function AdminPanel() {
  const [sweets, setSweets] = useState<string[]>([]);
  const [edit, setEdit] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"sweets" | "orders">("sweets");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/sweets`);
      setSweets(res.data);
    } catch (error) {
      (window as Window).appToast?.("Failed to load sweets", error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this sweet? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete(`/admin/sweets/${id}`);
      window.appToast?.("Sweet deleted successfully", "success");
      load();
    } catch (error) {
      (window as Window).appToast?.("Failed to delete sweet", error as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-xl">
              ⚙️
            </div>
            <div>
              <h1 className="text-3xl font-display text-primary-800">
                Admin Panel
              </h1>
              <p className="text-slate-600">
                Manage your sweet collection and orders
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("sweets")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "sweets"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🍭 Sweets Management
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📦 Orders Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "sweets" ? (
          <>
            {/* Sweet Form */}
            <SweetForm
              reload={load}
              edit={edit}
              onClear={() => setEdit(null)}
            />

            {/* Sweets List */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-primary-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-primary-800">
                  Sweet Collection
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {sweets.length} {sweets.length === 1 ? "sweet" : "sweets"}{" "}
                    total
                  </span>
                  <Button
                    onClick={load}
                    variant="secondary"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/60 rounded-2xl p-6 animate-pulse"
                    >
                      <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : sweets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sweets.map((sweet) => (
                    <div key={sweet._id} className="group relative">
                      <SweetCard sweet={sweet} onPurchased={load} />

                      {/* Admin Controls Overlay */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEdit(sweet)}
                            variant="secondary"
                            size="sm"
                            className="!px-3 !py-1 text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            onClick={() => del(sweet._id)}
                            variant="error"
                            size="sm"
                            className="!px-3 !py-1 text-xs"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍭</div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No sweets yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Start by adding your first sweet using the form above
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Orders Management */
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-primary-100/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-primary-800">
                Orders Management
              </h2>
            </div>
            <AdminOrders />
          </div>
        )}
      </div>
    </div>
  );
}
