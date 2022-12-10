import React from 'react'
import {
    Grid,
    Paper,
    TextField, MenuItem, InputLabel, Button, Typography
} from '@mui/material'
import axios from 'axios';
import styles from 'styles/ProductFeatures.module.css';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';


const FeatureForm = ({ feature, setFeature, colors, imageArray, editMode, setImageArray, setImages }) => {

    const fileSelectHandler = (e) => {
        const selectedFileArray = Array.from(e.target.files);
        setImageArray(selectedFileArray.map((file) => URL.createObjectURL(file)));
        setImages(e.target.files);
    }

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

        // getFeatures();
        // handleClose();
        // setFeature(newFeature);
    };

    return (
        <div>
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
                            value={feature.color_id} onChange={(e) => setFeature({ ...feature, color_id: e.target.value })}
                        >
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
                                value={feature.zero_stock_msg} onChange={(e) => setFeature({ ...feature, zero_stock_msg: e })}
                            />
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
                                        onChange={fileSelectHandler}
                                        accept="image/*" />
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
    )
}

export default FeatureForm