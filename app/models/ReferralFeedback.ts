import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { ReferralFeedbackInterface } from "~/utils/types";


const schema = new Schema<ReferralFeedbackInterface>(
  {
    visit: {
      type: Schema.Types.ObjectId,
      ref: "visits",
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    followUpPlan: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let ReferralFeedback: mongoose.Model<ReferralFeedbackInterface>;
try {
  ReferralFeedback = mongoose.model<ReferralFeedbackInterface>("referral_feedbacks");
} catch (error) {
  ReferralFeedback = mongoose.model<ReferralFeedbackInterface>("referral_feedbacks", schema);
}

export default ReferralFeedback;
