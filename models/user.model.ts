// models/user.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser {
  email: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  phoneNumber?: string;
  avatar?: string;
  investorStatus?: "Accredited investor(1M+)" | "Qualified client(2M+)" | "Qualified purchaser(5M+)" | "Not Accredited" | string;
  citizenship?: "US" | "Non-US" | string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phoneNumber: { type: String, trim: true },
    avatar: { type: String, trim: true },
    investorStatus: {
      type: String,
      enum: [
        "Not Accredited",
        "Accredited investor(1M+)",
        "Qualified client(2M+)",
        "Qualified purchaser(5M+)",
      ],
      default: "Not Accredited",
    },
    citizenship: {
      type: String,
      enum: ["US", "Non-US"],
      default: "US",
    },
  },
  { timestamps: true }
);


export default mongoose.models.User ||  mongoose.model("User", userSchema);
