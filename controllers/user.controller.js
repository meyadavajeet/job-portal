import { catchAsyncError } from "../middlewares/catch.async.error.js";
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.findAllUsers();
  return res.status(200).send({
    success: true,
    message: "",
    data: users,
  });
});

export const updateUsers = catchAsyncError(async (req, res, next) => {
  const { firstName, email, location } = req.body;

  console.log("inside update user controller");
  //validate
  // if (!firstName) {
  //   next("name is required");
  // }
  // if (!email) {
  //   next("email is required");
  // }
  // if (!location) {
  //   next("location is required");
  // }
  const user = await userModel.findOne({ _id: req.params.id });
  if (!user) {
    next(new ErrorHandler("User with this id  not exist", 404));
  }
  if (req.body.firstName) {
    user.firstName = firstName;
  }
  if (req.body.lastName) {
    user.lastName = req.body.lastName;
  }
  if (req.body.email) {
    user.email = email;
  }
  if (req.body.location) {
    user.location = location;
  }
  await user.save();
  const token = user.createJWT();

  return res.status(200).send({
    success: true,
    message: "Successfully Updated!!",
    data: {
      user,
      token,
    },
  });
});

export const deleteUsers = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById({ _id: id });
  if (!user) {
    next(new ErrorHandler("Data not found in our system!!", 404));
  }
  await userModel.findByIdAndDelete({ _id: id });
  return res.status(200).send({
    success: true,
    message: "Data deleted.",
    data: null,
  });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel
    .findById({ _id: id })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-__v");
  if (!user) {
    next(new ErrorHandler("Data not found in our system!!", 404));
  }
  return res.status(200).send({
    success: true,
    message: "",
    data: user,
  });
});
