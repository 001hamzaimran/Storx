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


export default function Index() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [loadingData, setloadingData] = useState(false)
  const storeDetail = useSelector((state) => state.store.StoreDetail);


  const navigate = useNavigate();


  // const checkingBucket = async () => {
  //   try {
  //     const response = await fetch(`/api/checkingBucket?storeId=${storeDetail.StoreId}`,
  //       { method: 'GET' }
  //     )
  //     const data = await response.json()
  //     console.log("Bucket", data);
  //   } catch (error) {
  //     console.log("Errore ", error)
  //   }
  // }





  const handleAccessKeyChange = useCallback((value) => setAccessKey(value), []);
  const handleSecretKeyChange = useCallback((value) => setSecretKey(value), []);
  const handleEndpointChange = useCallback((value) => setEndpoint(value), []);

  const handleSubmit = async () => {
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
      toast.success(data.message + " Redirecting ..", { duration: 3000 });
      setTimeout(() => {
        navigate('/createBucket');
      }, 3000);
    } catch (error) {
      toast.error("Failed to set credentials. Please try again.");
      console.log(error)
    } finally {
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

  // const getCredential = async () => {
  //   setloadingData(true)
  //   try {
  //     if (!storeDetail?.StoreId) {
  //       console.log("Store ID is missing!");
  //       return;
  //     }
  //     const response = await fetch(`/api/get_credential?storeId=${storeDetail.StoreId}`, {
  //       method: 'GET',
  //     })

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const text = await response.text(); // Read raw response first
  //     if (!text) {
  //       throw new Error("Empty response body");
  //     }

  //     const data = JSON.parse(text); // Parse JSON manually
  //     console.log("Get Credentials ", data);

  //     // const data = await response.json();
  //     // console.log("Get Credentials ", data)



  //   } catch (err) {
  //     console.log(err)
  //   } finally {
  //     setloadingData(false)
  //   }
  // }

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
          <Button primary onClick={handleSubmit} disabled={loadingData}>Submit</Button>
        </div>
      </Card>
    </Page>
  );
}