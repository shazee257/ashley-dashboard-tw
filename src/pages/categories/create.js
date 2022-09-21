import styles from "styles/CategoryNew.module.css";
import { useState, useEffect } from "react";
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem, Checkbox,
    ListItemIcon, ListItemText, FormControl,
} from '@mui/material';
import axios from 'axios';
import { showNotification } from "utils/helper";
import { MenuProps, useStyles, options } from "components/FilterOptions/FilterOptions";
import Link from "next/link";
import Image from "next/image";

export default function NewCategory() {
    const [title, setTitle] = useState("");
    const [parentId, setParentId] = useState("");
    const [image, setImage] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [selectedFile, setSelectedFile] = useState("");

    const [categories, setCategories] = useState([]);

    const classes = useStyles();
    const [selected, setSelected] = useState([]);
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

    const fileSelectedHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) setImage(reader.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const clearForm = () => {
        setTitle("");
        setCategoryId("");
        setImage("");
        setSelected([]);
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', title);
        fd.append('parent_id', categoryId);
        fd.append('attributes', selected);
        fd.append('image', selectedFile);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories`, fd, config)
                .then(({ data }) => {
                    data.success && showNotification("success", data.message);
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            showNotification(message);
        }
    };

    const getCategories = async (e) => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/fetch/categories`);
        setCategories(data.categories);
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="flex p-10 h-auto ">
            <Paper elevation={1} style={{ padding: '20px', width: '350px', height: '400px' }}>
                <Grid align='left'>
                    <h2>New Category</h2>
                </Grid>
                <br />
                <form onSubmit={handleSubmit} autoComplete="off">
                    <TextField
                        size="small"
                        fullWidth
                        label='Category Title'
                        placeholder='Enter Category Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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
                                <div className="flex">
                                    <Image alt="" className="rounded-full"
                                        height={32} width={32}
                                        src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />
                                    <p className="ml-5">{category.title}</p>
                                </div>
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* <br /><br />
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
                        </Select> */}
                    <br /><br />
                    <Button
                        className="flex justify-center mt-5"
                        type='submit'
                        color='primary'
                        variant="outlined"
                        fullWidth
                    >Add Category</Button>
                </form>
                <br />
                <Typography >
                    <Link href="/categories">Back to Categories</Link>
                </Typography>
            </Paper >
            <div className="flex flex-col h-auto">
                <div className={styles.productImage}>
                    {image &&
                        <Image alt="" src={image} height={400} width={400} className={styles.imgObject} />}
                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button
                        className={styles.imageButton}
                        variant="outlined"
                        color="secondary"
                        component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/webp, image/*" />
                    </Button>
                </div>
            </div>
        </div >
    );
}

