import React from 'react'
import { Add, DeleteOutline } from '@mui/icons-material'
import { Grid, IconButton, Paper } from '@mui/material'
import MuiGrid from 'components/MuiGrid/MuiGrid';
import styles from 'styles/ProductIndex.module.css';
import { formatDate } from 'utils/utils';
import { Link } from 'react-router-dom';

export default function VariantGrid({ setAddVariation, variation }) {
    console.log("variationin",variation);
    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "size", headerName: "Product Sizes", width: 200 },
        {
            field: "sale_price", headerName: "Sale Price", width: 180, type: "number",
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${Number(params.value).toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", width: 180, type: "number",
            valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`
        },
        // { field: "description", headerName: "Description", width: 220 },
        // { field: "dimensions", headerName: "Dimensions", width: 220 },
        {
            field: "createdAt", headerName: "Added on", width: 140, type: 'dateTime', hide: true,
            valueFormatter: (params) => formatDate(params.value ),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <div className="flex justify-center items-center">
                        {/* <Link 
                         href={`/products/${'product._id'}/${params.row._id}?size=${params.row.size}`}
                        > */}
                            <button className="h-8 w-40 rounded-md mr-5 bg-blue-700 text-white">Product Features</button>
                        {/* </Link> */}
                        <button className="h-8 w-16 rounded-md mr-5 bg-green-600 text-white" >Edit</button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            // onClick={() => handleDelete(params.row._id)}
                        />
                    </div>
                );
            },
        },
    ];
    return (
        <Grid lg={12}>
            <Paper elevation={4} className="p-10">
                <div className="flex justify-between items-center ml-5 mr-5">
                    <h2>Variations</h2>
                    <IconButton onClick={() => setAddVariation(true)}>
                        <Add />
                    </IconButton>
                </div>
                <MuiGrid columns={columns} data={variation} />
            </Paper>
        </Grid>
    )
}
