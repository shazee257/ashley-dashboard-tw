import styles from 'styles/Product.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import {
    Button, Grid, Paper, TextField,
    MenuItem, Checkbox, FormControlLabel, Modal
} from '@mui/material';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateNewIcon from 'components/CreateNewIcon';
import { useRouter } from 'next/router';

export default function Products({ products }) {
    const [data, setData] = useState([...products]);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        getStores();
        getCategories();
        getBrands();
    }, []);

    const editHandler = (id) => {
        setEditMode(true);
        setOpen(true);
        const product = data.find((p) => p._id === id);
        const newProduct = {
            id: product._id,
            title: product.title,
            store_id: product.store_id._id,
            category_id: product.category_id._id,
            brand_id: product.brand_id._id,
            is_featured: product.is_featured,
            discount: product.discount,
        }
        setProduct(newProduct);
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

    const newProduct = {
        id: "",
        title: "",
        store_id: "",
        category_id: "",
        brand_id: "",
        is_featured: false,
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
        setProduct({ ...product, category_id: e.target.value });
        // const attr = categories.filter(item => item._id === e.target.value)[0].attributes;
        // setAttributes(attr);
    }

    const handleClickOpen = () => router.push(`/products/add-product`);
    
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };

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

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "title", headerName: "Product Title", width: 350 },
        {
            field: "category_id.title", headerName: "Category", width: 220,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            {params.row.category_id.image &&
                                <Image alt="pic" height={32} width={32} className={styles.productListImg}
                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${params.row.category_id.image}`} />
                            }
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
                            {params.row.brand_id.image &&
                                <Image alt="pic" height={32} width={32} className={styles.productListImg}
                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${params.row.brand_id.image}`} />
                            }
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
                            <Image alt="" height={32} width={32} className={styles.productListImg}
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
            width: 260,
            renderCell: (params) => {
                return (
                    <div className="flex justify-center items-center">
                        {/* <Link href={`/products/${params.row._id}`}>
                            <button
                                className="h-8 w-32 rounded-md mr-5 bg-blue-700 text-white">Size Variants</button>
                        </Link> */}
                        <button className="h-8 w-16 rounded-md mr-5 bg-green-600 text-white" onClick={() => router.push(`/products/add-product?edit=${true}&id=${params.row._id}`)}>Edit</button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex-1">
            <div className="flex justify-between items-center ml-5 mr-5">
                <h2>Products</h2>
                <CreateNewIcon handleClick={handleClickOpen} />
            </div>
            <MuiGrid data={data} columns={columns} />


            {/* MODAL FORM */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-3/4 h-auto rounded-lg shadow-lg">
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
                                <Button
                                    className="w-6/12"
                                    size="small"
                                    onClick={handleClose}
                                    type='button'
                                    color='success'
                                    variant="outlined"
                                    fullWidth>
                                    Close Form
                                </Button>
                            </div>
                        </form>
                        <br /><br />
                    </Paper>
                </div >
            </Modal>
        </div >
    );
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products`);
    const products = data.products.map(product => {
        product.id = product._id;
        return product;
    });
    return {
        props: {
            products
        },
    };
}