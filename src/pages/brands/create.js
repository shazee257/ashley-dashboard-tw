import styles from "styles/BrandNew.module.css";
import { useState, useRef } from "react";
import { Grid, Paper, TextField, Button, Typography } from '@mui/material'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";

export default function NewBrand() {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [image, setImage] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [selectedFile, setSelectedFile] = useState("");

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
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', titleRef.current.value);
        fd.append('description', descriptionRef.current.value);
        fd.append('image', image);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/brands`, fd, config)
                .then(({ data }) => {
                    data.success && showNotification("", data.message, "success");
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className="flex px-5">
            <Paper elevation={1} className="p-10">
                <h2>New Brand</h2>
                <br />
                <form encType='multipart/form-data'>
                    <TextField
                        className={styles.addProductItem}
                        label='Brand Title'
                        placeholder='Enter Brand Title'
                        fullWidth
                        inputRef={titleRef} />
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Description'
                        placeholder="Brand Description"
                        fullWidth multiline maxRows={5}
                        inputRef={descriptionRef} />
                    <br />
                    <div className="flex flex-col">
                        <Button variant="outlined" component="label" >Choose Image
                            <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                        </Button>
                        <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    </div>
                    <br />
                    <Button
                        onClick={handleSubmit}
                        type='submit'
                        color='primary'
                        variant="outlined" fullWidth>Add Brand</Button>
                </form>
                <br />
                <Typography >
                    <Link href="/brands">Back to Brands</Link>
                </Typography>
            </Paper>
            <div>
                <div className={styles.productImage}>
                    {(image) && (<Image height={400} width={400} src={image} className={styles.imgObject} />)}
                </div>
            </div>

        </div>
    );
}
