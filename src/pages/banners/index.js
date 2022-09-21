import styles from 'styles/Sliders.module.css';
import axios from 'axios';
import { DeleteOutline, CloudUploadOutlined, } from "@mui/icons-material";
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import {
    Switch, Button, Grid, Paper, TextField,
    MenuItem, Checkbox, FormControlLabel, Modal
} from "@mui/material";
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateNewIcon from 'components/CreateNewIcon';

export const ModalImage = ({ src, alt, caption, onClose }) => {
    return (
        <div className={styles.modal}>
            <span className={styles.close} onClick={onClose}>
                &times;
            </span>
            <Image width={1000} height={500} alt="" className={`${styles}.modal-content`} src={src} />
            {caption.length > 0 && <div className={styles.caption}>{caption}</div>}
        </div>
    )
}

export default function Banners({ banners }) {
    const [data, setData] = useState([...banners]);
    const [isOpen, setIsOpen] = useState(false)
    const showModal = () => setIsOpen(true)
    const [bannerData, setBannerData] = useState();
    const [fileToUpload, setFileToUpload] = useState("");

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const getBanners = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/banners/all`);
        setData(data.banners);
    }

    const handleEnabled = async (bannerId, status) => {
        await axios.put(`${process.env.NEXT_PUBLIC_baseURL}/banners/status/${bannerId}`, { status })
            .then(({ data }) => {
                data.success && toast.success(data.message);
            });
        getBanners();
    }

    const uploadHandler = async (id) => {
        if (!fileToUpload) {
            toast.warn("Please select files to upload");
            return;
        }

        const fd = new FormData();
        fd.append("image", fileToUpload);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } }

        await axios
            .post(`${process.env.NEXT_PUBLIC_baseURL}/banners/${id}/image`, fd, config)
            .then(({ data }) => {
                data.success && toast.success(data.message);
            }).catch(err => toast.error(err.response?.data?.message));

        setFileToUpload("");
        getBanners();
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Title", width: 190,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={32} width={32}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_thumbURL}/banners/${params.row.image}`}
                                onClick={() => { showModal(); setBannerData(params.row) }} />
                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        { field: "description", headerName: "Description", width: 250 },
        {
            field: "url", headerName: "Link", width: 120,
            renderCell: (params) => {
                return (
                    <div className='flex h-8 items-center bg-blue-600 text-white rounded px-5'>
                        <a href={params.row.url} target="_blank" rel="noreferrer">Visit Link</a>
                    </div>
                );
            }
        },
        {
            field: "type", headerName: "Banner Type", width: 140,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.type === 'slider' &&
                            <div className='uppercase flex h-8 items-center justify-center bg-green-600 text-white rounded w-24'>
                                Slider
                            </div>
                        }
                        {params.row.type === 'custom' &&
                            <div className='uppercase flex h-8 items-center justify-center bg-yellow-900 text-white rounded w-24'>
                                Banner
                            </div>
                        }
                        {params.row.type === 'category' &&
                            <div className='uppercase flex h-8 items-center justify-center bg-fuchsia-800 text-white rounded w-24'>
                                Category
                            </div>
                        }
                    </>
                );
            }
        },
        {
            field: "category_id", headerName: "Category", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.category_id && params.row.category_id.title}
                    </>
                );
            }
        },
        {
            field: "upload", headerName: "Upload Images", width: 300,
            renderCell: (params) => {
                return (
                    <>
                        <Button variant="text" component="label" >
                            <input
                                style={{ background: '#00aaff' }}
                                type="file"
                                name="image"
                                className={styles.productListEdit}
                                onChange={(e) => setFileToUpload(e.target.files[0])}
                                accept="image/webp, image/*"
                            />
                        </Button>
                        <CloudUploadOutlined className="cursor-pointer mr-10 h-5 w-5"
                            onClick={() => uploadHandler(params.row._id)}
                        />
                    </>
                )
            }
        },
        {
            field: "createdAt", headerName: "Created on", width: 130, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "is_active", headerName: "Active", width: 120,
            renderCell: (params) => {
                return (
                    <Switch
                        checked={params.row.is_active}
                        onChange={() => handleEnabled(params.row._id, params.row.is_active)}
                        name="checkedB"
                        color="primary"
                    />
                );
            }
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 140,
            renderCell: (params) => {
                return (
                    <div className="w-32 flex items-center justify-between">
                        <button
                            className="text-white h-8 w-20 rounded-md bg-green-700"
                            onClick={() => editHandler(params.row.id)}>Edit</button>
                        <DeleteOutline
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDelete(params.row._id)} />
                    </div>
                );
            },
        },
    ];

    // modal form code starts here
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const editHandler = (id) => {
        setEditMode(true);
        setOpen(true);
        const banner = data.find((b) => b._id === id);
        const newBanner = {
            id: banner._id,
            title: banner.title,
            description: banner.description,
            image: banner.image,
            url: banner.url,
            type: banner.type,
            category_id: banner.category_id ? banner.category_id._id : '',
            is_active: banner.is_active ? 1 : 0,
        }
        setBanner(newBanner);
    }

    const newBanner = {
        id: "",
        title: "",
        description: "",
        image: "",
        url: "",
        type: "",
        category_id: "",
        is_active: 1,
    }

    const [categories, setCategories] = useState([]);
    const [banner, setBanner] = useState(newBanner);

    const getCategories = async (e) => {
        const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/fetch/categories`);
        setCategories(categoriesData.data.categories);
    }

    useEffect(() => {
        getCategories();
    }, []);

    // clear form fields
    const clearForm = () => {
        setBanner(newBanner);
    }

    const categorySelectHandler = async (e) => {
        setBanner({ ...banner, category_id: e.target.value });
    }

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
        setSelectedFile(null);
        setBanner(newBanner);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!banner.image || !banner.type) {
            toast.error('All fields are required');
            return;
        }

        if (editMode) {
            const bannerObj = {
                title: banner.title,
                description: banner.description,
                url: banner.url,
                type: banner.type,
                category_id: banner.category_id,
                is_active: banner.is_active ? true : false,
            }
            // return console.log("bannerObj", bannerObj);
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/banners/${banner.id}`, bannerObj)
                .then(({ data }) => {
                    toast.success(data.message);
                    clearForm();
                }).catch(err => toast.error(err.response.data.message));
        } else {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const fd = new FormData();
            fd.append('title', banner.title);
            fd.append('description', banner.description);
            fd.append('image', selectedFile);
            fd.append('url', banner.url);
            fd.append('type', banner.type);
            fd.append('category_id', banner.category_id);
            fd.append('is_active', banner.is_active ? true : false);

            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/banners`, fd, config)
                .then(({ data }) => {
                    data.success && toast.success(data.message);
                    clearForm();
                }).catch(err => toast.error(err.response.data.message));
        }

        getBanners();
        handleClose();
    };

    const [filename, setFilename] = useState("Choose Image");
    const [selectedFile, setSelectedFile] = useState("");

    const fileSelectedHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) setBanner({ ...banner, image: reader.result });
        }
        reader.readAsDataURL(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }


    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>All Banners</h2>
                <CreateNewIcon handleClick={handleClickOpen} />
            </div>
            <MuiGrid data={data} columns={columns} />

            <div className={styles.App}>
                {isOpen &&
                    (<ModalImage
                        src={`${process.env.NEXT_PUBLIC_uploadURL}/banners/${bannerData.image}`}
                        alt={bannerData.title}
                        caption={bannerData.title}
                        onClose={() => setIsOpen(false)}
                    />)}
            </div>

            {/* Modal form - Create Update */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-2/4 h-auto rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Banner").toUpperCase() : ("New Banner").toUpperCase()}</h2>
                        </Grid>
                        <br /><br />
                        <form autoComplete="off">
                            <div className="flex justify-between mb-3">
                                <TextField className="w-3/12"
                                    size="small"
                                    fullWidth
                                    label='Banner Title' placeholder='Enter Banner Name'
                                    value={banner.title}
                                    onChange={(e) => setBanner({ ...banner, title: e.target.value })} />
                                <TextField className="w-8/12"
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    fullWidth
                                    label='Banner Description' placeholder='Enter Banner Description'
                                    value={banner.description}
                                    onChange={(e) => setBanner({ ...banner, description: e.target.value })} />
                            </div>
                            <div className="flex justify-between mb-3">
                                <FormControlLabel
                                    className="w-3/12"
                                    control={<Checkbox checked={banner.is_active}
                                        onChange={(e) => setBanner({ ...banner, is_active: e.target.checked })}
                                        size="small" />}
                                    label="Live on Home Page" />

                                <TextField
                                    className="w-8/12"
                                    size="small"
                                    label='URL' placeholder='Banner URL'
                                    value={banner.url}
                                    onChange={(e) => setBanner({ ...banner, url: e.target.value })} />
                            </div>
                            <div className="flex justify-between mb-3">
                                <TextField
                                    className="w-3/12"
                                    fullWidth
                                    size="small"
                                    label="Select Banner Type"
                                    select
                                    value={banner.type}
                                    onChange={(e) => setBanner({ ...banner, type: e.target.value })} >
                                    <MenuItem value='slider' key="slider">Slider</MenuItem>
                                    <MenuItem value='category' key="category">Category Banner</MenuItem>
                                    <MenuItem value='custom' key="custom">Custom Banner</MenuItem>
                                </TextField>
                                {banner.type === 'category' && (
                                    <TextField
                                        className="w-8/12"
                                        fullWidth
                                        size="small"
                                        label="Select Category"
                                        select
                                        value={banner.category_id} onChange={categorySelectHandler}>
                                        {categories.map((category) => (
                                            category.children.map((child) => (
                                                <MenuItem key={child._id} value={child._id}>
                                                    <div className="flex ">
                                                        <div className="flex items-center mr-2">
                                                            {category.image &&
                                                                <Image alt="" height={32} width={32}
                                                                    className="rounded-full" layout="fixed"
                                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {category.title}
                                                        </div>
                                                        <DoubleArrowOutlinedIcon className="flex items-center mx-5 mt-1" />
                                                        <div className="flex items-center mr-2">
                                                            {category.image &&
                                                                <Image alt="" height={32} width={32} layout="fixed"
                                                                    className="rounded-full"
                                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${child.image}`} />}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {child.title}
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            ))
                                        ))}
                                    </TextField>
                                )}
                            </div>
                            {editMode && (
                                <div key={banner.image} className="mb-3 flex justify-center mt-5">
                                    <Image alt=""
                                        className="flex rounded-lg"
                                        layout='fixed' height={220} width={850}
                                        src={`${process.env.NEXT_PUBLIC_uploadURL}/banners/${banner.image}`}
                                    />
                                </div>
                            )}
                            {selectedFile && (
                                <div key={banner.image} className="mb-3 flex justify-center mt-5">
                                    <Image alt=""
                                        className="flex rounded-lg"
                                        layout='fixed' height={220} width={850} src={banner.image}
                                    />
                                </div>
                            )}

                            {!editMode && (
                                <div className="flex flex-col place-items-center">
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        component="label">
                                        Choose Images
                                        <input
                                            type="file"
                                            name="image" hidden
                                            onChange={fileSelectedHandler}
                                            accept="image/*" />
                                    </Button>
                                    <div><small>Only jpg, png, gif, svg images are allowed</small></div>
                                </div>
                            )}
                            <br />
                            <Button
                                onClick={handleSubmit}
                                type='submit'
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                {editMode ? "Update Banner" : "Add Banner"}
                            </Button>
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
                        <br /><br />
                    </Paper>
                </div >
            </Modal >



        </div >
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/banners/all`);
    return {
        props: {
            banners: data.banners,
        },
    };
}