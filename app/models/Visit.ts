import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { VisitInterface } from "~/utils/types";

const schema = new Schema<VisitInterface>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    requestType: {
      type: String,
      enum: ["walk-in", "request", "emergency", "schedule"],
      default: "walk-in",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    visitRecords: [
      {
        medicalRequest: {
          type: Schema.Types.ObjectId,
          ref: "medical_requests",
          required: true,
        },
        visitType: {
          type: String,
          enum: ["initial-visit", "review"],
          default: "initial-visit",
        },
        visited: {
          type: Boolean,
          default: false,
        },
        nextAppointment: {
          type: Date,
          required: false,
        },

        vitals: {
          type: Schema.Types.ObjectId,
          ref: "vitals",
          required: false,
        },
        consultation: {
          type: Schema.Types.ObjectId,
          ref: "consultations",
          required: false,
        },
        labs: {
          type: Schema.Types.ObjectId,
          ref: "labs",
          required: false,
        },
        referralFeedback: {
          type: Schema.Types.ObjectId,
          ref: "referral_feedbacks",
          required: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Visit: mongoose.Model<VisitInterface>;
try {
  Visit = mongoose.model<VisitInterface>("visits");
} catch (error) {
  Visit = mongoose.model<VisitInterface>("visits", schema);
}

export default Visit;
