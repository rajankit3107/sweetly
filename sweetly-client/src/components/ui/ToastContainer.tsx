import { useEffect, useState } from "react";

type Toast = { id: number; message: string; type?: "success" | "error" };

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    (window as any).appToast = (message: string, type: any = "success") => {
      const id = Date.now();
      setToasts((s) => [...s, { id, message, type }]);
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 3500);
    };
  }, []);
  return (
    <div className="fixed right-4 top-16 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow ${
            t.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
