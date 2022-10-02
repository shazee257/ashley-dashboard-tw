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
            field: "code", headerName: "Coupon Code", width: 200,
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
            field: "discount", headerName: "Discount", width: 150, type: "number",
            renderCell: (params) => {
                return (
                    <div className='flex items-center justify-center bg-blue-500 w-full rounded-md h-8'>
                        <span className='rounded-md text-white font-semibold'>{params.row.discount}%</span>
                    </div >
                );
            }
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <button
                            className="h-8 rounded-md mr-5 font-medium px-10 bg-green-600 text-white hover:bg-green-700"
                            onClick={() => editHandler(params.row.id)}>Edit</button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    // modal form working
    const newCoupon = {
        id: "",
        code: "",
        discount: "",
    }

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [coupon, setCoupon] = useState(newCoupon);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        clearForm();
        setEditMode(false);
    };



    const editHandler = (id) => {
        setEditMode(true);
        setOpen(true);
        const foundCoupon = data.find((c) => c._id === id);
        const newCoupon = {
            id: foundCoupon._id,
            code: foundCoupon.code,
            discount: foundCoupon.discount,
        }
        setCoupon(newCoupon);
    }

    // clear form fields
    const clearForm = () => {
        setCoupon(newCoupon);
    }

    const fetchCoupons = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/coupons`);
        const coupons = data.map((coupon) => {
            coupon.id = coupon._id;
            return coupon;
        });
        setData(coupons);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!coupon.code || !coupon.discount) {
            toast.warn("Please fill all fields");
            return;
        }

        if (editMode) {
            const couponData = {
                id: coupon.id,
                code: coupon.code,
                discount: coupon.discount
            }
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/coupons/${coupon.id}`, couponData)
                .then(data => {
                    data.status === "success" && toast.success(data.data.message);
                }).catch(err => toast.error(err.message));
        } else {
            const couponData = {
                code: coupon.code,
                discount: coupon.discount
            }
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/coupons`, couponData)
                .then(data => {
                    data.status === 200 && toast.success(data.data.message);
                }).catch(err => toast.error(err.message));
        }

        handleClose();
        fetchCoupons();
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
                <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-1/4 h-auto rounded-lg shadow-lg">
                    <Paper elevation={1} className="p-10 w-full">
                        <Grid align='left'>
                            <h2>{editMode ? ("Update Coupon").toUpperCase() : ("New Coupon").toUpperCase()}</h2>
                        </Grid>
                        <br /><br />
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label='Coupon Code'
                                placeholder='Enter Coupon Code'
                                value={coupon.code}
                                onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}

                            />
                            <br /><br />
                            <TextField
                                fullWidth
                                label='Discount'
                                placeholder='Enter Coupon Discount'
                                value={coupon.discount}
                                onChange={(e) => setCoupon({ ...coupon, discount: e.target.value })}
                            />
                            <br /><br />
                            <Button
                                type='submit'
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                {editMode ? "Update Coupon" : "Add Coupon"}
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