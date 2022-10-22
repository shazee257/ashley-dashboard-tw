import styles from 'styles/Brands.module.css';
import axios from 'axios';
import {
    Button, Modal
} from '@mui/material';
import MuiGrid from 'components/MuiGrid/MuiGrid';
import { useState, useRef, useEffect } from 'react';
const { formatDate } = require("utils/utils");
import ReactToPdf from 'react-to-pdf';


export default function Orders({ orders }) {
    const [data, setData] = useState([...orders]);

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "createdAt", headerName: "Order Date", width: 100, type: "date",
            valueFormatter: (params) => formatDate(params.value),
        },
        { field: "customer_name", headerName: "Customer Name", width: 150 },
        { field: "customer_email", headerName: "Customer Email", width: 180 },
        {
            field: "total_amount", headerName: "Amount", width: 100, type: "number",
            renderCell: (params) => <strong className='text-blue-900 text-lg'>$ {params.value}</strong>
        },
        {
            field: "status", headerName: "Status", width: 150,
            renderCell: (params) =>
                <>
                    {params.value === 'pending' && <span className='bg-yellow-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{params.value.toUpperCase()}</span>}
                    {params.value === 'processing' && <span className='bg-blue-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{params.value.toUpperCase()}</span>}
                    {params.value === 'delivered' && <span className='bg-green-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{params.value.toUpperCase()}</span>}
                    {params.value === 'cancelled' && <span className='bg-red-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{params.value.toUpperCase()}</span>}

                </>





        },
        {
            field: "updatedAt", headerName: "Last Updated on", width: 150, type: "date",
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <Button variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOrderView(params.row.id)}
                    >View Order
                    </Button>
                );
            },
        },
    ];

    const handleOrderView = (id) => {
        const order = data.find((item) => item.id === id);
        setOrder(order);
        setOpen(true);
    };

    // modal form working
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState({});
    const handleClose = () => {
        setOpen(false);
        setOrder({});
    };

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Orders</h2>
            </div>
            <MuiGrid data={data} columns={columns} />

            {/* MODAL FORM FOR VIEW ORDER DETAILS*/}
            <Modal open={open} onClose={handleClose}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 w-auto h-auto rounded-lg shadow-lg">
                    <ReactToPdf>
                        {({ toPdf, targetRef }) => (
                            <div className="bg-gray-200 w-auto h-auto rounded-lg shadow-lg pb-5" ref={targetRef}>
                                <div className="flex flex-col w-full p-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <h2></h2>
                                        <h2 className="text-xl font-semibold">Order Information</h2>
                                        <button onClick={handleClose} className="focus:outline-none">
                                            <svg className="w-6 h-6 text-gray-500 hover:text-gray-600" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-col w-full mt-4 mb-5">
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-col w-full mt-">
                                                <div className="flex flex-row items-center">
                                                    <h2 className="text-base font-semibold mr-5">STATUS</h2>
                                                    {order.status === 'pending' && <span className='bg-yellow-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{order.status.toUpperCase()}</span>}
                                                    {order.status === 'processing' && <span className='bg-blue-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{order.status.toUpperCase()}</span>}
                                                    {order.status === 'delivered' && <span className='bg-green-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{order.status.toUpperCase()}</span>}
                                                    {order.status === 'cancelled' && <span className='bg-red-600 font-bold w-32 flex justify-center rounded-md text-yellow-300'>{order.status.toUpperCase()}</span>}
                                                </div>
                                                <div className="flex flex-row justify-between items-center">
                                                    <h2 className="text-base font-semibold">Order ID: {order.id} </h2>
                                                    <h2 className="text-base font-semibold">Order Date: {formatDate(order.createdAt)}</h2>
                                                </div>
                                                <div className="flex justify-between mt-4">
                                                    <span className="text-base font-semibold">Customer : {order.customer_name}</span>
                                                    <h2 className="text-base font-semibold">Email : {order.customer_email}</h2>
                                                    {order.customer_phone && <h2 className="text-base font-semibold">Phone # : {order.customer_phone}</h2>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full mt-4">
                                            {/* <hr className="border-gray-500" /> */}
                                            <h2 className="text-lg font-semibold text-center">{`Order Items`.toUpperCase()}</h2>
                                            <hr className="border-gray-500" />
                                            <div className="flex flex-col w-full">
                                                <table className="table-auto w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Product</th>
                                                            <th className="px-4 py-2">Size</th>
                                                            <th className="px-4 py-2">Color</th>
                                                            <th className="px-4 py-2">SKU</th>
                                                            <th className="px-4 py-2">Qty</th>
                                                            <th className="px-4 py-2">Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.products && order.products.map((p) => (
                                                            <tr key={p._id}>
                                                                <td className="border px-4 py-2 text-sm whitespace-nowrap ">{p.title}</td>
                                                                <td className="border px-4 py-2 text-center">{p.size}</td>
                                                                <td className="border px-4 py-2 text-center">{p.color}</td>
                                                                <td className="border px-4 py-2 text-center">{p.sku}</td>
                                                                <td className="border px-4 py-2 text-center">{p.quantity}</td>
                                                                <td className="border px-4 py-2 text-right">${p.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <hr className="border-gray-500" />
                                        </div>
                                        <div className="flex flex-row justify-between items-center mt-2 mb-2">
                                            {order.shipping_price && <h2 className="text-base font-semibold">Shipping Price: ${order.shipping_price}</h2>}
                                            <h2 className="text-lg font-semibold bg-yellow-600 w-32 flex justify-center rounded-md text-yellow-300">Total: ${order.total_amount}</h2>
                                        </div>
                                        <hr className="border-gray-500" />
                                        {/* Shipping Address */}
                                        <div className="flex flex-col w-full mt-4">
                                            <h2 className="text-lg font-semibold text-center">{`Shipping Address`.toUpperCase()}</h2>
                                            <hr className="border-gray-500" />
                                            <div className="flex flex-col w-full">
                                                <table className="table-auto w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Address</th>
                                                            <th className="px-4 py-2">Unit</th>
                                                            <th className="px-4 py-2">City</th>
                                                            <th className="px-4 py-2">State</th>
                                                            <th className="px-4 py-2">Zip</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border px-4 py-2 text-sm whitespace-nowrap">{order.shipping_address?.address}</td>
                                                            <td className="border px-4 py-2 text-center">{order.shipping_address?.unit}</td>
                                                            <td className="border px-4 py-2 text-center">{order.shipping_address?.city}</td>
                                                            <td className="border px-4 py-2 text-center">{order.shipping_address?.state}</td>
                                                            <td className="border px-4 py-2 text-center">{order.shipping_address?.zip_code}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <hr className="border-gray-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mx-5">
                                    <Button
                                        onClick={toPdf}
                                        type='button'
                                        color='primary'
                                        variant="outlined"
                                        fullWidth>
                                        Export to PDF
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ReactToPdf>

                </div>
            </Modal>
        </div>

    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/orders`);
    const orders = data.orders.map(order => {
        order.id = order._id;
        return order;
    });
    return {
        props: {
            orders
        },
    };
}