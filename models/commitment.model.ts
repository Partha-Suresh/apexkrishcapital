import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICommitment {
  userId: mongoose.Types.ObjectId | string;
  userEmail: string;
  userName: string;
  offeringId: string;
  offeringTitle: string;
  type: "interest" | "commitment";
  amount?: number | null;
  status: "active" | "wire_received" | "allocated" | "cancelled";
  notes?: string;
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
      index: true,
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
      index: true,
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
      index: true,
    },
    amount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "wire_received", "allocated", "cancelled"],
      default: "active",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for fast offering aggregation & filtering
commitmentSchema.index({ offeringId: 1, type: 1, status: 1 });

// Prevent re-compilation in development HMR
export default (mongoose.models.Commitment as Model<ICommitmentDocument>) ||
  mongoose.model<ICommitmentDocument>("Commitment", commitmentSchema);
