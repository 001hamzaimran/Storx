import express from "express";
import { createBucketOnCron, deleteBucket, downloadFile, emptyBucket, ListBuckets, listFiles } from "../Controllers/CreateBuckets.js";
export const bucketRouter = express.Router();


// bucketRouter.post("/create_bucket",createBucket);
bucketRouter.post("/checkingBucket",createBucketOnCron)
bucketRouter.get("/get_bucketList",ListBuckets)
bucketRouter.get("/get_fileList",listFiles)
bucketRouter.get("/download_file",downloadFile)

bucketRouter.delete("/delete_bucket",deleteBucket)
bucketRouter.delete("/empty_Bucket",emptyBucket)