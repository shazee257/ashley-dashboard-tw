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
import { useRouter } from 'next/router';

export default function AddProduct() {

    const router = useRouter();
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
        sale_price: 0,
        purchase_price: 0,
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
    const [productImages, setProductImages] = useState();
    const [imageArray, setImageArray] = useState([]);
    const [filesToUpload, setFilesToUpload] = useState([]);

    console.log("variant", variant);
    // console.log("feature", feature);
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    React.useEffect(() => {
        let edit = getParameterByName('edit');
        if (edit) {
            setEditMode(true);
            getProduct();
        }
        getCategories();
        getBrands();
        getStores();
        getColors();
    }, [])

    const getProduct = async () => {
        let id = getParameterByName('id')
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${id}`);
        let res = data.product;
        setProduct({
            id: res._id,
            title: res.title,
            store_id: res.store_id._id,
            category_id: res.category_id._id,
            brand_id: res.brand_id._id,
            is_featured: res.is_featured,
            discount: res.discount
        });
        setProductImages([res.thumbnail_image]);
        setVariation(res.variants.map(elem => ({
            ...elem,
            id: elem._id
        })));
        let array = []
        let fature = res.variants.map((elem) => {
            array.push(...elem.features)
        })
        setFeatures(array.map(elem => ({
            ...elem,
            id: elem._id
        })))

    }
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
        setProduct(newProduct);
    }
    // clear form fields
    const clearVairantForm = () => {
        setVariant(newVariant);
    }
    // clear form fields
    const clearFeatureForm = () => {
        setFeature(newFeature);
    }
    const uploadHandler = async (id) => {

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        const fd = new FormData();
        for (let i = 0; i < productImages.length; i++) {
            fd.append("files", productImages[i]);
        }

        await axios
            .put(`${process.env.NEXT_PUBLIC_baseURL}/products/upload-thumbnail/${id}/a/b`, fd, config)
            .then(({ data }) => {
                if (data.success) {
                    toast.success(data.message);
                    setFilesToUpload([]);
                }
            }).catch(err => toast.error(err.message));
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
            discount: product.discount,
            variants: variation

        }
        const editProductData = {
            title: product.title,
            store_id: product.store_id,
            category_id: product.category_id,
            brand_id: product.brand_id,
            is_featured: product.is_featured,
            discount: product.discount,

        }

        const variantData = {
            size: variant.size,
            sale_price: variant.sale_price,
            purchase_price: variant.purchase_price,
            description: variant.description,
            dimensions: variant.dimensions,
        }
        if (editMode) {
            if (productImages) {
                uploadHandler(product.id)
            }
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}`, editProductData)
                .then(async ({ data }) => {
                    if (data.success) {
                        toast.success(data.message);
                        // clearForm();
                    }
                }).catch(err => toast.error(err.message));
        } else {
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
                .then(async ({ data }) => {
                    debugger
                    if (data.success) {
                        if (productImages) {
                            uploadHandler(data.product._id)
                        }
                        data.success && toast.success(data.message);
                        router.push('/products')

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
                productImages={productImages}
                setProductImages={setProductImages}
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
                    product={product}
                    clearVairantForm={clearVairantForm}
                />
            </div>
            <div className='col-span-12 mt-8'>
                <VariantGrid
                    setAddVariation={setAddVariation}
                    variation={variation}
                    setVariant={setVariant}
                    setVariation={setVariation}
                    variant={variant}
                    clearVairantForm={clearVairantForm}

                />
            </div>
            <div className='col-span-12'>
                <FeatureForm
                    variation={variation}
                    setVariation={setVariation}
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
                    product={product}
                    setFilesToUpload={setFilesToUpload}
                    filesToUpload={filesToUpload}
                    variant={variant}
                    clearFeatureForm={clearFeatureForm}

                />
            </div>
            <div className='col-span-12'>
                <FeatureGrid
                    variationArray={variation}
                    setFeatures={setFeatures}
                    editMode={editMode}
                    features={features}
                    feature={feature}
                    colors={colors}
                    setFeature={setFeature}
                    product={product}
                    variant={variant}
                    filesToUpload={filesToUpload}
                    setFilesToUpload={setFilesToUpload}
                    clearFeatureForm={clearFeatureForm}
                    getProduct={getProduct}
                />
            </div>
        </div>
    )
}
