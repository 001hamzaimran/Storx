import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";
import CreateBucket from "./pages/createBucket.jsx";
import Buckets from "./pages/Buckets.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStoreDetail } from "./redux/slices/StoreSlice.js";
import { setMeta, setProducts } from "./redux/slices/BackupSlice.js";
import { saveBlog, saveCustomCollection, saveCustomer, saveMeta, saveOrders, savePages, saveProducts, saveSmartCollection, saveTheme } from "./pages/index.jsx";
import { Spinner } from "@shopify/polaris";
export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [Products, setProduct] = useState([])
  const [storefetched, setStorefetch] = useState([]);


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
        setStorefetch(store)
        dispatch(setStoreDetail(store));
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchMeta(),
      fetchCustomers(),
      fetchBlogs(),
      fetchTheme(),
      fetchPage(),
      fetchSmartCollection(),
      fetchCustomCollection(),
      fetchOrders(),]).catch(err => console.log(err));
  }, [storefetched])

  const fetchCustomCollection = async () => {
    try {
      const response = await fetch("/api/get_CustomCollection", {
        method: "GET",
      });
      const data = await response.json();
      const CustomCollection = await data.CustomCollection.data;

      if (CustomCollection.length > 0) {
        console.log("Custom Collection  ", CustomCollection);
        saveCustomCollection(CustomCollection);

      }
    }
    catch (error) {
      console.log("Error on fetching Theme ", error)
    }
  };

  const fetchPage = async () => {
    try {
      const response = await fetch("/api/get_pages", {
        method: "GET",
      });
      const data = await response.json();
      const Pages = data.Pages.data;

      if (Pages.length > 0) {
        console.log("Pages List ", Pages);
        savePages(Pages);
      }
    }
    catch (error) {
      console.log("Error on fetching Theme ", error)
    }
  };


  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/get_ordersList", {
        method: "GET",
      });
      const data = await response.json();
      const allOrders = data.allOrders.data;

      if (allOrders.length > 0) {
        console.log("Custom Collection  ", allOrders);
        saveOrders(allOrders);

      }

      console.log("Orders ", allOrders)
    }
    catch (error) {
      console.log("Error on fetching Theme ", error)
    }
  };

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


  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/get_customers", {
        method: "GET",
      });
      const data = await response.json();
      const Customers = data.Customers.data

      if (Customers.length > 0) {
        console.log("Customers Data", Customers); // ✅ Log updated data
        saveCustomer(Customers);
      }

      // console.log("Customers Data", data.Customers.data)
    } catch (error) {
      console.log("Error on fetching Customers ", error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/get_blogs", {
        method: "GET",
      });
      const data = await response.json();
      const Blogs = data.Blogs.data
      if (Blogs.length > 0) {

        saveBlog(Blogs);
        console.log("Blogs Data", Blogs); // ✅ Log updated data
      }
    }
    catch (error) {
      console.log("Error on fetching Blogs ", error)
    }
  }

  const fetchTheme = async () => {
    try {
      const response = await fetch("/api/get_Theme", {
        method: "GET",
      });
      const data = await response.json();
      const Theme = data.Theme.data

      if (Theme.length > 0) {
        saveTheme(Theme);
        console.log("Theme Data", Theme); // ✅ Log updated data

      }

    }
    catch (error) {
      console.log("Error on fetching Theme ", error)
    }
  };


  const fetchSmartCollection = async () => {
    try {
      const response = await fetch("/api/get_SmartCollection", {
        method: "GET",
      });
      const data = await response.json();
      const SmartCollection = data.SmartCollection.data;

      if (SmartCollection.length > 0) {
        console.log("Smart Collection  ", SmartCollection);
        saveSmartCollection(SmartCollection);

      }
      console.log("Smart Collection  ", SmartCollection);
    }
    catch (error) {
      console.log("Error on fetching Theme ", error)
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spinner accessibilityLabel="Loading store data" size="large" />
          </div>
        ) : (
          <>
            <NavMenu>
              <Link to="/" rel="home" />
              <Link to="/createBucket" element={<CreateBucket />}>Set Backup Time</Link>
              <Link to="/Buckets" element={<Buckets />}>Check Backups</Link>
            </NavMenu>
            <Routes pages={pages} />
          </>
        )}
      </QueryProvider>
    </PolarisProvider>
  );
}
