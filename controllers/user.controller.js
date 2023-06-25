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
