import express from "express";
import { GetCronJob, SetCronJob } from "../Controllers/Cron.js";
export const cronRouter = express.Router();

cronRouter.post("/set_cron",SetCronJob)
cronRouter.get("/get_cron",GetCronJob)