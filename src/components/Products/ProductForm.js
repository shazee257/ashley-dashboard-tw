import React, { useState } from 'react'
import styles from 'styles/Product.module.css';
import {
    Button, Grid, Paper, TextField,
    MenuItem, Checkbox, FormControlLabel, Modal, Popover, Typography, IconButton, InputLabel
} from '@mui/material';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Add, ArrowBack } from '@mui/icons-material';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import FeatureForm from './FeatureForm';
import VariantForm from './VariantForm';

export default function ProductForm({
    editMode,
    product,
    newProduct,
    setProduct,
    categories,
    brands,
    stores,
    colors,
    addVariation,
    variant,
    feature,
    images,
    imageArray,
    setCategories,
    setBrands,
    setStores,
    setColors,
    setAddVariation,
    setVariant,
    setFeature,
    setImages,
    setImageArray,
    clearForm,
    handleSubmit,
    productImages,
    setProductImages
}) {
    const router = useRouter();
    const [viewImage, setviewImage] = useState('');


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     debugger
    //     if (!product.title || !product.store_id || !product.category_id || !product.brand_id) {
    //         toast.warn("Please fill all fields");
    //         return;
    //     }

    //     const productData = {
    //         title: product.title,
    //         store_id: product.store_id,
    //         category_id: product.category_id,
    //         brand_id: product.brand_id,
    //         is_featured: product.is_featured,
    //         discount: product.discount
    //     }

    //     if (editMode) {
    //         await axios
    //             .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}`, productData)
    //             .then(({ data }) => {
    //                 if (data.success) {
    //                     toast.success(data.message);
    //                     clearForm();
    //                 }
    //             }).catch(err => toast.error(err.message));
    //     } else {
    //         await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
    //             .then(({ data }) => {
    //                 if (data.success) {
    //                     data.success && toast.success(data.message);
    //                     // handleClose();
    //                     router.push(`/products`);
    //                 }
    //             }).catch(err => toast.error(err.message));
    //     }
    // };

    React.useEffect(() => {
        if (editMode && productImages && viewImage === '') {
            let imageUrl = `${process.env.NEXT_PUBLIC_thumbURL}/products/${productImages[0]}`;
            setviewImage(imageUrl);
        }
    }, [editMode, productImages])


    const categorySelectHandler = async (e) => {
        setProduct({ ...product, category_id: e.target.value });
    }
    const addVariations = () => {
        console.log('here');
        setAddVariation(true)
    }

    const fileSelectHandler = (e) => {
        let imageUrl = URL.createObjectURL(e.target.files[0]);
        setviewImage(imageUrl);
        setProductImages(e.target.files);
    }

    return (
        <>
            <div className='col-span-12'>
                <div className='flex justify-between'>
                    <Typography variant='h5' color='primary'>{editMode ? ("Update Product").toUpperCase() : ("Add Product").toUpperCase()}</Typography>
                    {!editMode &&
                        <Button
                            onClick={(e) => handleSubmit(e)}
                            type='submit'
                            color='primary'
                            variant="outlined"
                            style={{ float: 'right' }}>
                            {editMode ? "Update Product" : "Add Product"}
                        </Button>
                    }
                </div>
            </div>
            <div className='col-span-8'>
                <Grid container>
                    <Grid item lg={12}>
                        <Paper elevation={4} className="p-10">
                            <Typography className='mb-4' variant='h6'>{("Product details").toUpperCase()}</Typography>

                            <form autoComplete="off" style={{ width: '100%' }}>
                                <div className='grid grid-cols-4 gap-6'>
                                    <div className="col-span-4 md:col-span-4">
                                        {viewImage &&
                                            <img alt="pc" height={150} width={150}
                                                className={`${styles.productListImg} m-auto`}
                                                src={viewImage} />
                                        }
                                    </div>
                                    <div className="col-span-4 md:col-span-4 text-center">
                                        <Button
                                            type='button'
                                            color='secondary'
                                            variant="outlined"
                                            size='small'
                                            className="m-auto"
                                        >
                                            <input
                                                style={{ background: 'rgb(108 148 168)' }}
                                                type="file"
                                                name="image"
                                                className={`${styles.productListEdit}`}
                                                onChange={(e) => fileSelectHandler(e)}
                                                accept="image/webp, image/*"
                                            />
                                        </Button>
                                    </div>
                                    <div className="col-span-4 md:col-span-4">
                                        <TextField
                                            multiline
                                            maxRows={4}
                                            size="small"
                                            fullWidth
                                            label='Product Title' placeholder='Enter Product Name'
                                            value={product.title}
                                            onChange={(e) => setProduct({ ...product, title: e.target.value })} />
                                        {/* <TextField
                                            className="w-6/12"
                                            fullWidth
                                            size="small"
                                            label="Select Category"
                                            select
                                            value={product.category_id} onChange={categorySelectHandler}>

                                           
                                        </TextField> */}
                                    </div>
                                    <div className="col-span-4 md:col-span-2">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Select Brand"
                                            select
                                            value={product.brand_id}
                                            onChange={(e) => setProduct({ ...product, brand_id: e.target.value })}>
                                            {brands.map((brand) => (
                                                <MenuItem value={brand._id} key={brand._id}>
                                                    <div className="flex">
                                                        <div className={styles.productListItem}>
                                                            {brand.image &&
                                                                <Image alt="pc" height={32} width={32}
                                                                    className={styles.productListImg}
                                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${brand.image}`} />}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {brand.title}
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-span-4 md:col-span-2">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Select Warehouse / Store"
                                            select
                                            value={product.store_id}
                                            onChange={(e) => setProduct({ ...product, store_id: e.target.value })}>
                                            {stores.map((store) => (
                                                <MenuItem value={store._id} key={store._id}>
                                                    <div className="flex items-center">
                                                        <div className={styles.productListItem}>
                                                            <Image alt="" height={32} width={32}
                                                                className={styles.productListImg}
                                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/stores/${store.banner}`} />
                                                        </div>
                                                        <div className={styles.productListItem}>
                                                            {store.title}
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-span-4 md:col-span-2">
                                        <TextField
                                            className='w-full'
                                            size="small"
                                            inputProps={{ min: 0, max: 100, type: 'number' }}
                                            label='Discount %' placeholder='Enter Discount %'
                                            value={product.discount}
                                            onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-4 md:col-span-2">
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={product.is_featured}
                                                    onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
                                                    size="small"
                                                />
                                            }
                                            label="Featured Product"
                                        />
                                    </div>
                                    <div className="col-span-4 md:col-span-1">
                                        <Button
                                            onClick={() => clearForm()}
                                            type='button'
                                            color='secondary'
                                            variant="outlined"
                                            fullWidth>
                                            Reset Form
                                        </Button>
                                    </div>
                                    <div className="col-span-4 md:col-span-1">
                                        {editMode &&
                                            <Button
                                                onClick={(e) => handleSubmit(e)}
                                                type='submit'
                                                color='primary'
                                                variant="outlined"
                                                style={{ float: 'right' }}>
                                                {editMode ? "Update Product" : "Add Product"}
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </form>
                            <br /><br />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <div className='col-span-4 shadow-lg rounded-lg max-h-[370px] overflow-x-auto'>
                <Paper elevation={4} className='px-4 py-2'>
                    <Typography variant='body1'>Select Category</Typography>

                    {categories.map((category) => (
                        category.children.map((child) => (
                            <Typography key={child._id} value={child._id}
                                className={product.category_id === child._id ? 'bg-indigo-100 my-2 cursor-pointer hover:bg-slate-100 p-2' : 'my-2 cursor-pointer hover:bg-slate-100 p-2'}
                                onClick={() => setProduct({ ...product, category_id: child._id })}>
                                <div className="flex ">
                                    <div className="flex items-center mr-2">
                                        {category.image &&
                                            <Image alt="pic" height={32} width={32}
                                                className="rounded-full" layout="fixed"
                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />}
                                    </div>
                                    <div className="flex items-center">
                                        {category.title}
                                    </div>
                                    <DoubleArrowOutlinedIcon className="flex items-center mx-5 mt-1" />
                                    <div className="flex items-center mr-2">
                                        {category.image &&
                                            <Image alt="ppic" height={32} width={32} layout="fixed"
                                                className="rounded-full"
                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${child.image}`} />}
                                    </div>
                                    <div className="flex items-center">
                                        {child.title}
                                    </div>
                                </div>
                            </Typography>
                        ))
                    ))}
                </Paper>
            </div>
        </>
    )
}
