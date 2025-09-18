import mongoose, { Document, Schema } from "mongoose";

export type Role = "user" | "admin";

export interface IUser extends Document {
  username: string;
  password: string;
  role: Role;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
