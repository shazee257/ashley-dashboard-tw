import styles from 'styles/Product.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import {
    Button, Dialog, Grid, Paper, TextField,
    Typography, MenuItem, Checkbox, FormControlLabel, Modal
} from '@mui/material';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showNotification } from 'utils/helper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Products({ products }) {
    const [data, setData] = useState(products);


    const [open, setOpen] = useState(false);

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

    const categorySelectHandler = async (e) => {
        setProduct({ ...product, categoryId: e.target.value });
        // const attr = categories.filter(item => item._id === e.target.value)[0].attributes;
        // setAttributes(attr);
    }

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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


    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${id}`)
            .then(({ data }) => showNotification("", data.message, 'success'));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Product Title", width: 350,
            renderCell: (params) => {
                return (
                    <strong className={styles.productListTitle}>{params.value}</strong>

                );
            }

        },
        {
            field: "category_id.title", headerName: "Category", width: 220,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.category_id.image &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/categories/${params.row.category_id.image}`} />
                        </div>
                        {params.row.category_id.title}
                    </>
                );
            },
        },
        {
            field: "brand_id.title", headerName: "Brand", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.brand_id.image &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/brands/${params.row.brand_id.image}`} />
                        </div>
                        {params.row.brand_id.title}
                    </>
                );
            },
        },
        {
            field: "store_id.title", headerName: "Store", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.store_id.banner &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/${params.row.store_id.banner}`} />
                        </div>
                        {params.row.store_id.title}
                    </>
                );
            },
        },
        {
            field: "discount", headerName: "Discount", width: 90, type: "number",
            renderCell: (params) => {
                return (
                    <>
                        {params.value > 0 ? <div className="font-bold rounded px-5 w-30">
                            <div className="text-blue-700">{params.value}%</div>
                        </div> : null}
                    </>
                );
            }


        },
        {
            field: "is_featured", headerName: "Featured", width: 100,
            renderCell: (params) => {
                return (
                    <div className="bg-cyan-500 flex justify-center rounded w-20">
                        {params.value ? <span className="text-white">Featured</span> : null}
                    </div>
                );
            }

        },
        {
            field: "createdAt", headerName: "Created on", width: 100, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 240,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/${params.row._id}`}>
                            <button className={styles.productListEdit}>Product Variants</button>
                        </Link>
                        <Link href={"/products/update/" + params.row._id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className="flex-1">
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Products</h2>
                {/* <Link href="/products/create"> */}
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    color="primary" component="label"
                    className={styles.createNewLink}>Create New</Button>
                {/* </Link> */}
            </div>
            <MuiGrid data={data} columns={columns} />


            {/* MODAL FORM */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    width: '1100px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }} >
                    <Paper elevation={1} className="p-10 w-full">
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
                                                <div className="flex ">
                                                    <div className="flex items-center mr-2">
                                                        {category.image &&
                                                            <Image height={32} width={32}
                                                                className="rounded-full" layout="fixed"
                                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {category.title}
                                                    </div>
                                                    <DoubleArrowOutlinedIcon className="flex items-center mx-5 mt-1" />
                                                    <div className="flex items-center mr-2">
                                                        {category.image &&
                                                            <Image height={32} width={32} layout="fixed"
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
                </div>
                {/* </Dialog> */}
            </Modal>



        </div>
    );
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products`);
    return {
        props: {
            products: data.products,
        },
    };
}