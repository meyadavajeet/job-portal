import jobModel from "../models/job.model.js";
import mongoose from "mongoose";
import moment from "moment";
import { catchAsyncError } from "../middlewares/catch.async.error.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createJob = catchAsyncError(async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next(new ErrorHandler("All field are required", 422));
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
});

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const { status, workType, search, sort } = req.query;

  //condition for searching and filters
  const queryObject = {
    createBy: req.user.userId,
  };

  //   logic for filter
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType != "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = {
      $regex: search,
      $options: "i", // ignore case
    };
  }

  let queryResult = jobModel.find(queryObject);

  //   sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt"); //createdAt desc
  }

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  //   pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);

  //jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numberOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  return res.status(200).send({
    status: true,
    message: "",
    data: {
      totalJobs,
      numberOfPage,
      jobs,
    },
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`no jobs found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorized to update this job");
    return;
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).send({
    status: true,
    message: "Updated successfully",
    data: updateJob,
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`No Job Found With This ID ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorize to delete this job");
    return;
  }
  await job.deleteOne();
  return res.status(200).json({
    status: true,
    message: "Success, Job Deleted!",
    data: [],
  });
});

export const jobStats = catchAsyncError(async (req, res, next) => {
  const jobStats = await jobModel.jobStats(req, res);

  return res.status(200).json({
    status: true,
    message: "Success, Job Deleted!",
    data: jobStats,
  });
});
