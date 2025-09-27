import React, { useEffect, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Label from "./ui/Lable";
import api from "../api/axios";

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

interface SweetFormProps {
  reload: () => void;
  edit: Sweet | null;
  onClear: () => void;
}

export default function SweetForm({ reload, edit, onClear }: SweetFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  useEffect(() => {
    if (edit) {
      setName(edit.name || "");
      setCategory(edit.category || "");
      setPrice(edit.price || 0);
      setQuantity(edit.quantity || 0);
      setDescription(edit.description || "");
      setImageUrl(edit.imageUrl || "");
      setImageAlt(edit.imageAlt || "");
    } else {
      resetForm();
    }
  }, [edit]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const sweetData = {
        name,
        category,
        price,
        quantity,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        imageAlt: imageAlt || undefined,
      };

      if (edit) {
        await api.put(`/admin/sweets/${edit._id}`, sweetData);
        window.appToast?.("Sweet updated successfully!", "success");
      } else {
        await api.post(`/admin/sweets`, sweetData);
        window.appToast?.("Sweet created successfully!", "success");
      }

      resetForm();
      onClear?.();
      reload?.();
    } catch (err: any) {
      (window as Window).appToast?.(
        err?.response?.data?.message || "Operation failed",
        "error"
      );
    }
  }

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice(0);
    setQuantity(0);
    setDescription("");
    setImageUrl("");
    setImageAlt("");
    onClear?.();
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-primary-100/50 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
          {edit ? "✏️" : "➕"}
        </div>
        <h3 className="text-xl font-display text-primary-800">
          {edit ? "Edit Sweet" : "Add New Sweet"}
        </h3>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="e.g., Gulab Jamun"
              required
            />
          </div>

          <div>
            <Label>Category *</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select Category</option>
              <option value="mithai">Mithai</option>
              <option value="laddu">Laddu</option>
              <option value="barfi">Barfi</option>
              <option value="gulab jamun">Gulab Jamun</option>
              <option value="rasgulla">Rasgulla</option>
              <option value="kaju katli">Kaju Katli</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label>Price (₹) *</Label>
            <Input
              type="number"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(Number(e.target.value))
              }
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label>Quantity *</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(Number(e.target.value))
              }
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the sweet, its taste, ingredients, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-20 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Image URL</Label>
            <Input
              value={imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setImageUrl(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leave empty to use default category image
            </p>
          </div>

          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={imageAlt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setImageAlt(e.target.value)
              }
              placeholder="e.g., Fresh Gulab Jamun on plate"
            />
          </div>
        </div>

        {imageUrl && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <img
              src={imageUrl}
              alt={imageAlt || "Preview"}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Image Preview
              </p>
              <p className="text-xs text-slate-500">
                This is how the image will appear in the card
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            type="submit"
            disabled={!name || !category || price <= 0 || quantity < 0}
          >
            {edit ? "Update Sweet" : "Create Sweet"}
          </Button>
          <Button type="button" onClick={resetForm} variant="secondary">
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}
