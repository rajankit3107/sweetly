import React from "react";
import { motion } from "framer-motion";

export function Dialog({ children, open, onClose }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6 z-10 w-[90%] max-w-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
