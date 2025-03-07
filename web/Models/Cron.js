import mongoose from "mongoose";

const cronSchema = new mongoose.Schema({
  Store_Id: String,
  Store_name: String,
  CronJob: String,
  backupTime: String,
});

export default mongoose.model("Cron", cronSchema);
