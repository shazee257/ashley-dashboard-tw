import styles from "styles/VariantFeatureNew.module.css";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem, Checkbox, FormGroup, FormControlLabel,
} from '@mui/material'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProductFeatureNew({ productId, variantId, productTitle, size, colors }) {
    const [colorId, setColorId] = useState(" ");
    const [quantity, setQuantity] = useState(1);
    const [sku, setSku] = useState("");
    const [images, setImages] = useState([]);
    const [imageArray, setImageArray] = useState([]);

    const router = useRouter();

    // clear form fields
    const clearForm = () => {
        setColorId(" ");
        setQuantity(0);
        setSku("");
        setImages();
    }

    const fileSelectHandler = (e) => {
        const selectedFileArray = Array.from(e.target.files);
        setImageArray(selectedFileArray.map((file) => URL.createObjectURL(file)));
        setImages(e.target.files);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!colorId || !quantity || !sku) {
            showNotification("", "Please fill all fields", "warn");
            return;
        }

        const fd = new FormData();
        fd.append("color_id", colorId);
        fd.append("quantity", quantity);
        fd.append("sku", sku);
        for (let i = 0; i < images.length; i++) {
            fd.append("files", images[i]);
        }

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}`, fd, config)
                .then(({ data }) => {
                    data.success && showNotification("", data.message, "success");
                    router.push(`/products/${productId}/${variantId}?size=${size}`);
                }).catch(err => showNotification("", err.response.data.message, "warn"));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className="px-5">
            <div className="ml-8">
                <h2 className="">Add Variant Feature</h2>
                <br />
                <div className="mb-5">
                    Product {`: `}<b>
                        <Link href={`/products/${productId}`}>{productTitle}</Link>
                    </b>
                    <br />
                    <div>Size<strong>{`: ${size}`}</strong></div>
                </div>
            </div>
            <div className="flex">
                <Paper elevation={1} className="p-10 w-96 mr-10">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <InputLabel>Select Product Color</InputLabel>
                        <Select
                            fullWidth
                            label="Color"
                            value={colorId}
                            onChange={(e) => setColorId(e.target.value)}>
                            {colors.map((c) => (
                                <MenuItem value={c._id} key={c._id}>
                                    <div className={styles.productListItem}>
                                        <div className={styles.ImageDiv}>
                                            <Image height={32} width={32}
                                                className={styles.productListImg}
                                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${c.image}`} />
                                        </div>
                                        {c.title}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <TextField
                            fullWidth
                            inputProps={{ step: '1', min: '1', max: '1000', type: 'number' }}
                            label='Quantity' placeholder='Enter Quantity'
                            variant='outlined'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <br /><br />
                        <TextField
                            fullWidth
                            required
                            variant='outlined'
                            label='sku' placeholder='Enter SKU'
                            value={sku} onChange={(e) => setSku(e.target.value)}
                        />
                        <br /><br />
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
                        <br /><br />
                        <Button
                            fullWidth
                            type='submit'
                            color='primary'
                            variant="outlined">
                            Add Variant Feature
                        </Button>
                    </form>
                    <br /><br />
                    <Typography >
                        <Link href={`/products/${productId}/${variantId}?size=${size}`}>Back to Variant Features</Link>
                    </Typography>
                </Paper>
                {imageArray.length > 0 &&
                    <Paper elevation={1} className="p-10 w-auto">
                        <br />
                        <Typography style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', justifyContent: 'center', marginBottom: '20px' }}>
                            Images Selected
                        </Typography>
                        <div style={{ display: 'flex', padding: '20px', width: '100%', border: '1px solid gray' }}>
                            {imageArray.map((image) => {
                                return (
                                    <div key={image}>
                                        <Image height={200} width={200} src={image} />
                                    </div>
                                )
                            })}
                        </div>
                    </Paper>}
            </div>
        </div >
    );
}

export const getServerSideProps = async (context) => {
    const { productId, variantId, size } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    const colorData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);

    return {
        props: {
            colors: colorData.data.colors,
            productId,
            variantId,
            size,
            productTitle: data.product.title
        }
    }
}

