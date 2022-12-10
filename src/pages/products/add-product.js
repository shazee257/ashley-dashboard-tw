import React, { useState } from 'react'
import ProductForm from 'components/Products/ProductForm.js';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Drawer, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import VariantForm from 'components/Products/VariantForm';
import FeatureForm from 'components/Products/FeatureForm';
import VariantGrid from 'components/Products/VariantGrid';

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
    const newVariant = {
        id: "",
        size: "",
        salePrice: 0,
        purchasePrice: 0,
        description: "",
        dimensions: "",
    }
    const newFeature = {
        id: "",
        color_id: "",
        quantity: "",
        sku: "",
        zero_stock_msg: "",
        images: [],
    };
    const [editMode, setEditMode] = useState(false);
    const [product, setProduct] = useState(newProduct);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);
    const [colors, setColors] = useState([]);
    const [addVariation, setAddVariation] = useState(false);
    const [variant, setVariant] = useState(newVariant);
    const [feature, setFeature] = useState(newFeature);
    const [images, setImages] = useState([]);
    const [imageArray, setImageArray] = useState([]);

    React.useEffect(() => {
        getCategories();
        getBrands();
        getStores();
        getColors();
    }, [])

    const getColors = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);
        setColors(data.colors);
    }
    const getStores = async (e) => {
        const storesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
        setStores(storesData.data.stores);
    }

    const getCategories = async (e) => {
        const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/fetch/categories`);
        setCategories(categoriesData.data.categories);
    }

    const getBrands = async (e) => {
        const brandsData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);
        setBrands(brandsData.data.brands);
    }

    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };

    // clear form fields
    const clearProdForm = () => {
        setProduct(newProduct)
    }
    // clear form fields
    const clearForm = () => {
        setVariant(newVariant);
    }

    return (
        <div className="grid grid-cols-12 gap-4 p-14 h-auto w-full">

            <ProductForm
                editMode={editMode}
                product={product}
                categories={categories}
                brands={brands}
                stores={stores}
                colors={colors}
                addVariation={addVariation}
                variant={variant}
                feature={feature}
                images={images}
                imageArray={imageArray}
                setCategories={setCategories}
                setBrands={setBrands}
                setStores={setStores}
                setColors={setColors}
                setAddVariation={setAddVariation}
                setVariant={setVariant}
                setFeature={setFeature}
                setImages={setImages}
                setImageArray={setImageArray}
                newProduct={newProduct}
                setProduct={setProduct}
                clearForm={clearProdForm}
            />

            {/* {addVariation &&
                <div className='col-span-12'>
                    <IconButton onClick={() => setAddVariation(false)}>
                        <ArrowBack />
                    </IconButton>
                    <FeatureForm
                        feature={feature}
                        setFeature={setFeature}
                        colors={colors}
                        images={images}
                        imageArray={imageArray}
                        editMode={editMode}
                        setImageArray={setImageArray}
                        setImages={setImages} />
                </div>
            } */}

            <div className='col-span-8 mt-8'>
                <VariantGrid
                    setAddVariation={setAddVariation} />
            </div>

            <Drawer
                anchor={'right'}
                open={addVariation}
                onClose={() => setAddVariation(false)}
                PaperProps={{
                    sx: {
                        width: '45%'
                    }
                }}
            >
                <VariantForm
                    variant={variant}
                    setVariant={setVariant}
                    editMode={editMode}
                    clearForm={clearForm}
                    setAddVariation={setAddVariation}
                />
            </Drawer>
        </div>
    )
}
