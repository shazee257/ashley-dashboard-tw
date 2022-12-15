import React from 'react'
import { CloudUploadOutlined, DeleteOutline } from '@mui/icons-material';
import { Button, Grid, IconButton, Paper } from '@mui/material';
import MuiGrid from 'components/MuiGrid/MuiGrid';
import Image from 'next/image';
import styles from 'styles/ProductFeatures.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeatureGrid = ({
  setFeatures,
  features,
  feature,
  setFeature,
  colors,
  variant,
  product,
  variationArray,
  setFilesToUpload,
  filesToUpload,
  editMode
}) => {


  const featureEditHandler = (row) => {
    let findRow = features.find((list) => list.id === row.id);
    setFeature({
      id: row.id,
      _id: row._id,
      variant: row.variant,
      color_id: row.color_id,
      quantity: row.quantity,
      sku: row.sku,
      zero_stock_msg: row.zero_stock_msg,
      images: row.images,
      edit: true
    })
  }
  const handleDelete = (id) => {
    let detail = features.filter((a, index) => a.id !== id);
    setFeatures(detail)
  }

  const uploadHandler = async (id) => {
    // if files not selected
    if (filesToUpload.length === 0) {
      toast.warn("Please select files to upload");
      return;
    }
    let Id = ''
    let findVariantId = variationArray.map((res) => {
      res.features.map((fea) => {
        if (fea._id === id) {
          Id = res._id
        }
      })
    })

    const fd = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      fd.append("files", filesToUpload[i]);
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    await axios
      .put(`${process.env.NEXT_PUBLIC_baseURL}/products/upload/${product.id}/${Id}/${id}`, fd, config)
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.message);
          setFilesToUpload([]);
        }
      }).catch(err => toast.error(err.message));
  }


  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true, flex: 1 },
    {
      field: "color_id", headerName: "Color", width: 150, flex: 1,
      renderCell: (params) => {
        let id = editMode ? params.row.color_id._id : params.row.color_id
        let color = colors.find((list) => list._id ===  id)
        return (
          <>
            {color?.title}
          </>
        )
      }
    },
    {
      field: "images", headerName: "Feature Images", width: 220, flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.row.images.map((item, index) => {
              return (
                <div key={index} className={styles.productListItem}>
                  <Image alt="" height={26} width={26}
                    className={styles.productListImg}
                    src={`${process.env.NEXT_PUBLIC_thumbURL}/products/${item}`}
                    onClick={() => setImage(item)} />
                </div>
              )
            })}
          </>
        )
      }


    },
    { field: "quantity", headerName: "Quantity", width: 100, flex: 1 },
    { field: "sku", headerName: "SKU", width: 130, flex: 1 },
    {
      field: "upload", headerName: "Upload Images", width: 300,
      renderCell: (params) => {
        return (
          <>
            <Button variant="text" component="label" >
              <input
                style={{ background: '#00aaff' }}
                type="file"
                multiple
                name="image"
                className={styles.productListEdit}
                onChange={(e) => setFilesToUpload(e.target.files)}
                accept="image/webp, image/*"
              />
            </Button>
            <CloudUploadOutlined className={styles.UploadIcon}
              onClick={() => uploadHandler(params.row._id)}
            />
          </>
        )
      }
    },
    {
      field: "action", filterable: false, sortable: false, flex: 1,
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button className="h-8 w-16 rounded-md mr-5 bg-green-600 text-white"
              onClick={() => featureEditHandler(params.row)}
            >
              Edit
            </button>
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
    <div>
      <Grid lg={12}>
        <Paper elevation={4} className="p-10">
          <div className="flex justify-between items-center ml-5 mr-5">
            <h2>Features</h2>
          </div>
          <MuiGrid columns={columns} data={features} className='w-full' />
        </Paper>
      </Grid>
    </div>
  )
}

export default FeatureGrid