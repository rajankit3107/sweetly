import mongoose, { Document, Schema } from "mongoose";
import { string } from "zod";

export interface Isweets extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: number;
}

const sweetSchema = new Schema<Isweets>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Sweet = mongoose.model<Isweets>("Sweet", sweetSchema);
