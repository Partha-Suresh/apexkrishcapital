import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDealLink {
  offeringId: string;
  thirdPartyUrl: string;
  instructions?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDealLinkDocument extends IDealLink, Document {}

const dealLinkSchema = new Schema<IDealLinkDocument>(
  {
    offeringId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    thirdPartyUrl: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      default: "",
      trim: true,
    },
    updatedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default (mongoose.models.DealLink as Model<IDealLinkDocument>) ||
  mongoose.model<IDealLinkDocument>("DealLink", dealLinkSchema);

