import React from 'react'
import styles from 'styles/Product.module.css';
import {
    Button, Grid, Paper, TextField,
    MenuItem, Checkbox, FormControlLabel, Modal
} from '@mui/material';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import { formatDate } from "utils/utils";
import Image from 'next/image';

export default function ProductForm({
    editMode,
    product,
    categories,
    brands,
    stores,
    newProduct,
    setProduct
}) {
    const clearForm = () => {
        setProduct(newProduct);
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

        if (editMode) {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}`, productData)
                .then(({ data }) => {
                    if (data.success) {
                        toast.success(data.message);
                        clearForm();
                    }
                }).catch(err => toast.error(err.message));
        } else {
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
                .then(({ data }) => {
                    if (data.success) {
                        data.success && toast.success(data.message);
                        handleClose();
                        router.push(`/products/${data.product._id}`);
                    }
                }).catch(err => toast.error(err.message));
        }

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products`);
        setData(data.products.map(elem => ({
            ...elem,
            id: elem._id
        })));
        handleClose();
    };

    const categorySelectHandler = async (e) => {
        setProduct({ ...product, category_id: e.target.value });
    }

    return (
        <Paper elevation={1} className="p-10 w-full">
            <Grid align='left'>
                <h2>{editMode ? ("Update Product").toUpperCase() : ("New Product").toUpperCase()}</h2>
            </Grid>
            <br /><br />
            <form autoComplete="off">
                <div className="flex justify-between">
                    <TextField className="w-5/12"
                        multiline
                        maxRows={4}
                        size="small"
                        fullWidth
                        label='Product Title' placeholder='Enter Product Name'
                        value={product.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })} />
                    <TextField
                        className="w-6/12"
                        fullWidth
                        size="small"
                        label="Select Category"
                        select
                        value={product.category_id} onChange={categorySelectHandler}>

                        {categories.map((category) => (
                            category.children.map((child) => (
                                <MenuItem key={child._id} value={child._id}>
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
                                </MenuItem>
                            ))
                        ))}
                    </TextField>
                </div>
                <br />
                <div className="flex justify-between">
                    <TextField
                        className="w-5/12"
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
                    <TextField
                        className="w-6/12"
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
                <br />
                <div className="flex justify-between">
                    <FormControlLabel
                        className="w-5/12"
                        control={<Checkbox checked={product.is_featured}
                            onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
                            size="small" />}
                        label="Featured Product" />

                    <TextField
                        className="w-6/12"
                        size="small"
                        inputProps={{ min: 0, max: 100, type: 'number' }}
                        label='Discount %' placeholder='Enter Discount %'
                        value={product.discount}
                        onChange={(e) => setProduct({ ...product, discount: e.target.value })} />
                </div>
                <br /><br />
                <Button
                    onClick={handleSubmit}
                    type='submit'
                    color='primary'
                    variant="outlined"
                    fullWidth>
                    {editMode ? "Update Product" : "Add Product"}
                </Button>
                <br /><br />
                <div className="flex justify-between">
                    <Button
                        className="w-6/12"
                        onClick={clearForm}
                        type='button'
                        color='secondary'
                        variant="outlined"
                        fullWidth>
                        Reset Form
                    </Button>
                </div>
            </form>
            <br /><br />
        </Paper>
    )
}
