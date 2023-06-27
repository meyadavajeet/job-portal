import userModel from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAllUsers();
    return res.status(200).send({
      success: true,
      message: "",
      data: users,
    });
  } catch (error) {
    console.log("error in getUser controller", error.message);
    process.abort();
  }
};

export const updateUsers = async (req, res, next) => {
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
    next("User with this id  not exist");
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

  res.status(200).send({
    success: true,
    message: "Successfully Updated!!",
    data: {
      user,
      token,
    },
  });
};
