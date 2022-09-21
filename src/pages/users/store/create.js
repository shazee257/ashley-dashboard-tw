import styles from "styles/UserStoreCreate.module.css";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem
} from '@mui/material'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";

export default function NewStoreUser({ stores }) {
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNoRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const storeIdRef = useRef(null);

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

    // clear form fields
    const clearForm = () => {
        firstNameRef.current.value = "";
        lastNameRef.current.value = "";
        emailRef.current.value = "";
        phoneNoRef.current.value = "";
        passwordRef.current.value = "";
        confirmPasswordRef.current.value = "";
        storeIdRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("image", selectedFile);
        fd.append("first_name", firstNameRef.current.value);
        fd.append("last_name", lastNameRef.current.value);
        fd.append("email", emailRef.current.value);
        fd.append("store_id", storeIdRef.current.value);
        fd.append("role", "store");
        fd.append("phone_no", phoneNoRef.current.value);
        fd.append("password", passwordRef.current.value);
        fd.append("confirm_password", confirmPasswordRef.current.value);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/users/register`, fd, config)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className="flex p-5">
            <Paper elevation={1} style={{ padding: '20px', width: '350px' }}>
                <Grid align='left'>
                    <h2>Create a New Store User</h2>
                </Grid>
                <br />
                <form encType='multipart/form-data' onSubmit={handleSubmit}>
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        label='First Name' placeholder='Enter First Name'
                        inputRef={firstNameRef}
                    />
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        label='Last Name' placeholder='Enter Last Name'
                        inputRef={lastNameRef}
                    />
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        label='Email' placeholder='Enter Email'
                        inputRef={emailRef} />
                    <TextField fullWidth displayEmpty
                        size="small"
                        select
                        label="Store"
                        inputRef={storeIdRef}
                    >
                        {stores.map((store) => (
                            <MenuItem value={store._id} key={store._id}>
                                <div className={styles.productListItem}>
                                    <div className={styles.productListItem}>
                                        <Image alt="" height={32} width={32}
                                            className={styles.productListImg}
                                            src={`${process.env.NEXT_PUBLIC_thumbURL}/stores/${store.banner}`} />
                                    </div>
                                    {store.title}
                                </div>
                            </MenuItem>
                        ))}
                    </TextField>
                    <br /><br />
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        label='Phone #'
                        placeholder='Enter Phone #'
                        inputRef={phoneNoRef} />
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        type='password' label='Password' placeholder='Enter Password'
                        inputRef={passwordRef} />
                    <TextField
                        size="small"
                        className={styles.addProductItem}
                        type='password' label='Confirm Password' placeholder='Confirm Password'
                        inputRef={confirmPasswordRef} />
                    <br />
                    <Button
                        type='submit'
                        color='primary'
                        variant="outlined"
                        className={styles.addProductItem}
                        fullWidth>
                        Create
                    </Button>
                </form>
                <br />
                <Typography >
                    <Link href="/users/store">Back to Store Users</Link>
                </Typography>
            </Paper>
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    {(selectedFile) ? (<Image width={400} height={400} alt="" src={image} className={styles.imgObject} />)
                        : (<Image alt="" width={400} height={400} src={`${process.env.NEXT_PUBLIC_uploadURL}/users/avatar.png`} className={styles.imgObject} />)}

                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="contained" component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    return {
        props: {
            stores: data.stores
        }
    }
}

