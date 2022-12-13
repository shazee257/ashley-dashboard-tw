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

const VariantForm = ({ variant, setVariant, editMode, setAddVariation, productId, setVariation, variation, product }) => {


    // clear form fields
    const clearForm = () => {
        const newVariant = {
            id: "",
            size: "",
            sale_price: 0,
            purchase_price: 0,
            description: "",
            dimensions: "",
            edit: false
        }
        setVariant(newVariant);
    }
    const handleSubmit = async (e) => {

        e.preventDefault();
        if (variant.edit) {
            let index = variation.findIndex((list) => list.id === variant.id)
            let new_detail = {
                id: productId,
                createdAt: new Date(),
                size: variant.size,
                sale_price: variant.sale_price,
                purchase_price: variant.purchase_price,
                description: variant.description,
                dimensions: variant.dimensions,
                action: '',
                edit: false
            }
            // 1. Make a shallow copy of the array
            let temp_state = [...variation];
            temp_state[index] = new_detail;
            // 2. Set the state to our new copy
            setVariation(temp_state);
        } else {
            const variantData = {
                id: productId,
                createdAt: new Date(),
                size: variant.size,
                sale_price: variant.sale_price,
                purchase_price: variant.purchase_price,
                description: variant.description,
                dimensions: variant.dimensions,
                action: '',
                edit: false
            }
            setVariation([...variation, variantData])
        }
        if (editMode) {
            const variantData = {
                id: variant.id,
                createdAt: new Date(),
                size: variant.size,
                sale_price: variant.sale_price,
                purchase_price: variant.purchase_price,
                description: variant.description,
                dimensions: variant.dimensions,
                action: '',
                edit: false
            }
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}/${variant.id}`, variantData)
                .then(({ data }) => {
                    if (data.success) {
                        showNotification("success", data.message);
                        clearForm();
                    }
                }).catch(err => showNotification("error", err.response.data.message));
        }
        setVariant({
            id: "",
            size: "",
            sale_price: 0,
            purchase_price: 0,
            description: "",
            dimensions: "",
            edit: false
        });
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
        <Paper elevation={4} className="p-10 w-full p-10">
            {/* <IconButton onClick={() => setAddVariation(false)}>
                <ArrowBack />
            </IconButton> */}
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
                            value={variant.sale_price} onChange={(e) => setVariant({ ...variant, sale_price: e.target.value })}
                        />
                    </div>
                    <div className='col-span-2'>
                        <TextField
                            className="w-full"
                            size="small"
                            inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                            variant='outlined' type='number'
                            label='Purchase Price' placeholder='Enter Purchase Price'
                            value={variant.purchase_price}
                            onChange={(e) => setVariant({ ...variant, purchase_price: e.target.value })}
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
                    onClick={(e) => handleSubmit(e)}
                    type='submit'
                    color='primary'
                    variant="outlined"
                    fullWidth>
                    {variant.edit ? "Update Size Variant" : "Add Size Variant"}
                </Button>
                <br /><br />
            </form>
        </Paper>
    )
}

export default VariantForm