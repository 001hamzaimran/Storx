import Cron from "../Models/Cron.js";

export const SetCronJob = async (req, res) => {
  try {
    const { Store_Id, Store_name, CronJob, backupTime } = req.body;
    const findUser = await Cron.findOne({ Store_Id });
    if (!findUser) {
      const cron = new Cron({ Store_Id, Store_name, CronJob, backupTime });
      await cron.save();
      return res
        .status(200)
        .json({ success: true, message: "Cron job set successfully" });
    } else {
      findUser.CronJob = CronJob;
      findUser.backupTime = backupTime;
      await findUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Cron job updated successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const GetCronJob = async (req, res) => {
  try {
    const { Store_Id } = req.query;
    const findUser = await Cron.findOne({ Store_Id });
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "Cron job not found" });
    } else {
      return res.status(200).json({ success: true, CronJob: findUser.CronJob });
    }
  } catch (error) {
    console.log(error);
  }
};
