import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICommitment {
  userId: mongoose.Types.ObjectId | string;
  userEmail: string;
  userName: string;
  offeringId: string;
  offeringTitle: string;
  type: "interest" | "commitment";
  amount?: number | null;
  status: "active" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommitmentDocument extends ICommitment, Document {}

const commitmentSchema = new Schema<ICommitmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
      default: "",
    },
    offeringId: {
      type: String,
      required: true,
      trim: true,
    },
    offeringTitle: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["interest", "commitment"],
      required: true,
    },
    amount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Prevent re-compilation in development HMR
export default (mongoose.models.Commitment as Model<ICommitmentDocument>) ||
  mongoose.model<ICommitmentDocument>("Commitment", commitmentSchema);

