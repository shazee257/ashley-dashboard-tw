import styles from "styles/VariantCreate.module.css";
import { useState, useRef, useEffect } from "react";
import { Grid, Paper, TextField, Button, Typography, InputLabel } from '@mui/material';
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// convert useRef into useState

export default function NewVariant({ product }) {
    const newVariant = {
        size: "",
        salePrice: 0,
        purchasePrice: 0,
        description: "",
        dimensions: "",
    }

    const [variant, setVariant] = useState(newVariant);

    // clear form fields
    const clearForm = () => {
        setVariant(newVariant);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const variantObj = {
            size: variant.size,
            sale_price: variant.salePrice,
            purchase_price: variant.purchasePrice,
            description: variant.description,
            dimensions: variant.dimensions,
        }


        return console.log(variantObj);

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}`, variantObj)
                .then(({ data }) => {
                    console.log(data);
                    data.success && showNotification('success', data.message);
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            showNotification(err)
        };
    }

    return (
        <div className="flex p-5 w-full">
            <Paper elevation={1} className="p-10 w-12/12">
                <Grid align='left'>
                    <h2>Add New Product Variant</h2>
                </Grid>
                <div className={styles.main}>
                    <h4 className={styles.productTitle}>Product Title: <i>{product.title}</i></h4>
                </div>
                <br />
                <form autoComplete="off" >
                    <div className="flex justify-between">
                        <TextField
                            required
                            className="w-1/2 pr-5"
                            size="small"
                            label='Product Size' placeholder='Enter Product Size' variant='outlined'
                            value={variant.size} onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                        />
                        <br /><br />
                        <div className="flex">
                            <TextField
                                size="small" required
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                variant='outlined'
                                label='Sale Price' placeholder='Enter Sale Price'
                                value={variant.salePrice} onChange={(e) => setVariant({ ...variant, salePrice: e.target.value })}
                            />
                            <br /><br />
                            <TextField
                                size="small"
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                variant='outlined' type='number'
                                label='Purchase Price' placeholder='Enter Purchase Price'
                                value={variant.purchasePrice} onChange={(e) => setVariant({ ...variant, purchasePrice: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex mt-5">
                        <div className="w-96">
                            <InputLabel htmlFor="description">Description</InputLabel>
                            <ReactQuill value={variant.description} onChange={(e) => setVariant({ ...variant, description: e })} />
                        </div>
                        <div className="w-88">
                            <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                            <ReactQuill value={variant.dimensions} onChange={(e) => setVariant({ ...variant, dimensions: e })} />
                        </div>
                    </div>
                </form>
                <br /><br />
                <Button
                    fullWidth
                    onClick={handleSubmit}
                    type='submit'
                    color='primary'
                    variant="outlined">
                    Add Variant
                </Button>
                <br /><br />
                <Button
                    fullWidth
                    onClick={clearForm}
                    color='secondary'
                    variant="outlined">
                    Reset Form
                </Button>
                <br /><br />
                <Typography >
                    <Link href={`/products/${product._id}`}>Back to Product Variants</Link>
                </Typography>
            </Paper>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { productId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);

    return {
        props: {
            product: data.product
        },
    };
}