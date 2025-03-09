import shopify from "../shopify.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";

export const retreiveProduct = async (req, res) => {
  try {
    // const { session } = res.locals.shopify;
    const Products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
    });

    if (!Products) {
      return res
        .status(400)
        .json({ status: false, message: "Products not Fetched" });
    }

    return res.status(200).json({ status: true, Products: Products });
  } catch (error) {
    console.log(error);
  }
};

export const retreiveMeta = async (req, res) => {
  try {
    const Meta = await shopify.api.rest.Metafield.all({
      session: res.locals.shopify.session,
    });

    if (!Meta) {
      return res
        .status(400)
        .json({ status: false, message: "Meta not Fetched" });
    }

    return res.status(200).json({ status: true, Meta });
  } catch (error) {
    console.log(error);
  }
};

// export const saveProducts = async (req, res) => {
//   try {
//     const { Product } = req.body;
//     if (!Product) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Product does not found" });
//     }

//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);

//     const filePath = path.join(__dirname, "../data/products.json");
//     fs.writeFileSync(filePath, JSON.stringify(Product, null, 2));
//     res.json({ message: "Products saved successfully!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to save products" });
//   }
// };

export const saveProducts = async (req, res) => {
  try {
    const { Product } = req.body;
    if (!Product || !Array.isArray(Product)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product data" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define file paths
    const jsonFilePath = path.join(__dirname, "../data/products.json");
    const csvFilePath = path.join(__dirname, "../data/products.csv");

    // Save JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(Product, null, 2));

    // Convert to CSV and save
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(Product);
    fs.writeFileSync(csvFilePath, csv);

    res.json({ message: "Products saved successfully!" });
  } catch (error) {
    console.error("Error saving products:", error);
    res.status(500).json({ error: "Failed to save products" });
  }
};


export const saveMeta = async (req, res) => {
  try {
    const { Meta } = req.body;
    if (!Meta) {
      return res
        .status(400)
        .json({ success: false, message: "Meta does not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Metas.json");
    fs.writeFileSync(filePath, JSON.stringify(Meta, null, 2));
    res.json({ message: "Meta saved successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save Meta" });
  }
};
