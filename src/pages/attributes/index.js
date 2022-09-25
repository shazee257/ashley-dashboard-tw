import styles from 'styles/Brands.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import {
    Button, Grid, Paper, TextField, Modal
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import CreateNewIcon from 'components/CreateNewIcon';

export default function Colors({ colors }) {
    const [data, setData] = useState([...colors]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/colors/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "image", headerName: "Color", width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={32} width={32} className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${params.row.image}`} />
                        </div>
                    </>
                );
            },
        },
        { field: "title", headerName: "Color Name", width: 150 },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <DeleteOutline
                        className={styles.productListDelete}
                        onClick={() => handleDelete(params.row._id)}
                    />
                );
            },
        },
    ];


    // modal form working
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };

    const newColor = {
        id: "",
        title: "",
        image: "",
    }

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [color, setColor] = useState(newColor);
    const [selectedFile, setSelectedFile] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [image, setImage] = useState("");

    // clear form fields
    const clearForm = () => {
        setColor(newColor);
    }

    const fileSelectedHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) setImage(reader.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', color.title);
        fd.append('image', selectedFile);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        await axios
            .post(`${process.env.NEXT_PUBLIC_baseURL}/colors`, fd, config)
            .then(({ data }) => {
                data.success && toast.success(data.message);
                // clearForm();
            }).catch(err => toast.error(err.message));

        handleClose();
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);
        setData(data.colors);

    };


    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Product Colors</h2>
                <CreateNewIcon handleClick={handleClickOpen} />
            </div>
            <MuiGrid data={data} columns={columns} />

            {/* MODAL FORM */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-2/4 h-auto rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Color").toUpperCase() : ("New Color").toUpperCase()}</h2>
                        </Grid>
                        <br /><br />
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className='flex'>
                                <div className="w-5/12 mr-10">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label='Color Name'
                                        placeholder='Enter Color Name'
                                        value={color.title}
                                        onChange={(e) => setColor({ ...color, title: e.target.value })}
                                    />
                                    <br /><br />
                                    <div className="flex flex-col items-center justify-center">
                                        <Button
                                            size='small'
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                            component="label" >
                                            Choose Color Image
                                            <input type="file" name="image" hidden
                                                onChange={fileSelectedHandler} accept="image/*" />
                                        </Button>
                                        <div><small>Only jpg, png, gif, svg images are allowed</small></div>
                                    </div>
                                    <br />
                                    <Button
                                        size='small'
                                        type='submit'
                                        color='primary'
                                        variant="outlined"
                                        fullWidth>
                                        {editMode ? "Update Color" : "Add Color"}
                                    </Button>
                                </div>
                                <div>
                                    {(image) && <Image alt="" height={100} width={100} src={image} style={{ borderRadius: '50%', }} />}
                                </div>
                            </div>
                            <br /><br />
                            <div className="flex justify-between">
                                <Button
                                    className="w-6/12"
                                    onClick={clearForm}
                                    type='button'
                                    color='secondary'
                                    variant="outlined"
                                    fullWidth>
                                    Reset Form
                                </Button>
                                <Button
                                    className="w-6/12"
                                    size="small"
                                    onClick={handleClose}
                                    type='button'
                                    color='success'
                                    variant="outlined"
                                    fullWidth>
                                    Close Form
                                </Button>
                            </div>
                        </form>
                    </Paper>

                </div >
            </Modal>


        </div>

    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);
    return {
        props: {
            colors: data.colors,
        },
    };
}