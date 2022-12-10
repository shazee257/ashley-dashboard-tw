import { Add } from '@mui/icons-material'
import { Grid, IconButton, Paper } from '@mui/material'
import React from 'react'

export default function VariantGrid({setAddVariation}) {
    return (
        <Grid lg={12}>
            <Paper elevation={4} className="p-10">
                <div className="flex justify-between items-center ml-5 mr-5">
                    <h2>Variations</h2>
                    <IconButton onClick={() => setAddVariation(true)}>
                        <Add />
                    </IconButton>
                </div>
            </Paper>
        </Grid>
    )
}
