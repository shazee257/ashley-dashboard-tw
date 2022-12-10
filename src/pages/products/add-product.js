import React, { useState } from 'react'
import ProductForm from 'components/Products/ProductForm.js';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
    const newProduct = {
        id: "",
        title: "",
        store_id: "",
        category_id: "",
        brand_id: "",
        is_featured: false,
        discount: 0
    }
    const [editMode, setEditMode] = useState(false);
    const [product, setProduct] = useState(newProduct);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);

    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };

    return (
        <>
            <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-3/4 h-auto rounded-lg shadow-lg">
                <ProductForm
                    editMode={editMode}
                    product={product}
                    categories={categories}
                    brands={brands}
                    stores={stores}
                    newProduct={newProduct}
                    setProduct={setProduct}
                />
            </div>
        </>
    )
}
