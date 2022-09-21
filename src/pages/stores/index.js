import styles from 'styles/Stores.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { showNotification } from 'utils/helper';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Stores({ stores }) {
    const [data, setData] = useState([...stores]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/stores/${id}`)
            .then(({ data }) => showNotification('success', data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Store", width: 220,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={32} width={32} className={styles.productListImg}
                                src={params.row.banner ?
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/${params.row.banner}` :
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/store.png`} />

                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        { field: "email", headerName: "Email", width: 150 },
        { field: "phone_no", headerName: "Phone #", width: 130 },
        { field: "address", headerName: "Location", width: 230 },
        { field: "city", headerName: "City", width: 120 },
        { field: "state", headerName: "State", width: 120 },
        { field: "zip", headerName: "Zip Code", width: 130 },
        {
            field: "createdAt", headerName: "Created on", width: 150, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/stores/update/" + params.row._id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Warehouses / Stores</h2>
                <Link href="/stores/create">
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    return {
        props: {
            stores: data.stores,
        },
    };
}