import express from "express";
import {
  retreiveMeta,
  retreiveOrders,
  retreiveProduct,
  retrieveAllProducts,
  retrieveBlogs,
  retrieveCustomCollection,
  retrieveCustomers,
  retrievePages,
  retrieveSmartCollection,
  retrieveTheme,
  saveBlogs,
  saveCustomCollection,
  saveCustomers,
  saveMeta,
  saveOrders,
  savePages,
  saveProducts,
  saveSmartCollection,
  saveTheme,
} from "../Controllers/productController.js";
export const prodRouter = express.Router();

prodRouter.get("/get_products", retreiveProduct);
prodRouter.get("/get_meta", retreiveMeta);
prodRouter.get("/get_customers", retrieveCustomers);
prodRouter.get("/get_Blogs", retrieveBlogs);
prodRouter.get("/get_Theme", retrieveTheme);
prodRouter.get("/get_pages", retrievePages);
prodRouter.get("/get_SmartCollection", retrieveSmartCollection);
prodRouter.get("/get_CustomCollection", retrieveCustomCollection);
prodRouter.get("/get_ordersList", retreiveOrders);
prodRouter.get("/get_OrdersGQL", retrieveAllProducts)

// Saving data in local
prodRouter.post("/save_products", saveProducts);
prodRouter.post("/save_Meta", saveMeta);
prodRouter.post("/save_customers", saveCustomers);
prodRouter.post("/save_Blog", saveBlogs);
prodRouter.post("/save_Theme", saveTheme);
prodRouter.post("/save_Pages", savePages);
prodRouter.post("/save_SmartCollection", saveSmartCollection);
prodRouter.post("/save_CustomCollection", saveCustomCollection);
prodRouter.post("/save_Orders", saveOrders);
