import styles from "styles/ProductNew.module.css";
import { useState, useEffect } from "react";
import {
    Grid, Paper, TextField, Button,
    Typography, MenuItem, Checkbox, FormControlLabel
} from '@mui/material'
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NewProduct() {
    const { push } = useRouter();

    useEffect(() => {
        getStores();
        getCategories();
        getBrands();
    }, []);


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

    const newProduct = {
        title: "",
        storeId: "",
        categoryId: "",
        brandId: "",
        isFeatured: false,
        discount: 0
    }

    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [product, setProduct] = useState(newProduct);

    // clear form fields
    const clearForm = () => {
        setProduct(newProduct);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.title || !product.storeId || !product.categoryId || !product.brandId) {
            showNotification("warn", "Please fill all fields");
            return;
        }

        const productData = {
            title: product.title,
            store_id: product.storeId,
            category_id: product.categoryId,
            brand_id: product.brandId,
            is_featured: product.isFeatured,
            discount: product.discount
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
                .then(({ data }) => {
                    if (data.success) {
                        data.success && showNotification("success", data.message);
                        push(`/products/${data.product._id}`);
                        // clearForm();
                    }
                })
                .catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            showNotification(message);
        }
    };

    const categorySelectHandler = async (e) => {
        setProduct({ ...product, categoryId: e.target.value });
        // const attr = categories.filter(item => item._id === e.target.value)[0].attributes;
        // setAttributes(attr);
    }

    return (
        <div className="flex p-5 w-full">
            <Paper elevation={1} className="p-10 w-6/12 h-6/6">
                <Grid align='left'>
                    <h2>New Product</h2>
                </Grid>
                <br />
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
                            value={product.categoryId} onChange={categorySelectHandler}>

                            {categories.map((category) => (
                                category.children.map((child) => (
                                    <MenuItem key={child._id} value={child._id}>
                                        <div className={styles.ImageWithTitle}>
                                            <div className="flex items-center mr-2">
                                                {category.image &&
                                                    <Image height={32} width={32}
                                                        className={styles.productListImg}
                                                        src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />}
                                            </div>
                                            <div className="flex items-center">
                                                {category.title}
                                            </div>
                                            <DoubleArrowOutlinedIcon className="flex items-center mx-5 mt-1" />
                                            <div className="flex items-center mr-2">
                                                {category.image &&
                                                    <Image height={32} width={32}
                                                        className={styles.productListImg}
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
                            value={product.brandId}
                            onChange={(e) => setProduct({ ...product, brandId: e.target.value })}>
                            {brands.map((brand) => (
                                <MenuItem value={brand._id} key={brand._id}>
                                    <div className={styles.ImageWithTitle}>
                                        <div className={styles.productListItem}>
                                            {brand.image &&
                                                <Image height={32} width={32}
                                                    className={styles.productListImg}
                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${brand.image}`} />}
                                        </div>
                                        <div className={styles.productListItem}>
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
                            value={product.storeId}
                            onChange={(e) => setProduct({ ...product, storeId: e.target.value })}>
                            {stores.map((store) => (
                                <MenuItem value={store._id} key={store._id}>
                                    <div className={styles.ImageWithTitle}>
                                        <div className={styles.productListItem}>
                                            <Image height={32} width={32}
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
                    {/* {attributes.length > 0 &&
                            <div>
                                <TextField
                                    fullWidth aria-disabled="true"
                                    className={styles.addProductItem}
                                    label='Product Variants' placeholder='Product Variants'
                                    value={attributes}
                                />
                                <br /><br />
                            </div>} */}

                    <br />
                    <div className="flex justify-between">
                        <FormControlLabel
                            className="w-5/12"
                            control={<Checkbox checked={product.isFeatured}
                                onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                                size="small" />}
                            label="Featured Product" />

                        <TextField
                            className="w-6/12"
                            size="small"
                            inputProps={{ min: 0, max: 100, type: 'number' }}
                            label='Discount' placeholder='Enter Discount'
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
                        Create Product
                    </Button>
                    <br /><br />
                    <Button
                        onClick={clearForm}
                        type='button'
                        color='secondary'
                        variant="outlined"
                        fullWidth>
                        Reset Form
                    </Button>
                </form>
                <br /><br />
                <Typography >
                    <Link href="/products">Back to Products</Link>
                </Typography>
            </Paper>
        </div >
    );
}
