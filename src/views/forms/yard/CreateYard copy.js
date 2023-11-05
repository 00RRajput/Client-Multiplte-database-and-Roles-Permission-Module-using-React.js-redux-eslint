import { useEffect, useState } from 'react';
// material-ui
import { Button, FormHelperText, Grid, Stack, TextField, Select, MenuItem, Box, Autocomplete } from '@mui/material';
import '@mui/lab';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';
import { getCustomers } from 'store/slices/customer';
import { getProducts } from 'store/slices/product';

// // third-party
import * as yup from 'yup';
// import ProductsPage from './ProductsPage';
// import TotalCard from './TotalCard';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Map from '../../gmaps/gmaps';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// ==============================|| CREATE INVOICE ||============================== //

function CreateYard({ create }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [map, setMap] = useState(false);
    const [fields, setFields] = useState([{ id: 1, name: '', capacity: '' }]);
    const [locations, setLocations] = useState([]);
    const [customerProduct, setCustomerProduct] = useState([]);
    const { user } = useAuth();
    const { customers } = useSelector((state) => state.customer);
    const { products } = useSelector((state) => state.product);
    const [getAll, setGetAll] = useState(true);
    const navigate = useNavigate();

    const validationSchema = yup.object({
        // yardname: yup.string().min(3).max(30).required('Yard Name is Required'),
        customer: yup.string().required(),
        // product: yup.mixed().test('userRoleVal', 'Select must contain at least one product', (value) => {
        //     if (value.length) return value;
        //     return false;
        // }),
        location: yup.string().required(),
        sections: yup.array()
    });
    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    const getLocations = async () => {
        try {
            const res = await axios.get(`/location?client=${user.client_id}`);
            setLocations(res.data.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLocations();
        dispatch(getCustomers(makeQuery()));
        dispatch(getProducts(makeQuery()));
    }, []);

    const formik = useFormik({
        initialValues: {
            // yardname: '',
            customer: '',
            // product: [],
            location: '',
            sections: []
            // sections: fields.reduce((acc, field) => {
            //     acc[`section-${field.id}`] = field.value || '';
            //     acc[`size-${field.id}`] = field.size || '';
            //     return acc;
            // }, {})
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    setOpen(true);
                    console.log('formik.values', formik.values);
                    return;
                    await axios.post('/yard', formik.values);
                    resetForm();
                    // create();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Yard Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/admin/yards');
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

    // const makeQuery = () => {
    //     let str = '';
    //     if (getAll) str += `?client=${user?.client}&all=${getAll}`;
    //     return str;
    // };

    // useEffect(() => {
    //     getClients();
    //     dispatch(getDepartment(makeQuery()));
    //     dispatch(getUserConfigFields(user?.client));
    //     dispatch(getRoles(makeQuery()));
    //     // dispatch(getHub());
    // }, []);
    // let TagsError = false;
    // if (formik.touched.skills && formik.errors.skills) {
    //     if (formik.touched.skills && typeof formik.errors.skills === 'string') {
    //         TagsError = formik.errors.skills;
    //     } else if (formik.errors.skills && typeof formik.errors.skills !== 'string') {
    //         formik.errors.skills.map((item) => {
    //             if (typeof item === 'object') TagsError = item.label;
    //             return item;
    //         });
    //     }
    // }
    const handleAddField = () => {
        // console.log()
        const newFields = [...fields, { id: fields.length + 1, name: '', capacity: '', product: [] }];
        setFields(newFields);
    };

    const handleRemoveField = () => {
        const updatedFields = [...fields];
        updatedFields.splice(updatedFields.length - 1, 1);
        setFields(updatedFields);
    };

    const handleCustomerChange = async (customerId) => {
        formik.setValues('customer', customerId);
        await axios.get(`/customer/product/by-customer/${customerId}`).then((res) => {
            setCustomerProduct(res.data.data.data.product);
        });
    };

    const handleFieldChange = (id, name, value = '') => {
        // const updatedFields = fields.map((field) => (field.id === id ? { ...field, value } : field));
        const updatedFields = fields.map((field) => {
            if (field.id === id) {
                return { ...field, [name]: value };
            }
            return { ...field, [name]: field[name] || '' };
        });
        setFields(updatedFields);
        formik.setValues({
            // yardname: formik.values.yardname,
            customer: formik.values.customer,
            location: formik.values.location,
            // product: formik.values.product,
            sections: updatedFields
        });
    };

    return (
        <>
            <MainCard title="Create Section">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Location</InputLabel>
                                <Select
                                    id="location"
                                    name="location"
                                    defaultValue="Select Location"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    // onClick={countrydata}
                                >
                                    <MenuItem value="Select Location" selected disabled>
                                        Select Location
                                    </MenuItem>
                                    {locations.map((item) => (
                                        <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.location}>
                                            {item.location_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Customer</InputLabel>
                                <Select
                                    id="customer"
                                    name="customer"
                                    label="Select customer"
                                    defaultValue="Select customer"
                                    value={formik.values.customer || 'Select Customer'}
                                    // onChange={formik.handleChange}
                                    onChange={(e) => {
                                        handleCustomerChange(e.target.value)
                                    }}
                                >
                                    <MenuItem value="Select customer" selected disabled>
                                        Select Customer
                                    </MenuItem>
                                    {customers.map((item) =>
                                        item.is_active ? (
                                            <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.customer}>
                                                {item.customer_name}
                                            </MenuItem>
                                        ) : (
                                            ''
                                        )
                                    )}
                                </Select>
                                {formik.errors.customer && <FormHelperText error>{formik.errors.customer}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Stack>
                                <InputLabel required>Yard Sections</InputLabel>
                                {fields.map((field) => (
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Section Name</InputLabel>
                                                <TextField
                                                    key={field.id}
                                                    fullWidth
                                                    id={`section-${field.id}`}
                                                    name={`section-${field.id}`}
                                                    autoComplete={`section-${field.id}`}
                                                    value={field.name}
                                                    placeholder="Enter Section Name"
                                                    onInput={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Capacity</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id={`size-${field.id}`}
                                                    name={`size-${field.id}`}
                                                    autoComplete={`size-${field.id}`}
                                                    value={field.size}
                                                    placeholder="Enter Section Size"
                                                    onInput={(e) => handleFieldChange(field.id, 'capacity', e.target.value)}
                                                    style={{ marginBottom: '16px' }}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Product</InputLabel>
                                                <Autocomplete
                                                    id={`product-${field.id}`}
                                                    multiple
                                                    disablePortal
                                                    options={customerProduct}
                                                    onBlur={formik.handleBlur}
                                                    getOptionLabel={(option) => option.product_name}
                                                    // onChange={(event, newValue) => {
                                                    //     if (newValue) formik.setFieldValue('product', newValue);
                                                    //     else formik.setFieldValue('product', []);
                                                    // }}
                                                    onChange={(event, newValue) => handleFieldChange(field.id, 'product', newValue)}
                                                    renderInput={(params) => <TextField {...params} label="Select product" />}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" {...props}>
                                                            {option.product_name}
                                                        </Box>
                                                    )}
                                                />
                                                {/* {formik.errors.product && <FormHelperText error>{formik.errors.product}</FormHelperText>} */}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Stack>
                            <AddCircleIcon style={{ cursor: 'pointer' }} onClick={handleAddField} />
                            {fields.length > 1 ? <RemoveCircleIcon style={{ cursor: 'pointer' }} onClick={handleRemoveField} /> : ''}
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Yard
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateYard;
