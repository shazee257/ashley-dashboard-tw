import styles from "styles/CategoryUpdate.module.css";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { ArrowForwardOutlined } from "@mui/icons-material";

export default function UpdateCategory({ category, categories }) {
    const [title, setTitle] = useState("");
    const [parentId, setParentId] = useState("");
    const [image, setImage] = useState("");
    const [img_address, setImg_address] = useState("");
    const [filename, setFilename] = useState("Choose Image");


    useEffect(() => {
        setTitle(category.title);
        setParentId(category.parent_id);
        console.log(category.parent_id);
        setImage(category.image);
        setSelected(category.attributes);
    }, [category]);

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
                .then(({ data }) => toast.success(data.message))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    toast.error(message)
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

        // return console.log('categoryObj', categoryObj);


        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/categories/${category._id}`, categoryObj)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = err.response ? err.response.data.message : "Something went wrong!";
            toast.error(message);
        }
    };

    return (
        <div className="flex p-10">
            <Paper elevation={1} style={{ padding: '20px', width: '450px' }}>
                <div>
                    <Grid align='left'>
                        <h2>Update Category</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            fullWidth
                            label='Category Title'
                            placeholder='Enter Category Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <br /><br />
                        <InputLabel>Parent Category</InputLabel>
                        <Select fullWidth
                            label="Parent Category"
                            value={parentId} onChange={(e) => setParentId(e.target.value)}
                        >
                            <MenuItem key='none' value='none' className="flex ml-15">None</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id} className="flex ml-15">
                                    <div className="flex">
                                        <Image height={32} width={32}
                                            src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />
                                        <p className="ml-5">{category.title}</p>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <InputLabel id="mutiple-select-label">Filter Attributes for Category's Products</InputLabel>
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
                        <br /><br />
                        <Button
                            className="flex justify-center mt-5"
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="outlined"
                            fullWidth
                        >Update Category</Button>
                    </form>

                    <br />
                    <Typography >
                        <Link href="/categories">Back to Categories</Link>
                    </Typography>
                </div>
            </Paper>
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    <Image height={400} width={400}
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