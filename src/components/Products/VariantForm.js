import React from 'react'
import {
    Grid,
    Paper,
    TextField, MenuItem, InputLabel, Button, Typography, IconButton
} from '@mui/material'
import axios from 'axios';
import styles from 'styles/ProductFeatures.module.css';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { showNotification } from 'utils/helper';
import { ArrowBack } from '@mui/icons-material';

const VariantForm = ({ variant, setVariant, editMode, clearForm, setAddVariation, productId, setVariation, variation }) => {



    const handleSubmit = async (e) => {
        e.preventDefault();

        const variantData = {
            id: productId,
            createdAt: new Date(),
            size: variant.size,
            sale_price: variant.salePrice,
            purchase_price: variant.purchasePrice,
            description: variant.description,
            dimensions: variant.dimensions,
            action: ''
        }
        setVariation([...variation, variantData])
        // if (editMode) {
        //     await axios
        //         .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variant.id}`, variantData)
        //         .then(({ data }) => {
        //             if (data.success) {
        //                 showNotification("success", data.message);
        //                 clearForm();
        //             }
        //         }).catch(err => showNotification("error", err.response.data.message));
        // } else {
        //     await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}`, variantData)
        //         .then(({ data }) => {
        //             if (data.success) {
        //                 data.success && showNotification("success", data.message);
        //                 clearForm();
        //             }
        //         }).catch(err => showNotification("error", err.response.data.message));
        // }
        // getVariants(productId);
        setAddVariation(false)
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
        <div className='w-full p-10'>
            <IconButton onClick={() => setAddVariation(false)}>
                <ArrowBack />
            </IconButton>
            <Grid align='left'>
                <h2>{editMode ? ("Update Size Variant").toUpperCase() : ("Add New Size Variant").toUpperCase()}</h2>
            </Grid>
            <br />
            <form autoComplete="off">
                <div className='grid grid-cols-4 gap-6'>
                    <div className='col-span-4'>
                        <TextField
                            required
                            className="w-full"
                            size="small"
                            label='Product Size' placeholder='Enter Product Size' variant='outlined'
                            value={variant.size} onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                        />
                    </div>
                    <div className='col-span-2'>
                        <TextField
                            className="w-full"
                            size="small"
                            required
                            inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                            variant='outlined'
                            label='Sale Price' placeholder='Enter Sale Price'
                            value={variant.salePrice} onChange={(e) => setVariant({ ...variant, salePrice: e.target.value })}
                        />
                    </div>
                    <div className='col-span-2'>
                        <TextField
                            className="w-full"
                            size="small"
                            inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                            variant='outlined' type='number'
                            label='Purchase Price' placeholder='Enter Purchase Price'
                            value={variant.purchasePrice} onChange={(e) => setVariant({ ...variant, purchasePrice: e.target.value })}
                        />
                    </div>
                    <div className="col-span-4 w-full">
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <ReactQuill
                            value={variant.description}
                            onChange={(e) => setVariant({ ...variant, description: e })}
                        />
                    </div>
                    <div className="col-span-4 w-full">
                        <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                        <ReactQuill
                            value={variant.dimensions}
                            onChange={(e) => setVariant({ ...variant, dimensions: e })}
                        />
                    </div>
                </div>
                <br />
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
            </form>
        </div>
    )
}

export default VariantForm