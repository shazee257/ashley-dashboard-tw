import styles from "styles/CategoryUpdate.module.css";
import { useState } from "react";
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem, Checkbox,
    ListItemIcon, ListItemText,
} from '@mui/material'
import axios from 'axios';
import { MenuProps, useStyles, options } from "components/FilterOptions/FilterOptions";
import { showNotification } from "utils/helper";
import Image from 'next/image';
import Link from 'next/link';

export default function UpdateCategory({ category, categories }) {
    const [title, setTitle] = useState(category.title);
    const [parentId, setParentId] = useState(category.parent_id);
    const [img_address, setImg_address] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [discountImageAddress, setDiscountImageAddress] = useState("");
    const [discountImageFilename, setDiscountImageFilename] = useState("Choose Image");

    const classes = useStyles();
    const [selected, setSelected] = useState(category.attributes);
    const isAllSelected =
        options.length > 0 && selected.length === options.length;

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelected(selected.length === options.length ? [] : options);
            return;
        }
        setSelected(value);
    };

    const fileSelectedHandler = async (e) => {
        if (e.target.value) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImg_address(reader.result);
                };
            }
            reader.readAsDataURL(e.target.files[0]);
            setFilename(e.target.files[0].name);

            const fd = new FormData();
            fd.append('image', e.target.files[0]);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories/upload-image/${category._id}`, fd, config)
                .then(({ data }) => showNotification(data.message, "success"))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    showNotification(message, "error");
                });
        }
    }

    const discountImageHandler = async (e) => {
        if (e.target.value) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setDiscountImageAddress(reader.result);
                };
            }
            reader.readAsDataURL(e.target.files[0]);
            setDiscountImageFilename(e.target.files[0].name);

            const fd = new FormData();
            fd.append('image', e.target.files[0]);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories/discount-image/${category._id}`, fd, config)
                .then(({ data }) => showNotification("success", data.message))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    showNotification
                });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryObj = {
            title,
            parent_id: parentId,
            attributes: selected
        };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/categories/${category._id}`, categoryObj)
                .then(({ data }) => {
                    console.log(data);
                    data.success && showNotification(data.message, "success");
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = err.response ? err.response.data.message : "Something went wrong!";
            showNotification(message, "error");
        }
    };

    return (
        <div className="flex p-10">
            <Paper elevation={1} style={{ padding: '20px', width: '450px', height: '420px' }}>
                <div>
                    <Grid align='left'>
                        <h2>Update Category</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            size="small"
                            fullWidth
                            label='Category Title'
                            placeholder='Enter Category Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                        <br /><br />
                        <TextField
                            fullWidth
                            size="small"
                            label="Parent Category"
                            select
                            value={parentId} onChange={(e) => setParentId(e.target.value)}
                        >
                            <MenuItem key='none' value='none' className="flex ml-15">None</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id} className="flex ml-15">
                                    <div className="flex items-center">
                                        <Image alt="" className="rounded-full"
                                            height={32} width={32}
                                            src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />
                                        <p className="ml-5">{category.title}</p>
                                    </div>
                                </MenuItem>
                            ))}
                        </TextField>
                        <br /><br />
                        {/* <InputLabel id="mutiple-select-label">Filter Attributes for Category's Products</InputLabel>
                        <Select
                            fullWidth
                            label="Filter Attributes for Category's Product"
                            labelId="mutiple-select-label"
                            multiple
                            maxRows={4}
                            value={selected}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                        >
                            <MenuItem style={{ display: 'flex', justifyContent: 'left' }}
                                value="all"
                                classes={{ root: isAllSelected ? classes.selectedAll : "" }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        classes={{ indeterminate: classes.indeterminateColor }}
                                        checked={isAllSelected}
                                        indeterminate={selected.length > 0 && selected.length < options.length}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.selectAllText }}
                                    primary="Select All" />
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem style={{ display: 'flex', justifyContent: 'left' }} key={option} value={option}>
                                    <ListItemIcon>
                                        <Checkbox checked={selected.indexOf(option) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={option} />
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br /> */}
                        <Button
                            className="flex justify-center mt-5"
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="outlined"
                            fullWidth
                        >Update Category</Button>
                    </form>
                    <br /><br /><br />
                    <Typography >
                        <Link href="/categories">Back to Categories</Link>
                    </Typography>
                </div>
            </Paper>
            {/* Category Image */}
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    <Image alt="" height={400} width={400}
                        src={img_address ? img_address : `${process.env.NEXT_PUBLIC_uploadURL}/categories/${category.image}`}
                    />
                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="outlined" color='secondary' component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                </div>
            </div>
            {/* Discount Image */}
            <div className="flex flex-col ml-5 mt-10 rounded items-center border h-96">
                <Image alt="" height={300} width={700} layout="fixed"
                    src={discountImageAddress ? discountImageAddress : `${process.env.NEXT_PUBLIC_uploadURL}/categories/${category.discount_image}`}
                />
                <h1 className="text-center">Discounted Banner Image</h1>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="outlined" color='secondary' component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={discountImageHandler} accept="image/*" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { categoryId } = context.query;
    const categoryData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/${categoryId}`);
    const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/fetch/categories`);
    return {
        props: {
            category: categoryData.data.category,
            categories: categoriesData.data.categories
        }
    };
}