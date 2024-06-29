import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { LabRequestInterface } from "~/utils/types";

const schema = new Schema<LabRequestInterface>(
  {
    visit: {
      type: Schema.Types.ObjectId,
      ref: "visits",
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    labTests: [
      {
        test: {
          type: String,
        },
        result: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

let LabRequest: mongoose.Model<LabRequestInterface>;
try {
  LabRequest = mongoose.model<LabRequestInterface>("lab_requests");
} catch (error) {
  LabRequest = mongoose.model<LabRequestInterface>("lab_requests", schema);
}

export default LabRequest;
