import Store from "../Models/Store.js";

export const ValidateUser = async (req, res) => {
  try {
    const {
      Storx_Acces_Key,
      Storx_Secret_Key,
      Storx_Endpoint,
      Store_name,
      StoreId,
      Store_domain,
    } = req.body;

    if (!Storx_Acces_Key || !Storx_Secret_Key || !Storx_Endpoint) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const findUser = await Store.findOne({ StoreId });

    if (!findUser) {
      const store = new Store({
        Store_name,
        StoreId,
        Store_domain,
        Storx_Acces_Key,
        Storx_Secret_Key,
        Storx_Endpoint,
      });

      await store.save();
      res.status(200).json({ success: true, message: "Store validated" });
    }
    const updatedStore = await Store.findOneAndUpdate(
      { StoreId }, // The condition to find the store
      {
        Store_name,
        Store_domain,
        Storx_Acces_Key,
        Storx_Secret_Key,
        Storx_Endpoint,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      updatedStore,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getCredential = async (req, res) => {
  try {
    const { storeId } = req.query;

    const findUser = await Store.findOne({ StoreId: storeId });

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    res.status(200).json({ success: true, Store: findUser });
  } catch (error) {
    console.log(error);
  }
};
