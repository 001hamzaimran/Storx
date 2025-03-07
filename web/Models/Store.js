import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  Store_name: String,
  StoreId: String,
  Store_domain: String,
  Storx_Acces_Key: String,
  Storx_Secret_Key: String,
  Storx_Endpoint: String,
});

export default mongoose.model("Store", storeSchema);