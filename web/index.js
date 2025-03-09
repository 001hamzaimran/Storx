// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import router from "./Routes/StoreRoute.js";
import connectDB from "./utils/db.js";
import Store from "./Models/Store.js";
import { cronRouter } from "./Routes/CronRoutes.js";
import { bucketRouter } from "./Routes/BucketRoutes.js";
import { prodRouter } from "./Routes/productRoutes.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json({ limit: "10mb" }));

connectDB();

app.get("/api/test", (req, res) => {
  res.status(200).send({ success: true });
});

app.use("/api", router);
app.use("/postman", router);
app.use("/api", cronRouter);
app.use("/api", bucketRouter);
app.use("/api", prodRouter);
console.log("PORT ",PORT);

// _____CronJob______

// _____CronJob______

// ____________STORE_INFO_______________
app.get("/api/store/info", async (req, res) => {
  try {
    const StoreInfo = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    if (StoreInfo && StoreInfo.data && StoreInfo.data.length > 0) {
      const storeName = StoreInfo.data[0].name;
      const domain = StoreInfo.data[0].domain;
      const Store_Id = StoreInfo.data[0].id;

      // Check if storeName exists in the database
      const existingStore = await Store.findOne({ Store_name: storeName });

      if (!existingStore) {
        const newStore = new Store({
          Store_name: storeName,
          Store_domain: domain,
          StoreId: Store_Id,
        });

        res.status(200).send({ Store: newStore });
      }
      res.status(200).send({ Store: existingStore });
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

// @ts-ignore
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
