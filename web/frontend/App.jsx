import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";
import CreateBucket from "./pages/CreateBucket.jsx";
import product from "./pages/product.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStoreDetail } from "./redux/slices/StoreSlice.js";
export default function App() {
  const dispatch = useDispatch();

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
      
    } catch (error) {
      console.log(error)
    }
  }


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
        <NavMenu>
          <Link to="/" rel="home" />
          <Link to="/createBucket" element={<CreateBucket />}>Create Buckets</Link>
          <Link to="/product" element={<product />}>Check Products</Link>
        </NavMenu>
        <Routes pages={pages} />
      </QueryProvider>
    </PolarisProvider>
  );
}
