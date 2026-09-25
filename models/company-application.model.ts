// models/company-application.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompanyApplication {
  companyName: string;
  founderName: string;
  workEmail: string;
  phoneNumber?: string;
  websiteUrl?: string;
  pitchDeckUrl?: string;
  stage: string;
  targetRaiseAmount: string;
  currentArr?: string;
  sector: string;
  summary: string;
  status: "pending_review" | "reviewed" | "approved" | "archived" | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICompanyApplicationDocument extends ICompanyApplication, Document {}

const companyApplicationSchema = new Schema<ICompanyApplicationDocument>(
  {
    companyName: { type: String, required: true, trim: true },
    founderName: { type: String, required: true, trim: true },
    workEmail: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    pitchDeckUrl: { type: String, trim: true },
    stage: {
      type: String,
      required: true,
      enum: ["Seed", "Series A", "Series B", "Series C+", "Pre-IPO", "Profitable Bootstrapped"],
      default: "Series A",
    },
    targetRaiseAmount: { type: String, required: true, trim: true },
    currentArr: { type: String, trim: true },
    sector: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending_review", "reviewed", "approved", "archived"],
      default: "pending_review",
    },
  },
  {
    timestamps: true,
  }
);

const CompanyApplication: Model<ICompanyApplicationDocument> =
  mongoose.models.CompanyApplication ||
  mongoose.model<ICompanyApplicationDocument>("CompanyApplication", companyApplicationSchema);

export default CompanyApplication;
