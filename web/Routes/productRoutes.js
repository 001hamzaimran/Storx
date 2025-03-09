import express from "express";
import { retreiveMeta, retreiveProduct, saveMeta, saveProducts } from "../Controllers/productController.js";
export const prodRouter = express.Router();


prodRouter.get("/get_products", retreiveProduct)
prodRouter.get("/get_meta", retreiveMeta)
prodRouter.post("/save_products", saveProducts)
prodRouter.post("/save_Meta", saveMeta)