import styles from 'styles/UsersStore.module.css';
import axios from 'axios';
import { DeleteOutline, Phone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminUsers({ users }) {
    const [data, setData] = useState(users);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/users/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "first_name", headerName: "Store User", width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            {params.row.image ? <Image alt="" height={32} width={32} className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_thumbURL}/users/${params.row.image}`} />
                                : <Image alt="" height={32} width={32} src={`${process.env.NEXT_PUBLIC_uploadURL}/users/avatar.png`} />
                            }
                        </div>
                        {`${params.row.first_name} ${params.row.last_name}`}
                    </>
                );
            },
        },
        { field: "email", headerName: "email", width: 200 },
        {
            field: "store_id.title", headerName: "Store / Franchise", width: 210,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image alt="" height={32} width={32} className={styles.productListImg}
                                src={params.row.store_id.banner ?
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/${params.row.store_id.banner}` :
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/store.png`} />
                        </div>
                        {`${params.row.store_id.title}`}
                    </>
                );
            },
        },
        {
            field: "phone_no", headerName: "Phone #", width: 180,
            renderCell: (params) => {
                return (
                    <>
                        {(params.row.phone_no) && (
                            <div className={styles.productListItem}>
                                <Phone className={styles.phoneIcon} />
                                <button className={styles.phoneNoButton}>{params.row.phone_no}</button>
                            </div>)}
                    </>
                );
            }
        },
        {
            field: "createdAt", headerName: "Created on", width: 150, type: "dateTime",
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/users/store/update/" + params.row.id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Warehouse/Store Users</h2>
                <Link href="/users/store/create">
                    <Button
                        variant="contained"
                        color="primary"
                        component="label"
                        className={styles.createNewLink}
                    >Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/users/`);
    const users = data.users.filter((item) => item.role === "store");
    return {
        props: {
            users
        },
    };
}