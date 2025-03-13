import express from "express";
import { getCredential, ValidateUser } from "../Controllers/StoreValidate.js";

const router = express.Router();

router.post("/set_credentials", (req, res, next) => {
    console.log("API /set_credentials called", req.body);
    next();
  }, ValidateUser);
router.get("/get_credential",getCredential)

export default router;
