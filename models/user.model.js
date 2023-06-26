import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name Is Required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, " Email is Required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);
// middleware
userSchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEB TOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

userSchema.statics.findAllUsers = async function () {
  try {
    const users = await this.aggregate([
      {
        $match: {
          _id: {
            $exists: true,
          },
          location: {
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              { $ifNull: ["$firstName", ""] },
              " ",
              { $ifNull: ["$lastName", ""] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          password: 0,
          firstName: 0,
          lastName: 0,
          __v: 0,
        },
      },
    ]);
    return users;
  } catch (error) {
    console.log("error in findAllUser", error.message);
  }
};
export default mongoose.model("User", userSchema);
