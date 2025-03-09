import {
  CreateBucketCommand,
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import Store from "../Models/Store.js";
import Cron from "../Models/Cron.js";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const createBucket = async (req, res) => {
  try {
    const { Storx_Acces_Key, Storx_Secret_Key, Storx_Endpoint } = req.body;

    if (!Storx_Acces_Key || !Storx_Secret_Key || !Storx_Endpoint) {
      console.log(Storx_Acces_Key, Storx_Secret_Key, Storx_Endpoint);
      res.status(400).send({
        status: false,
        message: "Invalid Credential",
      });
    }

    const S3 = new S3Client({
      region: "us-east-1",
      endpoint: Storx_Endpoint, //|| "https://gateway.storx.io",
      forcePathStyle: true,
      credentials: {
        accessKeyId: Storx_Acces_Key, //|| "jucxaog7ej4tg7llkvrwblbsmnuq",
        secretAccessKey: Storx_Secret_Key, //|| "jyyqnfuqp6ogyen6rc46avx2ctupzeocstrm4wp24cxjzwjndjtcs",
      },
    });

    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const command = new CreateBucketCommand({ Bucket: formattedDate });
    await S3.send(command);
    res.status(200).json({
      message: "Bucket created successfully",
      bucketName: formattedDate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create bucket", error: error.message });
  }
};

const scheduledJobs = new Map(); // Store scheduled jobs

// export const createBucketOnCron = async (req, res) => {
//   try {
//     const { storeId } = req.query;
//     const { Product } = req.body;

//     const Credential = await Store.findOne({ StoreId: storeId });
//     const CronTimer = await Cron.findOne({ Store_Id: storeId });

//     if (!Credential || !CronTimer) {
//       return res.status(400).json({ message: "Not Found", success: false });
//     }

//     const timeforCron = CronTimer.backupTime || "12:26";
//     const [hours, minutes] = timeforCron.split(":").map(Number);

//     const S3 = new S3Client({
//       region: "us-east-1",
//       endpoint: Credential.Storx_Endpoint,
//       forcePathStyle: true,
//       credentials: {
//         accessKeyId: Credential.Storx_Acces_Key,
//         secretAccessKey: Credential.Storx_Secret_Key,
//       },
//     });

//     // Ensure only one cron job per store
//     if (!scheduledJobs.has(storeId)) {
//       let scheduleTime = ``;

//       if (CronTimer.CronJob === "daily") {
//         scheduleTime = `${minutes} ${hours} * * *`;
//       } else if (CronTimer.CronJob === "weekly") {
//         scheduleTime = `${minutes} ${hours} * * 1`;
//       } else {
//         scheduleTime = "*/30 * * * * *";
//       }

//       //  Run cron job with async function
//       const job = cron.schedule(scheduleTime, async () => {
//         try {
//           const now = new Date();
//           const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
//             .toString()
//             .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

//           const formattedTime = `${now
//             .getHours()
//             .toString()
//             .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}${
//             now.getHours() >= 12 ? "PM" : "AM"
//           }`;

//           const bucketName =
//             `backup-${storeId}-${formattedDate}-${formattedTime}`.toLowerCase();
//           console.log(`Running backup for store: ${storeId} at ${bucketName}`);

//           const command = new CreateBucketCommand({ Bucket: bucketName });
//           await S3.send(command);

//           console.log(`✅ Bucket "${bucketName}" created successfully`);
//         } catch (error) {
//           console.error(`❌ Failed to create bucket: ${error.message}`);
//         }
//       });

//       scheduledJobs.set(storeId, job);
//     }

//     return res.status(200).json({
//       message: "Cron job scheduled",
//       success: true,
//       storeId,
//       schedule: CronTimer.CronJob,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create Bucket",
//       error: error.message,
//     });
//   }
// };

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBucketOnCron = async (req, res) => {
  try {
    const { storeId } = req.query;

    const Credential = await Store.findOne({ StoreId: storeId });
    const CronTimer = await Cron.findOne({ Store_Id: storeId });

    if (!Credential || !CronTimer) {
      return res.status(400).json({ message: "Not Found", success: false });
    }

    const timeforCron = CronTimer.backupTime || "12:26";
    const [hours, minutes] = timeforCron.split(":").map(Number);

    const S3 = new S3Client({
      region: "us-east-1",
      endpoint: Credential.Storx_Endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: Credential.Storx_Acces_Key,
        secretAccessKey: Credential.Storx_Secret_Key,
      },
    });

    if (!scheduledJobs.has(storeId)) {
      let scheduleTime =
        CronTimer.CronJob === "daily"
          ? `${minutes} ${hours} * * *`
          : CronTimer.CronJob === "weekly"
          ? `${minutes} ${hours} * * 1`
          : "*/30 * * * * *";

      const job = cron.schedule(scheduleTime, async () => {
        try {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

          const formattedTime = `${now
            .getHours()
            .toString()
            .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}${
            now.getHours() >= 12 ? "PM" : "AM"
          }`;

          const bucketName =
            `backup-${storeId}-${formattedDate}-${formattedTime}`.toLowerCase();
          console.log(`Running backup for store: ${storeId} at ${bucketName}`);

          // Create Bucket
          const command = new CreateBucketCommand({ Bucket: bucketName });
          await S3.send(command);
          console.log(`✅ Bucket "${bucketName}" created successfully`);

          // Define the data folder path
          const dataFolderPath = path.join(__dirname, "../data");

          // Check if data folder exists
          if (!fs.existsSync(dataFolderPath)) {
            throw new Error(`Data folder does not exist: ${dataFolderPath}`);
          }

          // Read all files in the folder
          const files = fs.readdirSync(dataFolderPath);

          if (files.length === 0) {
            console.log(`⚠️ No files found in "${dataFolderPath}".`);
          } else {
            console.log(`📂 Found ${files.length} files. Uploading...`);

            // Upload each file to S3
            for (const file of files) {
              const filePath = path.join(dataFolderPath, file);
              const fileContent = fs.readFileSync(filePath);

              const uploadParams = {
                Bucket: bucketName,
                Key: file, // Use the original file name
                Body: fileContent,
              };

              await S3.send(new PutObjectCommand(uploadParams));
              console.log(`✅ Uploaded "${file}" successfully.`);
            }
          }
        } catch (error) {
          console.error(`❌ Failed during backup process: ${error.message}`);
        }
      });

      scheduledJobs.set(storeId, job);
    }

    return res.status(200).json({
      message: "Cron job scheduled",
      success: true,
      storeId,
      schedule: CronTimer.CronJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create Bucket",
      error: error.message,
    });
  }
};
