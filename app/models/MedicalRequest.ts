import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { MedicalRequestInterface } from "~/utils/types";

const schema = new Schema<MedicalRequestInterface>(
  {
    initialComplaint: {
      type: String,
      required: true,
    },
    requestedFor: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    approvedAt: {
      type: Date,
      required: false,
    },
    declinedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    declinedAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    shift: {
      type: String,
      enum: ["day", "night"],
      default: "day",
    },
  },
  {
    timestamps: true,
  }
);

let MedicalRequest: mongoose.Model<MedicalRequestInterface>;
try {
  MedicalRequest = mongoose.model<MedicalRequestInterface>("medical_requests");
} catch (error) {
  MedicalRequest = mongoose.model<MedicalRequestInterface>(
    "medical_requests",
    schema
  );
}

export default MedicalRequest;
