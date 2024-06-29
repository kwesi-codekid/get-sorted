import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { EmailInterface } from "~/utils/types";

const schema = new Schema<EmailInterface>(
  {
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    html: {
      type: String,
    },
    // church: {
    //   type: Schema.Types.ObjectId,
    //   ref: "churches",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

let Email: mongoose.Model<EmailInterface>;
try {
  Email = mongoose.model<EmailInterface>("emails");
} catch (error) {
  Email = mongoose.model<EmailInterface>("emails", schema);
}

export default Email;
