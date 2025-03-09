import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";
import CreateBucket from "./pages/CreateBucket.jsx";
import product from "./pages/product.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStoreDetail } from "./redux/slices/StoreSlice.js";
import { setMeta, setProducts } from "./redux/slices/BackupSlice.js";
import { saveMeta, saveProducts } from "./pages/index.jsx";
export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [Products, setProduct] = useState([]);


  const storefetch = async () => {
    try {

      const response = await fetch("/api/store/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("App data store ", data);

      if (response.ok) {
        const store = data.Store
        dispatch(setStoreDetail(store));
      }
      await fetchProducts();
      await fetchMeta();

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  const fetchProducts = async () => {
    try {
      const resp = await fetch("/api/get_products", { method: 'GET' });
      const data = await resp.json();
      const Prod = data.Products.data;

      setProduct(Prod);

      if (Prod.length > 0) {
        console.log("Products ", Prod); // ✅ Log updated data
        dispatch(setProducts(Prod));
        saveProducts(Prod);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMeta = async () => {
    try {
      const resp = await fetch("/api/get_meta", { method: 'GET' });
      const data = await resp.json();
      const Meta = data.Meta.data;

      if (Meta.length > 0) {
        console.log("Meta data", Meta); // ✅ Log updated data
        dispatch(setMeta(Meta));
        saveMeta(Meta); 
      }
      // console.log("Meta data", data.Meta.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    storefetch();
  }, []);

  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <QueryProvider>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <NavMenu>
              <Link to="/" rel="home" />
              <Link to="/createBucket" element={<CreateBucket />}>Set Backup Time</Link>
              <Link to="/product" element={<product />}>Check Products</Link>
            </NavMenu>
            <Routes pages={pages} />
          </>
        )}
      </QueryProvider>
    </PolarisProvider>
  );
}
