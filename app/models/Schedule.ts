import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { BranchInterface } from "~/utils/types";

const schema = new Schema<BranchInterface>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    schedules: [
      {
        scheduleType: {
          type: String,
          enum: ["initial-schedule", "review"],
          default: "initial-schedule",
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Schedule: mongoose.Model<BranchInterface>;
try {
  Schedule = mongoose.model<BranchInterface>("schedules");
} catch (error) {
  Schedule = mongoose.model<BranchInterface>("schedules", schema);
}

export default Schedule;
