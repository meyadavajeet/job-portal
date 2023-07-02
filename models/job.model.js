import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required."],
    },
    position: {
      type: String,
      required: [true, "Job position is required"],
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Kolkata",
      required: [true, "Work location is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

jobSchema.static.jobStats = async function (req, res) {};

export default mongoose.model("Job", jobSchema);
