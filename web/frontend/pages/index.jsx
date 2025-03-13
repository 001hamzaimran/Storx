import React, { useState, useCallback, useEffect } from 'react';
import { Card, TextField, Page, Button } from '@shopify/polaris';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


export const saveProducts = async (products) => {
  try {
    const response = await fetch("/api/save_products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Product: products }),
    });

    const text = await response.text(); // Read as text first
    console.log("Raw response:", text);

    const result = JSON.parse(text); // Now parse as JSON
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveCustomer = async (customerss) => {
  try {
    const response = await fetch("/api/save_customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Customer: customerss }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveMeta = async (Metas) => {
  try {
    const response = await fetch("/api/save_Meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Meta: Metas }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveBlog = async (Blogs) => {
  try {
    const response = await fetch("/api/save_Blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Blog: Blogs }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveTheme = async (Themes) => {
  try {
    const response = await fetch("/api/save_Theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Theme: Themes }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const savePages = async (Pages) => {
  try {
    const response = await fetch("/api/save_Pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Page: Pages }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveSmartCollection = async (SmartCollections) => {
  try {
    const response = await fetch("/api/save_SmartCollection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ SmartCollection: SmartCollections }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
};

export const saveCustomCollection = async (CustomCollections) => {
  try {
    const response = await fetch("/api/save_CustomCollection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ CustomCollection: CustomCollections }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving products:", error);
  }
}

export const saveOrders = async(Orders) =>{
  try {
    const response = await fetch("/api/save_Orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Orders: Orders }),
    });
    const result = await response.json();
    console.log("Save Response:", result);
  } catch (error) {
    console.log("Error saving Orders:", error);
  }
}


export default function Index() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [loadingData, setloadingData] = useState(false)
  const storeDetail = useSelector((state) => state.store.StoreDetail);


  const navigate = useNavigate();

  const handleAccessKeyChange = useCallback((value) => setAccessKey(value), []);
  const handleSecretKeyChange = useCallback((value) => setSecretKey(value), []);
  const handleEndpointChange = useCallback((value) => setEndpoint(value), []);

  const handleSubmit = async () => {
    setloadingData(true)
    try {
      const response = await fetch("/api/set_credentials", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Storx_Acces_Key: accessKey,
          Storx_Secret_Key: secretKey,
          Storx_Endpoint: endpoint,
          Store_name: storeDetail.Store_name,
          StoreId: storeDetail.StoreId,
          Store_domain: storeDetail.Store_domain,
        })
      })

      const data = await response.json();
      console.log("Set Credentials ", data)
      if (data.success) {
        toast.success(data.message + " Redirecting ..", { duration: 3000 });
        setTimeout(() => {
          navigate('/createBucket');
        }, 3000);
      } else {
        toast.error(data.message, { duration: 3000 });
      }


    } catch (error) {
      toast.error("Failed to set credentials. Please try again.");
      console.log(error)
    } finally {
      setloadingData(false)
      setAccessKey('');
      setSecretKey('');
      setEndpoint('');
    }
  };


  useEffect(() => {
    if (storeDetail) {
      setAccessKey(storeDetail.Storx_Acces_Key || '');
      setSecretKey(storeDetail.Storx_Secret_Key || '');
      setEndpoint(storeDetail.Storx_Endpoint || '');
    }
  }, [storeDetail]);

  return (
    <Page title="Storx Configuration">
      <Card sectioned>
        <TextField
          label="Storx Access Key"
          value={accessKey}
          onChange={handleAccessKeyChange}
          autoComplete="off"
          type="password"
        />
        <TextField
          label="Storx Secret Key"
          value={secretKey}
          onChange={handleSecretKeyChange}
          autoComplete="off"
          type="password"
        />
        <TextField
          label="Storx Endpoint"
          value={endpoint}
          onChange={handleEndpointChange}
          autoComplete="off"
        />
        <div style={{ marginTop: '1rem' }}>
          <Button primary onClick={handleSubmit} loading={loadingData} disabled={loadingData}>Submit</Button>
        </div>
      </Card>
    </Page>
  );
}