import React from 'react'
import {
    Grid,
    Paper,
    TextField,
    MenuItem,
    InputLabel,
    Button,
    Typography,
    Card,
    IconButton

} from '@mui/material'
import axios from 'axios';
import styles from 'styles/ProductFeatures.module.css';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { showNotification } from 'utils/helper';
import { Delete } from '@mui/icons-material';


const FeatureForm = ({
    setVariation,
    variation,
    variant,
    feature,
    setFeature,
    colors,
    imageArray,
    editMode,
    setImageArray,
    setImages,
    setFeatures,
    features,
    product,
    filesToUpload,
    getProduct,
    clearFeatureForm }) => {

    const [iamgesArray, setiamgesArray] = React.useState([]);

    React.useEffect(() => {
        if (feature.edit) {
            const selectedFileArray = Array.from(filesToUpload);
            setiamgesArray(selectedFileArray.map((file) => URL.createObjectURL(file)));
        }
    }, [filesToUpload, feature])

    const fileSelectHandler = (e) => {
        const selectedFileArray = Array.from(e.target.files);
        setImageArray(selectedFileArray.map((file) => URL.createObjectURL(file)));
        setImages(e.target.files);
    }

    // clear form fields
    const clearForm = () => {
        const newFeature = {
            variant: "",
            id: "",
            color_id: "",
            quantity: "",
            sku: "",
            zero_stock_msg: "",
            images: [],
        };
        setFeature(newFeature);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (feature.edit) {
            // Edit feature from grid handling
            let index = features.findIndex((list) => list.id === feature.id)
            let new_detail = {
                id: feature.variant,
                variant: feature.variant,
                color_id: feature.color_id,
                quantity: feature.quantity,
                sku: feature.sku,
                zero_stock_msg: feature.zero_stock_msg,
                images: feature.images,
                edit: false
            }
            // 1. Make a shallow copy of the array
            let temp_state = [...features];
            temp_state[index] = new_detail;
            // 2. Set the state to our new copy
            let temp = [...variation];
            temp[feature.variant] = features;
            setFeatures(temp_state);

            const data = {
                id: feature.variant,
                variant: feature.variant,
                color_id: feature.color_id,
                quantity: feature.quantity,
                sku: feature.sku,
                zero_stock_msg: feature.zero_stock_msg,
                images: feature.images,
                edit: false
            }
            console.log('variation: ', variation)
            let Id = ''
            let findVariantId = variation.map((res) => {
                res.features.map((fea) => {
                    if (fea._id === feature.id) {
                        Id = res._id
                    }
                })
            })
            console.log('product.id: ', product.id)
            console.log('Id: ', Id)
            console.log('feature.id: ', feature.id)
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product.id}/${Id}/${feature.id}`, data)
                .then(({ data }) => {
                    if (data.success) {
                        showNotification("success", data.message);
                        clearForm();
                    }
                }).catch(err => showNotification("error", err.response.data.message));
        } else {
            if (editMode) {
                // Adding feature in Edit mode
                let new_detail = {
                    id: feature.variant,
                    variant: feature.variant,
                    color_id: feature.color_id,
                    quantity: feature.quantity,
                    sku: feature.sku,
                    zero_stock_msg: feature.zero_stock_msg,
                    images: feature.images,
                    edit: false
                }

                const variant = variation[feature.variant];
                const payload = {
                    _id: variant._id,
                    description: variant.description,
                    dimensions: variant.dimensions,
                    size: variant.size,
                    sale_price: variant.sale_price,
                    purchase_price: variant.purchase_price,
                    features: [...variant.features, new_detail]
                }
                console.log('payload: ', payload)
                debugger;

                await axios
                    .put(`${process.env.NEXT_PUBLIC_baseURL}/products/updateVariant/${product.id}/${variant._id}`, payload)
                    .then(({ data }) => {
                        if (data.success) {
                            showNotification("success", data.message);
                            clearForm();
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch(err => showNotification("error", err?.response?.data?.message));

            } else {
                // Add Form handling
                const featureData = {
                    id: feature.variant,
                    variant: feature.variant,
                    color_id: feature.color_id,
                    quantity: feature.quantity,
                    sku: feature.sku,
                    zero_stock_msg: feature.zero_stock_msg,
                    images: feature.images,
                    edit: false
                }
                let test = variation.map((res, index) => {
                    if (index === feature.variant) {
                        return { ...res, features: [feature] }
                    }
                    else {
                        return res
                    }
                })
                setVariation(test)
                setFeatures([...features, featureData])
            }
        }
        clearForm();
    };

    return (
        <div>
            <Paper elevation={4} className="p-10 w-full">
                <Grid align='left'>
                    <h2>{editMode ? ("Update Variant Features").toUpperCase() : ("New Variant Features").toUpperCase()}</h2>
                </Grid>
                <br /><br />
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className='grid grid-cols-4 gap-4'>
                        <div className='col-span-2'>
                            <TextField
                                className='w-full'
                                size="small"
                                label="Select Variant"
                                select
                                value={feature.variant} onChange={(e) => setFeature({ ...feature, variant: e.target.value })}
                            >
                                {variation.map((c, index) => (
                                    <MenuItem value={index} key={c._id}>
                                        {c.size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                className='w-full'
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
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                size='small'
                                className="w-full"
                                inputProps={{ step: '1', min: '1', max: '1000', type: 'number' }}
                                label='Quantity' placeholder='Enter Quantity'
                                variant='outlined'
                                value={feature.quantity} onChange={(e) => setFeature({ ...feature, quantity: e.target.value })}
                            />
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                size='small'
                                className="w-full"
                                required
                                variant='outlined'
                                label='sku' placeholder='Enter SKU'
                                value={feature.sku} onChange={(e) => setFeature({ ...feature, sku: e.target.value })}
                            />
                        </div>
                        <div className="col-span-4 w-full">
                            <InputLabel htmlFor="description">Zero Stock Message</InputLabel>
                            <ReactQuill
                                value={feature.zero_stock_msg} onChange={(e) => setFeature({ ...feature, zero_stock_msg: e })}

                            />
                        </div>

                        <br />
                        {/* {!editMode &&
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
                        } */}
                        <br /><br />
                        <div className='flex gap-2 col-span-4'>
                            <Button
                                type='submit'
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                {editMode ? "Update Variant Feature" : "Add Variant Feature"}
                            </Button>
                            <Button
                                onClick={() => clearFeatureForm()}
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                {"Reset Form"}
                            </Button>
                        </div>
                        <br /><br />

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
                        {feature.edit && filesToUpload.length > 0 && iamgesArray?.map((res, Index) => (
                            <>
                                <Grid item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={2}
                                    style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px', marginRight: '10px' }}
                                >
                                    <Card
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            marginRight: '15px'
                                        }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <IconButton
                                                onClick={() => {
                                                    let detail = iamgesArray.filter((a, index) => index !== Index);
                                                    setiamgesArray(detail)
                                                }}
                                                style={{
                                                    color: 'red'
                                                }}
                                                fontSize='small'
                                            >
                                                <Delete fontSize='small' />
                                            </IconButton>
                                            <img src={res} style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    </Card>
                                </Grid>
                            </>
                        ))}
                    </div>
                </form>
                <br /><br />
            </Paper>
        </div>
    )
}

export default FeatureForm