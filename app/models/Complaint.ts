import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { ComplaintInterface } from "~/utils/types";

const schema = new Schema<ComplaintInterface>(
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

let Complaint: mongoose.Model<ComplaintInterface>;
try {
  Complaint = mongoose.model<ComplaintInterface>("complaints");
} catch (error) {
  Complaint = mongoose.model<ComplaintInterface>("complaints", schema);
}

export default Complaint;
