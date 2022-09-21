import styles from 'styles/Brands.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import { Button } from '@mui/material';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showNotification } from 'utils/helper';
import { useRouter } from "next/router";

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);
    return {
        props: {
            brands: data.brands
        }
    }
}

export default function Brands({ brands }) {
    const [data, setData] = useState([...brands]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/brands/${id}`)
            .then(({ data }) => showNotification('success', data.message));
        setData(data.filter((brand) => brand._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Brand", width: 320,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={32} width={32} className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${params.row.image}`} />
                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        { field: "description", headerName: "Description", width: 500 },
        {
            field: "createdAt", headerName: "Created on", width: 150,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/brands/update/" + params.row._id}>
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
                <h2>Brands</h2>
                <Link href="/brands/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}