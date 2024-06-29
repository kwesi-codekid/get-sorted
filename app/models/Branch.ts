import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { BranchInterface } from "~/utils/types";

const schema = new Schema<BranchInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "churches",
      required: true,
    },
    denomination: {
      type: Schema.Types.ObjectId,
      ref: "denominations",
      // required: true,
    },
    appointingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "appointing_officers",
      // required: true,
    },
    licenseDate: {
      type: String,
      // required: true,
    },
    location: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Branch: mongoose.Model<BranchInterface>;
try {
  Branch = mongoose.model<BranchInterface>("branches");
} catch (error) {
  Branch = mongoose.model<BranchInterface>("branches", schema);
}

export default Branch;
