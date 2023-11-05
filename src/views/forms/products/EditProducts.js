import { useEffect, useState } from 'react';
// material-ui
import { Button, FormHelperText, Grid, Stack, TextField, Select, MenuItem } from '@mui/material';
import '@mui/lab';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
// import ProductsPage from './ProductsPage';
// import TotalCard from './TotalCard';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategory } from 'store/slices/category';

// ==============================|| CREATE INVOICE ||============================== //

function EditProduct() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState([]);

    const navigate = useNavigate();
    const { products } = useSelector((state) => state.product);
    const params = useParams();

    const { category } = useSelector((state) => state.category);
    console.log('products', products, params.id);

    useEffect(() => {
        console.log('calledd');
        if (products) {
            setValues(products.filter((item) => item.id === params.id));
            dispatch(getCategory());
        }
    }, []);

    console.log('values', values);

    const validationSchema = yup.object({
        product_name: yup.string().min(3).max(30).required('Product Name is Required'),
        product_desc: yup.string().required('Description are Required').max(30),
        product_type: yup.mixed().required('Product Type is Required')
    });

    const formik = useFormik({
        initialValues: {
            product_name: '',
            product_desc: '',
            product_type: '',
            product_type_name: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // console.log('formik.values', formik.values);
            if (values) {
                console.log('formik.values', formik.values);
                formik.values.product_type_name = formik.values.product_type.category;
                formik.values.product_type = formik.values.product_type.id;
                try {
                    setOpen(true);
                    await axios.put(`/product/${params.id}`, formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Product Updated successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/admin/products');
                } catch (error) {
                    console.log('error', error);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: error.response.data.message,
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                }
            }
        }
    });

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        },
        chip: {
            margin: 2
        }
    };

    // const makeQuery = () => {
    //     let str = '';
    //     if (getAll) str += `?client=${user?.client}&all=${getAll}`;
    //     return str;
    // };

    useEffect(() => {
        if (values.length) {
            console.log('in useeffect', values[0]);
            formik.setValues({
                product_name: values[0].product_name,
                product_desc: values[0].product_desc,
                product_type: values[0].product_type,
                product_type_name: values[0].product_type_name
            });
        }
    }, [values]);
    return (
        <>
            <MainCard title="Edit Product">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Product Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="product_name"
                                    name="product_name"
                                    autoComplete="product_name"
                                    value={formik.values.product_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Product Name..."
                                />
                            </Stack>
                            {formik.errors.product_name && <FormHelperText error>{formik.errors.product_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Product Description</InputLabel>
                                <TextField
                                    fullWidth
                                    id="product_desc"
                                    name="product_desc"
                                    autoComplete="product_desc"
                                    value={formik.values.product_desc}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Description"
                                />
                            </Stack>
                            {formik.errors.product_desc && <FormHelperText error>{formik.errors.product_desc}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Product Type</InputLabel>
                                <Select
                                    id="product_type"
                                    name="product_type"
                                    // defaultValue="Select product_type"
                                    value={formik.values.product_type}
                                    onChange={formik.handleChange}
                                    // onClick={countrydata}
                                >
                                    <MenuItem value="" disabled>
                                        Select Product Type
                                    </MenuItem>
                                    {category.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.category}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.product_type && <FormHelperText error>{formik.errors.product_type}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Update Product
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default EditProduct;
