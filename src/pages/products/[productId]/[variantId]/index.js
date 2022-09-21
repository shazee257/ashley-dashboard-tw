import styles from 'styles/ProductFeatures.module.css';
import axios from 'axios';
import {
    DeleteOutline,
    CloudUploadOutlined,
} from "@mui/icons-material";
import {
    Button, Grid, Paper, TextField,
    MenuItem, Typography, Modal, InputLabel
} from '@mui/material';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import CreateNewIcon from 'components/CreateNewIcon';

export default function Features({ productId, variantId, productTitle, features, size }) {
    const [data, setData] = useState(features);
    const [image, setImage] = useState();
    const [filesToUpload, setFilesToUpload] = useState([]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const uploadHandler = async (id) => {
        // if files not selected
        if (filesToUpload.length === 0) {
            toast.warn("Please select files to upload");
            return;
        }

        const fd = new FormData();
        for (let i = 0; i < filesToUpload.length; i++) {
            fd.append("files", filesToUpload[i]);
        }

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        await axios
            .put(`${process.env.NEXT_PUBLIC_baseURL}/products/upload/${productId}/${variantId}/${id}`, fd, config)
            .then(({ data }) => {
                if (data.success) {
                    toast.success(data.message);
                    setFilesToUpload([]);
                }
            }).catch(err => toast.error(err.message));

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
        const features = data.product.variants.find((item) => item._id === variantId).features.map((v) => {
            v.id = v._id;
            return v;
        });
        setData(features);
    }


    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "color_id.title", headerName: "Color", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={26} width={26}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${params.row.color_id.image}`} />
                        </div>
                        {params.row.color_id.title}
                    </>
                )
            }
        },
        {
            field: "images", headerName: "Feature Images", width: 220,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.images.map((item, index) => {
                            return (
                                <div key={index} className={styles.productListItem}>
                                    <Image alt="" height={26} width={26}
                                        className={styles.productListImg}
                                        src={`${process.env.NEXT_PUBLIC_thumbURL}/products/${item}`}
                                        onClick={() => setImage(item)} />
                                </div>
                            )
                        })}
                    </>
                )
            }


        },
        { field: "quantity", headerName: "Quantity", width: 100 },
        { field: "sku", headerName: "SKU", width: 130 },
        {
            field: "upload", headerName: "Upload Images", width: 300,
            renderCell: (params) => {
                return (
                    <>
                        <Button variant="text" component="label" >
                            <input
                                style={{ background: '#00aaff' }}
                                type="file"
                                multiple
                                name="image"
                                className={styles.productListEdit}
                                onChange={(e) => setFilesToUpload(e.target.files)}
                                accept="image/webp, image/*"
                            />
                        </Button>
                        <CloudUploadOutlined className={styles.UploadIcon}
                            onClick={() => uploadHandler(params.row._id)}
                        />
                    </>
                )
            }
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <button className="h-8 w-16 rounded-md mr-5 bg-green-600 text-white" onClick={() => editHandler(params.row.id)}>Edit</button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];




    const newFeature = {
        id: "",
        color_id: "",
        quantity: "",
        sku: "",
        zero_stock_msg: "",
        images: [],
    };

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [feature, setFeature] = useState(newFeature);
    const [colors, setColors] = useState([]);
    const [images, setImages] = useState([]);
    const [imageArray, setImageArray] = useState([]);

    useEffect(() => {
        getColors();
    }, []);

    const getColors = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);
        setColors(data.colors);
    }

    const editHandler = (id) => {
        setEditMode(true);
        setOpen(true);
        const feature = data.find((v) => v._id === id);
        const newFeature = {
            id: feature._id,
            color_id: feature.color_id._id,
            quantity: feature.quantity,
            sku: feature.sku,
            images: feature.images,
            zero_stock_msg: feature.zero_stock_msg,
        };
        setFeature(newFeature);
    }

    // clear form fields
    const clearForm = () => {
        setFeature(newFeature);
    }

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
        setImageArray([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feature.color_id || !feature.quantity || !feature.sku) {
            toast.error("Please fill all fields");
            return;
        }

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        if (editMode) {
            const featureData = {
                color_id: feature.color_id,
                quantity: feature.quantity,
                sku: feature.sku,
                zero_stock_msg: feature.zero_stock_msg
            };

            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}/${feature.id}`, featureData)
                .then(({ data }) => {
                    data.success && toast.success(data.message);
                }).catch(err => toast.error(err.message));
        } else {
            const fd = new FormData();
            fd.append("color_id", feature.color_id);
            fd.append("quantity", feature.quantity);
            fd.append("sku", feature.sku);
            fd.append("zero_stock_msg", feature.zero_stock_msg);
            for (let i = 0; i < images.length; i++) {
                fd.append("images", images[i]);
            }

            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}`, fd, config)
                .then(({ data }) => {
                    data.success && toast.success(data.message);
                }).catch(err => toast.error(err.message));
        }

        getFeatures();
        handleClose();
        setFeature(newFeature);
    };


    const getFeatures = async () => {
        const featureData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
        const features = featureData.data.product.variants.find((item) => item._id === variantId).features.map((v) => {
            v.id = v._id;
            return v;
        });
        setData(features);
    }

    const fileSelectHandler = (e) => {
        const selectedFileArray = Array.from(e.target.files);
        setImageArray(selectedFileArray.map((file) => URL.createObjectURL(file)));
        setImages(e.target.files);
    }

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Variant ~ Features</h2>
            </div>

            <br />
            <div className="flex justify-between mr-5 ">
                <div className="ml-8 mb-5">
                    Product {`: `}<strong><Link href={`/products/${productId}`}>{productTitle}</Link></strong>
                    <br />
                    <div>Size<strong>{`: ${size}`}</strong></div>
                </div>
                <CreateNewIcon handleClick={handleClickOpen} />
            </div>

            <MuiGrid columns={columns} data={data} />
            <br /><br />
            {image &&
                <div style={{ width: '100%', height: '450px', border: '1px solid gray', justifyContent: 'center', display: 'flex' }}>
                    <Image alt="" height={400} width={700} src={`${process.env.NEXT_PUBLIC_uploadURL}/products/${image}`} />
                </div>}


            {/* MODAL FORM */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-3/4 h-4/4 rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Variant Features").toUpperCase() : ("New Variant Features").toUpperCase()}</h2>
                        </Grid>
                        <br /><br />
                        <form autoComplete="off" onSubmit={handleSubmit} className="flex place-items-start ">
                            <div className="flex flex-col justify-between w-96 mr-10">
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Select Color"
                                    select
                                    value={feature.color_id} onChange={(e) => setFeature({ ...feature, color_id: e.target.value })}>
                                    {colors.map((c) => (
                                        <MenuItem value={c._id} key={c._id}>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <Image alt="" height={32} width={32}
                                                        className={styles.productListImg}
                                                        src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${c.image}`} />
                                                </div>
                                                {c.title}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <br />
                                <div className='flex justify-between'>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        inputProps={{ step: '1', min: '1', max: '1000', type: 'number' }}
                                        label='Quantity' placeholder='Enter Quantity'
                                        variant='outlined'
                                        value={feature.quantity} onChange={(e) => setFeature({ ...feature, quantity: e.target.value })}
                                    />
                                    <br />
                                    <TextField
                                        size='small'
                                        fullWidth
                                        required
                                        variant='outlined'
                                        label='sku' placeholder='Enter SKU'
                                        value={feature.sku} onChange={(e) => setFeature({ ...feature, sku: e.target.value })}
                                    />
                                </div>
                                <br />
                                <div className="">
                                    <InputLabel htmlFor="description">Zero Stock Message</InputLabel>
                                    <ReactQuill
                                        value={feature.zero_stock_msg} onChange={(e) => setFeature({ ...feature, zero_stock_msg: e })} />
                                </div>

                                <br />
                                {!editMode &&
                                    <div className="flex flex-col place-items-center">
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                            component="label" >
                                            Choose Images
                                            <input type="file" multiple name="image" hidden
                                                onChange={fileSelectHandler} accept="image/*" />
                                        </Button>
                                        <div><small>Only jpg, png, gif, svg images are allowed</small></div>
                                    </div>
                                }
                                <br /><br />

                                <Button
                                    type='submit'
                                    color='primary'
                                    variant="outlined"
                                    fullWidth>
                                    {editMode ? "Update Variant Feature" : "Add Variant Feature"}
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
                            </div>
                            {imageArray.length > 0 &&
                                <div className=''>
                                    <br />
                                    <Typography style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', justifyContent: 'center' }}>
                                        Images Selected
                                    </Typography>
                                    <div className='flex flex-wrap p-10 border-l-stone-700 '>
                                        {imageArray.map((image) => {
                                            return (
                                                <div key={image} className="mr-3">
                                                    <Image alt="" height={200} width={200} src={image} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }
                        </form>
                        <br /><br />
                    </Paper>
                </div>
            </Modal>

        </div >
    );
}

export async function getServerSideProps(context) {
    const { productId, variantId, size } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);

    const features = data.product.variants.find((item) => item._id === variantId).features.map((v) => {
        v.id = v._id;
        return v;
    });

    return {
        props: {
            productId: data.product._id,
            variantId,
            productTitle: data.product.title,
            features,
            size
        },
    };
}