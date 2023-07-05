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
      enum: ["pending", "reject", "interview"],
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

jobSchema.static.jobStats = async function (req, res) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    return stats;
  } catch (error) {
    console.log(`error in jobStats model function ${error}`);
  }
};

jobSchema.static.monthlyApplicationStats = async function (req, res) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    return stats;
  } catch (error) {
    console.log(`error in monthlyStats model function ${error}`);
  }
};

export default mongoose.model("Job", jobSchema);
