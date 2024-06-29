import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { ConsultationInterface } from "~/utils/types";


const schema = new Schema<ConsultationInterface>(
  {
    visit: {
      type: Schema.Types.ObjectId,
      ref: "visits",
      required: true,
    },
    consultation: {
      type: String,
      // required: true,
    },
    complaints: {
      type: String,
      // required: true,
    },
    investigation: {
      type: String,
      // required: true,
    },
    disposition: {
      type: String,
      // required: true,
    },
    treatment: {
      type: String,
      // required: true,
    },
    diagnosis: {
      type: [String],
      // required: true,
    },
    workStatus: {
      type: [String],
      // required: true,
    },
    excuseDutyDuration: {
      type: Number,
      // required: true,
    },
    reviewDate: {
      type: Date,
      // required: true,
    },
    referredTo: {
      type: String,
      // required: true,
    },
    detained: {
      type: Boolean,
      // required: true,
    },
    notes: {
      type: String,
      // required: true,
    },

  },
  {
    timestamps: true,
  }
);

let Consultation: mongoose.Model<ConsultationInterface>;
try {
  Consultation = mongoose.model<ConsultationInterface>("consultations");
} catch (error) {
  Consultation = mongoose.model<ConsultationInterface>("consultations", schema);
}

export default Consultation;
