import React, { useEffect, useState } from 'react';

function Product() {  // ✅ Use uppercase "Product"
    const [Products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchMeta();
    }, []);

    const fetchProducts = async () => {
        try {
            const resp = await fetch("/api/get_products", { method: 'GET' });
            const data = await resp.json();
            const Prod = data.Products.data;

            setProducts(Prod);

            if (Prod.length > 0) {
                console.log("Products ", Prod); // ✅ Log updated data
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
            console.log("Meta data", data);
        } catch (error) {
            console.log(error);
        }
    };

    const saveProducts = async (products) => {
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

    return <div>Product</div>;
}

export default Product; 
