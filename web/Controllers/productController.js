import shopify from "../shopify.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";

/**
 * Safe JSON response handler to prevent parsing errors
 */

const safeJsonResponse = async (res, fetchFunction) => {
  try {
    const data = await fetchFunction();
    return res.status(200).json({ status: true, ...data });
  } catch (error) {
    console.error("API Fetch Error:", error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to fetch data" });
  }
};

export const retreiveProduct = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const Products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
    });
    return { Products: Products || [] };
  });
};

export const retreiveMeta = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const Meta = await shopify.api.rest.Metafield.all({
      session: res.locals.shopify.session,
    });
    return { Meta: Meta || [] };
  });
};

export const retrieveCustomers = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const Customers = await shopify.api.rest.Customer.all({
      session: res.locals.shopify.session,
    });
    return { Customers: Customers || [] };
  });
};

export const retrieveBlogs = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const Blogs = await shopify.api.rest.Blog.all({
      session: res.locals.shopify.session,
    });
    return { Blogs: Blogs || [] };
  });
};

export const retrieveTheme = async (req, res) => {
  await safeJsonResponse(res, async () => {
    console.log("Session ...... ", res.locals.shopify.session);
    const Theme = await shopify.api.rest.Theme.all({
      session: res.locals.shopify.session,
    });
    return { Theme: Theme || [] };
  });
};

export const retrievePages = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const Pages = await shopify.api.rest.Page.all({
      session: res.locals.shopify.session,
    });
    return { Pages: Pages || [] };
  });
};

export const retrieveSmartCollection = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const SmartCollection = await shopify.api.rest.SmartCollection.all({
      session: res.locals.shopify.session,
    });
    return { SmartCollection: SmartCollection || [] };
  });
};

export const retrieveCustomCollection = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const CustomCollection = await shopify.api.rest.CustomCollection.all({
      session: res.locals.shopify.session,
    });
    return { CustomCollection: CustomCollection || [] };
  });
};

export const retreiveOrders = async (req, res) => {
  await safeJsonResponse(res, async () => {
    const allOrders = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
    });
    return { allOrders: allOrders || [] };
  });
};

/**
 * Helper function to write JSON safely
 */

const saveJsonToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
    throw new Error(`Failed to save file: ${filePath}`);
  }
};

