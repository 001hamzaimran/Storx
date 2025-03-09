import express from "express";
import { createBucket, createBucketOnCron } from "../Controllers/CreateBuckets.js";
export const bucketRouter = express.Router();


bucketRouter.post("/create_bucket",createBucket);
bucketRouter.post("/checkingBucket",createBucketOnCron)
