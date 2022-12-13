import React, { useState } from 'react'
import ProductForm from 'components/Products/ProductForm.js';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Drawer, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import VariantForm from 'components/Products/VariantForm';
import FeatureForm from 'components/Products/FeatureForm';
import VariantGrid from 'components/Products/VariantGrid';
import FeatureGrid from 'components/Products/FeatureGrid';
import { toast } from 'react-toastify';
import { showNotification } from 'utils/helper';

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
        edit: false
    }
    const newFeature = {
        variant: "",
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
    const [variation, setVariation] = useState([]);
    const [features, setFeatures] = useState([]);
    const [addVariation, setAddVariation] = useState(false);
    const [variant, setVariant] = useState(newVariant);
    const [feature, setFeature] = useState(newFeature);
    const [images, setImages] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    console.log(variant);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.title || !product.store_id || !product.category_id || !product.brand_id) {
            toast.warn("Please fill all fields");
            return;
        }

        const productData = {
            title: product.title,
            store_id: product.store_id,
            category_id: product.category_id,
            brand_id: product.brand_id,
            is_featured: product.is_featured,
            discount: product.discount
        }

        const variantData = {
            size: variant.size,
            sale_price: variant.salePrice,
            purchase_price: variant.purchasePrice,
            description: variant.description,
            dimensions: variant.dimensions,
        }

        if (editMode) {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}`, productData)
                .then(async ({ data }) => {
                    if (data.success) {
                        toast.success(data.message);
                        // clearForm();
                        if (editMode) {
                            await axios
                                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${data._id}/${variant.id}`, variantData)
                                .then(({ data }) => {
                                    if (data.success) {
                                        showNotification("success", data.message);
                                    }
                                }).catch(err => showNotification("error", err.response.data.message));
                        } else {
                            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products/${data._id}`, variantData)
                                .then(({ data }) => {
                                    if (data.success) {
                                        data.success && showNotification("success", data.message);
                                    }
                                }).catch(err => showNotification("error", err.response.data.message));
                        }

                    }
                }).catch(err => toast.error(err.message));
        } else {
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
                .then(async ({ data }) => {
                    if (data.success) {
                        // data.success && toast.success(data.message);
                        if (editMode) {
                            await axios
                                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${data._id}/${variant.id}`, variantData)
                                .then(({ data }) => {
                                    if (data.success) {
                                        showNotification("success", data.message);
                                    }
                                }).catch(err => showNotification("error", err.response.data.message));
                        } else {
                            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products/${data.product._id}`, variantData)
                                .then(({ data }) => {
                                    if (data.success) {
                                        data.success && showNotification("success", data.message);
                                    }
                                }).catch(err => showNotification("error", err.response.data.message));
                        }
                    }
                }).catch(err => toast.error(err.message));
        }
    };


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
                handleSubmit={handleSubmit}
            />

            <div className='col-span-12'>
                <VariantForm
                    productId={product.category_id}
                    setVariation={setVariation}
                    variation={variation}
                    variant={variant}
                    setVariant={setVariant}
                    editMode={editMode}
                    setAddVariation={setAddVariation}
                />
            </div>
            <div className='col-span-12 mt-8'>
                <VariantGrid
                    setAddVariation={setAddVariation}
                    variation={variation}
                    setVariant={setVariant}
                    setVariation={setVariation}
                />
            </div>
            <div className='col-span-12'>
                <FeatureForm
                    variation={variation}
                    feature={feature}
                    setFeature={setFeature}
                    colors={colors}
                    images={images}
                    imageArray={imageArray}
                    editMode={editMode}
                    setImageArray={setImageArray}
                    setImages={setImages}
                    setFeatures={setFeatures}
                    features={features}
                />
            </div>
            <div className='col-span-12'>
                <FeatureGrid
                    setFeatures={setFeatures}
                    features={features}
                    feature={feature}
                    colors={colors}
                    setFeature={setFeature}
                />
            </div>
        </div>
    )
}
