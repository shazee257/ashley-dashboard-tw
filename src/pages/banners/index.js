import styles from 'styles/Sliders.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import { Button, Switch } from "@mui/material";
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showNotification } from 'utils/helper';

export const Modal = ({ src, alt, caption, onClose }) => {
    return (
        <div className={styles.modal}>
            <span className={styles.close} onClick={onClose}>
                &times;
            </span>
            <img className={`${styles}.modal-content`} src={src} alt={alt} />
            {caption.length > 0 && <div className={styles.caption}>{caption}</div>}
        </div>
    )
}

export default function Banners({ banners }) {
    const [data, setData] = useState([...banners]);
    const [isOpen, setIsOpen] = useState(false)
    const showModal = () => setIsOpen(true)
    const [banner, setBanner] = useState();

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${id}`)
            .then(({ data }) => showNotification('success', data.message));
        setData(data.filter((item) => item._id !== id));
    }

    const handleEnabled = async (bannerId, status) => {
        await axios.put(`${process.env.NEXT_PUBLIC_baseURL}/banners/status/${bannerId}`, { status })
            .then(({ data }) => {
                data.success && showNotification('success', data.message);
            });
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/banners/all`);
        setData(data.banners);
    }


    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Title", width: 190,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_thumbURL}/banners/${params.row.image}`}
                                onClick={() => { showModal(); setBanner(params.row) }} />
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
                        {params.row.type === 'slider' &&
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
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/sliders/update/" + params.row._id}>
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
                <h2 className={styles.productTitle}>All Banners</h2>
                <Link href="/sliders/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />

            <div className={styles.App}>
                {isOpen &&
                    (<Modal
                        src={`${process.env.NEXT_PUBLIC_uploadURL}/banners/${banner.image}`}
                        alt={banner.title}
                        caption={banner.title}
                        onClose={() => setIsOpen(false)}
                    />)}
            </div>
        </div>
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