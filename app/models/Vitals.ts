import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { VitalInterface } from "~/utils/types";

const schema = new Schema<VitalInterface>(
  {
    // staff: {
    //   type: Schema.Types.ObjectId,
    //   ref: "users",
    //   required: true,
    // },
    visit: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
    },
    pulse: {
      type: String,
    },
    respiration: {
      type: String,
    },
    sp02: {
      type: String,
    },
    weight: {
      type: String,
    },
    height: {
      type: String,
    },
    bmi: {
      type: String,
    },
    bp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Vital: mongoose.Model<VitalInterface>;
try {
  Vital = mongoose.model<VitalInterface>("vitals");
} catch (error) {
  Vital = mongoose.model<VitalInterface>("vitals", schema);
}

export default Vital;