export const saveProducts = async (req, res) => {
  try {
    const { Product } = req.body;
    if (!Product || !Array.isArray(Product)) {
      return res.status(400).json({ success: false, message: "Invalid Product data" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define file paths
    const jsonFilePath = path.join(__dirname, "../data/products.json");
    const csvFilePath = path.join(__dirname, "../data/products.csv");

    // Save JSON file
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(Product, null, 2));
    } catch (jsonError) {
      console.error("Error saving JSON file:", jsonError);
      return res.status(500).json({ success: false, error: "Failed to save JSON file", details: jsonError.message });
    }

    // Transform products into CSV format
    const formattedProducts = Product.map(product => ({
      Title: product.title,
      "URL handle": product.handle,
      Description: product.body_html ? product.body_html.replace(/<[^>]*>?/gm, '') : '', // Remove HTML tags
      Vendor: product.vendor || '',
      "Product category": product.product_type || '',
      Type: product.product_type || '',
      Tags: product.tags || '',
      "Published on online store": product.published_scope === "global",
      Status: product.status || '',
      SKU: product.variants?.[0]?.sku || '',
      Price: product.variants?.[0]?.price || '',
      "Inventory quantity": product.variants?.[0]?.inventory_quantity || 0,
      "Product image URL": product.images?.[0]?.src || '',
      "Variant image URL": product.variants?.[0]?.image_id 
        ? product.images.find(img => img.id === product.variants?.[0]?.image_id)?.src 
        : ''
    }));

    // Convert to CSV and save
    try {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(formattedProducts);
      fs.writeFileSync(csvFilePath, csv);
    } catch (csvError) {
      console.error("Error writing CSV file:", csvError);
      return res.status(500).json({ success: false, error: "Failed to save CSV file", details: csvError.message });
    }

    return res.json({ success: true, message: "Products saved successfully!" });
  } catch (error) {
    console.error("Unexpected error saving products:", error);
    return res.status(500).json({ success: false, error: "Unexpected failure", details: error.message });
  }
};

export const saveMeta = async (req, res) => {
  try {
    const { Meta } = req.body;
    if (!Meta) {
      return res
        .status(400)
        .json({ success: false, message: "Meta not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Metas.json");
    saveJsonToFile(filePath, Meta);

    return res.json({ message: "Meta saved successfully!" });
  } catch (error) {
    console.error("Error saving Meta:", error);
    return res.status(500).json({ error: "Failed to save Meta" });
  }
};

export const saveCustomers = async (req, res) => {
  try {
    const { Customer } = req.body;

    if (!Customer || !Array.isArray(Customer)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer data" });
    }

    // Transform data to match Shopify's required fields
    const formattedCustomers = Customer.map((cust) => ({
      "First Name": cust.first_name || "Devi",
      "Last Name": cust.last_name || "Revi",
      Email: cust.email || "devirevi@gmail.com",
      "Accepts Email Marketing":
        cust.email_marketing_consent?.state || "not_subscribed",
      "Default Address Company": cust.default_address?.company || "",
      "Default Address Address1": cust.default_address?.address1 || "",
      "Default Address Address2": cust.default_address?.address2 || "",
      "Default Address City": cust.default_address?.city || "",
      "Default Address Province Code":
        cust.default_address?.province_code || "",
      "Default Address Country Code": cust.default_address?.country_code || "",
      "Default Address Zip": cust.default_address?.zip || "",
      "Default Address Phone": cust.default_address?.phone || "",
      Phone: cust.phone || "",
      "Accepts SMS Marketing":
        cust.sms_marketing_consent?.state || "not_subscribed",
      Tags: cust.tags || "",
      Note: cust.note || "",
      "Tax Exempt": cust.tax_exempt ? "Yes" : "No",
    }));

    // Define CSV headers exactly as in the sample file
    const csvFields = [
      "First Name",
      "Last Name",
      "Email",
      "Accepts Email Marketing",
      "Default Address Company",
      "Default Address Address1",
      "Default Address Address2",
      "Default Address City",
      "Default Address Province Code",
      "Default Address Country Code",
      "Default Address Zip",
      "Default Address Phone",
      "Phone",
      "Accepts SMS Marketing",
      "Tags",
      "Note",
      "Tax Exempt",
    ];

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(formattedCustomers);

    // Define file paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../data/Customers.json");
    const csvFilePath = path.join(__dirname, "../data/Customers.csv");

    // Save JSON file
    fs.writeFileSync(filePath, JSON.stringify(formattedCustomers, null, 2));

    // Save CSV file
    fs.writeFileSync(csvFilePath, csv);

    return res.json({ message: "Customer data saved successfully!" });
  } catch (error) {
    console.error("Error saving customers:", error);
    return res.status(500).json({ error: "Failed to save customer data" });
  }
};
export const saveBlogs = async (req, res) => {
  try {
    const { Blog } = req.body;
    if (!Blog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Blogs.json");
    saveJsonToFile(filePath, Blog);

    return res.json({ message: "Blog saved successfully!" });
  } catch (error) {
    console.error("Error saving Blogs:", error);
    return res.status(500).json({ error: "Failed to save Blog" });
  }
};

export const saveTheme = async (req, res) => {
  try {
    const { Theme } = req.body;
    if (!Theme) {
      return res
        .status(400)
        .json({ success: false, message: "Theme not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Theme.json");
    saveJsonToFile(filePath, Theme);

    return res.json({ message: "Theme saved successfully!" });
  } catch (error) {
    console.error("Error saving Theme:", error);
    return res.status(500).json({ error: "Failed to save Theme" });
  }
};

export const savePages = async (req, res) => {
  try {
    const { Page } = req.body;
    if (!Page) {
      return res
        .status(400)
        .json({ success: false, message: "Page not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Pages.json");
    saveJsonToFile(filePath, Page);

    return res.json({ message: "Page saved successfully!" });
  } catch (error) {
    console.error("Error saving Page:", error);
    return res.status(500).json({ error: "Failed to save Page" });
  }
};

export const saveSmartCollection = async (req, res) => {
  try {
    const { SmartCollection } = req.body;
    if (!SmartCollection) {
      return res
        .status(400)
        .json({ success: false, message: "SmartCollection not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/SmartCollection.json");
    saveJsonToFile(filePath, SmartCollection);

    return res.json({ message: "SmartCollection saved successfully!" });
  } catch (error) {
    console.error("Error saving SmartCollection:", error);
    return res.status(500).json({ error: "Failed to save SmartCollection" });
  }
};

export const saveCustomCollection = async (req, res) => {
  try {
    const { CustomCollection } = req.body;
    if (!CustomCollection) {
      return res
        .status(400)
        .json({ success: false, message: "CustomCollection not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/CustomCollection.json");
    saveJsonToFile(filePath, CustomCollection);

    return res.json({ message: "CustomCollection saved successfully!" });
  } catch (error) {
    console.error("Error saving CustomCollection:", error);
    return res.status(500).json({ error: "Failed to save CustomCollection" });
  }
};

export const saveOrders = async (req, res) => {
  try {
    const { Orders } = req.body;
    if (!Orders) {
      return res
        .status(400)
        .json({ success: false, message: "OrdersList not found" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../data/Orders.json");
    saveJsonToFile(filePath, Orders);

    return res.status(200).json({ message: "Orders Saved Succesfully" });
  } catch (error) {
    console.log("Error Saving Orders ", error);
    return res.status(500).json({ error: "Failed to save Orders" });
  }
};
