// models/user.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser {
  email: string;
  name?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  phoneNumber?: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phoneNumber: { type: String, trim: true },
  },
  { timestamps: true }
);


export default mongoose.models.User ||  mongoose.model("User", userSchema);
