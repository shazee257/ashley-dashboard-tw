import styles from 'styles/ProductIndex.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import {
    Button, Grid, Paper, TextField,
    InputLabel, Modal
} from '@mui/material';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState } from 'react';
import Link from 'next/link';
import { showNotification } from 'utils/helper';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Variations({ product }) {
    const [data, setData] = useState(product.variants);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${id}`)
            .then(({ data }) => showNotification('success', data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "size", headerName: "Product Sizes", width: 200 },
        {
            field: "sale_price", headerName: "Sale Price", width: 180, type: "number",
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${params.value.toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", width: 180, type: "number",
            valueFormatter: (params) => `$${params.value.toFixed(2)}`
        },
        // { field: "description", headerName: "Description", width: 220 },
        // { field: "dimensions", headerName: "Dimensions", width: 220 },
        {
            field: "createdAt", headerName: "Added on", width: 140, type: 'dateTime', hide: true,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 240,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/${product._id}/${params.row._id}?size=${params.row.size}`}>
                            <button className={styles.productListEdit}>Product Features</button>
                        </Link>
                        <button className={styles.productListEdit} onClick={() => editButtonHandler(params.row.id)}>Edit</button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    const newVariant = {
        id: "",
        size: "",
        salePrice: 0,
        purchasePrice: 0,
        description: "",
        dimensions: "",
    }

    const [variant, setVariant] = useState(newVariant);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };
    // clear form fields
    const clearForm = () => {
        setVariant(newVariant);
    }

    const editButtonHandler = (id) => {
        setEditMode(true);
        setOpen(true);
        const variant = data.find((item) => item._id === id);

        const newVariant = {
            id: variant._id,
            size: variant.size,
            salePrice: variant.sale_price,
            purchasePrice: variant.purchase_price,
            description: variant.description,
            dimensions: variant.dimensions,
        };
        setVariant(newVariant);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const variantData = {
            size: variant.size,
            sale_price: variant.salePrice,
            purchase_price: variant.purchasePrice,
            description: variant.description,
            dimensions: variant.dimensions,
        }

        // return console.log(product._id, variant.id, variantData);

        if (editMode) {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${variant.id}`, variantData)
                .then(({ data }) => {
                    if (data.success) {
                        showNotification("success", data.message);
                        clearForm();
                    }
                }).catch(err => showNotification("error", err.response.data.message));
        } else {
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}`, variantData)
                .then(({ data }) => {
                    if (data.success) {
                        data.success && showNotification("success", data.message);
                        clearForm();
                    }
                }).catch(err => showNotification("error", err.response.data.message));
        }
        getVariants(product._id);
        handleClose();
    }

    const getVariants = async (productId) => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
        if (data.product.is_sizes_with_colors) {
            data.product.variants = data.product.variants.map((v) => {
                v.id = v._id;
                return v;
            })
            setData(data.product.variants);
        }
    }


    return (
        <div className={styles.productList}>
            <div className="ml-8">
                <h2 className="">Add Sizes Variantion</h2>
                <br />
                <div className="flex mr-5 mb-5 items-center justify-between">
                    <div className='hover:underline'>

                        <Link href={`/products/${product._id}`}>
                            <p>Product {`: `}<b>{product.title}</b></p>
                        </Link>

                    </div>
                    {/* <Link href={`/products/${product._id}/create`}> */}
                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        color="primary" component="label"
                        className="{styles.createNewLink}">Create New</Button>
                    {/* </Link> */}

                </div>
            </div>
            <MuiGrid columns={columns} data={data} />

            {/* MODAL FORM */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-3/4 h-4/4 rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Size Variant").toUpperCase() : ("Add New Size Variant").toUpperCase()}</h2>
                        </Grid>
                        <br />
                        <form autoComplete="off">
                            <div className="flex justify-between">
                                <TextField
                                    required
                                    className="w-1/2 pr-5"
                                    size="small"
                                    label='Product Size' placeholder='Enter Product Size' variant='outlined'
                                    value={variant.size} onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                                />
                                <br /><br />
                                <div className="flex w-1/2">
                                    <TextField
                                        className="mx-5 w-1/2"
                                        size="small" required
                                        inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                        variant='outlined'
                                        label='Sale Price' placeholder='Enter Sale Price'
                                        value={variant.salePrice} onChange={(e) => setVariant({ ...variant, salePrice: e.target.value })}
                                    />
                                    <br /><br />
                                    <TextField
                                        className="w-1/2"
                                        size="small"
                                        inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                        variant='outlined' type='number'
                                        label='Purchase Price' placeholder='Enter Purchase Price'
                                        value={variant.purchasePrice} onChange={(e) => setVariant({ ...variant, purchasePrice: e.target.value })}
                                    />
                                </div>


                                {/* <TextField className="w-5/12"
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
                                </TextField> */}
                            </div>
                            <br />
                            <div className="flex justify-between">
                                <div className="pr-5">
                                    <InputLabel htmlFor="description">Description</InputLabel>
                                    <ReactQuill value={variant.description} onChange={(e) => setVariant({ ...variant, description: e })} />
                                </div>
                                <div className="">
                                    <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                                    <ReactQuill value={variant.dimensions} onChange={(e) => setVariant({ ...variant, dimensions: e })} />
                                </div>
                            </div>
                            <br />
                            <Button
                                onClick={handleSubmit}
                                type='submit'
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                {editMode ? "Update Size Variant" : "Add Size Variant"}
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
                    </Paper>
                </div>
            </Modal>

        </div>
    );
}

export async function getServerSideProps(context) {
    const { productId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    if (data.product.is_sizes_with_colors) {
        data.product.variants = data.product.variants.map((v) => {
            v.id = v._id;
            return v;
        })
    }

    return {
        props: {
            product: data.product
        },
    };
}