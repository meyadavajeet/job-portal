import express from "express";
import * as userController from "../controllers/user.controller.js";
import userAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET ALL USERS
router.get("/get", userAuth, userController.getUsers);

// update users || PUT
router.put("/update/:id", userAuth, userController.updateUsers);

// delete users || PUT
router.delete("/delete/:id", userAuth, userController.deleteUsers);

router.get("/get-by-id/:id", userAuth, userController.getUserById);

export default router;
