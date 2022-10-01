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

export default function Colors({ coupons }) {
    const [data, setData] = useState([...coupons]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/coupons/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "code", headerName: "Coupon Code", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.brandName}>
                            <span>{params.row.code}</span>
                        </div>
                    </>
                );
            },
        },
        {
            field: "discount", headerName: "Discount", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.brandName}>
                            <span>{params.row.discount}%</span>
                        </div>
                    </>
                );
            }
        },
        {
            field: "isActive", headerName: "Active/Inactive", width: 250,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.brandName}>
                            <span>{params.row.isActive ? "Active" : "Inactive"}</span>
                        </div>
                    </>
                );
            }
        },
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

    const newCoupon = {
        id: "",
        code: "",
        discount: "",
        isActive: false,
    }

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [setCoupon, coupon] = useState(newCoupon);

    // clear form fields
    const clearForm = () => {
        setCoupon(newCoupon);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        // await axios
        //     .post(`${process.env.NEXT_PUBLIC_baseURL}/colors`, )
        //     .then(({ data }) => {
        //         data.success && toast.success(data.message);
        //         // clearForm();
        //     }).catch(err => toast.error(err.message));

        handleClose();
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/coupons`);
        setData(data);

    };


    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Discount Coupons</h2>
                <CreateNewIcon handleClick={handleClickOpen} />
            </div>
            <MuiGrid data={data} columns={columns} />

            {/* MODAL FORM */}
            <Modal open={open} onClose={handleClose}>
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-2/4 h-auto rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Coupon").toUpperCase() : ("New Coupon").toUpperCase()}</h2>
                        </Grid>
                        <br /><br />
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className='flex'>
                                <div className="w-5/12 mr-10">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label='Coupon Code'
                                        placeholder='Enter Coupon Code'
                                        value={coupon.code}
                                        onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
                                    />
                                    <br /><br />
                                    <Button
                                        size='small'
                                        type='submit'
                                        color='primary'
                                        variant="outlined"
                                        fullWidth>
                                        {editMode ? "Update Coupon" : "Add Coupon"}
                                    </Button>
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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/coupons`);

    // add field id in each object
    const coupons = data.map((coupon) => {
        coupon.id = coupon._id;
        return coupon;
    });

    return {
        props: {
            coupons
        },
    };
}