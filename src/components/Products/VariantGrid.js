import React from 'react'
import { Add, DeleteOutline } from '@mui/icons-material'
import { Grid, IconButton, Paper } from '@mui/material'
import MuiGrid from 'components/MuiGrid/MuiGrid';
import styles from 'styles/ProductIndex.module.css';
import { formatDate } from 'utils/utils';
import { Link } from 'react-router-dom';

export default function VariantGrid({ variant, setAddVariation, variation, setVariant, setVariation }) {

    const variantEditHandler = (row) => {
        let findRow = variation.find((list) => list.id === row.id);
        setVariant(variant => ({
            id: row.id,
            size: row.size,
            sale_price: row.sale_price,
            purchase_price: row.purchase_price,
            description: findRow.description,
            dimensions: findRow.dimensions,
            edit: true
        }))
    }
    const handleDelete = (id) => {
        let detail = variation.filter((a, index) => a.id !== id);
        setVariation(detail)
    }

    const columns = [
        { field: "id", headerName: "ID", hide: true },
        { field: "size", headerName: "Product Sizes", flex: 1, },
        {
            field: "sale_price", headerName: "Sale Price", type: "number", headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${Number(params.value).toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", type: "number", headerAlign: 'center', align: 'center', flex: 1,
            valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`
        },
        {
            field: "action", filterable: false, sortable: false, headerAlign: 'center', align: 'center', flex: 1,
            headerName: "Action",

            renderCell: (params) => {
                return (
                    <div className="flex justify-center items-center">
                        <button className="h-8 w-16 rounded-md mr-5 bg-green-600 text-white" onClick={() => variantEditHandler(params?.row)}>
                            Edit
                        </button>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row.id)}
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
                <MuiGrid columns={columns} data={variation} className='w-full' />
            </Paper>
        </Grid>
    )
}
