import React, { useEffect, useState } from 'react';

function Product() {  // ✅ Use uppercase "Product"
    const [Products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchMeta();
    }, []);

   

    
    return <div>Product</div>;
}

export default Product; 
