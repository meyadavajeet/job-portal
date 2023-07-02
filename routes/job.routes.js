import express from "express";

import * as jobController from "../controllers/job.controller.js";
import userAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

//routes
router.post("/create-job", userAuth, jobController.createJob);

router.get("/get-job", userAuth, jobController.getAllJobs);

router.patch("/update-job/:id", userAuth, jobController.updateJob);

router.delete("/delete-job/:id", userAuth, jobController.deleteJob);

router.get("/job-stats", userAuth, jobController.jobStats);

export default router;
