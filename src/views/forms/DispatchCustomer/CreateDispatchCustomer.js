// material-ui
import {
    Button,
    FormHelperText,
    Grid,
    Stack,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Chip,
    FormControl,
    Autocomplete,
    Box
} from '@mui/material';
import '@mui/lab';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch } from 'store';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { values } from 'lodash';
import { Category } from '@mui/icons-material';
import { getCustomers } from 'store/slices/customer';

// yup validation-schema
const validationSchema = yup.object({
    customer: yup.string().required('Customer Name is Required'),

    dispatch_type: yup.string().required('Dispatch type is required'),

    dispatch_customer: yup.string().required('Dispatch Customer is required'),

    address: yup.string().required('Address is required'),

    pin_code: yup.string().required('PIN Code is required'),

    gst_no: yup.string().required('GST No.  is required'),

    // country: yup.string().required('Country is required'),

    state: yup.string().required('State is required'),

    city: yup.string().required('City is required')

    // category: yup.mixed().required('Category is required')
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateCustomer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [country, setCountry] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const { customers } = useSelector((state) => state.customer);

    const { user } = useAuth();
    console.log('user', user);

    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setCountry(res.data.data.country);
    };

    const getStates = async (data) => {
        try {
            if (data && !data.country_id) setStates([]);
            let queryString = '';
            if (data?.country_id) queryString += `?country_id=${data.country_id}&`;
            else if (data?.state_id)
                // eslint-disable-next-line no-unused-expressions
                queryString ? (queryString += `state_id=${data.state_id}`) : (queryString += `?state_id=${data.state_id}`);
            const response = await axios.get(`/location/state${queryString}`);
            setStates(response.data.data.state);
        } catch (error) {
            console.log(error);
        }
    };

    const getCities = async (data) => {
        try {
            if (data && !data.country_id) setCities([]);
            let queryString = '';
            if (data?.country_id) queryString += `?country_id=${data.country_id}&`;
            else if (data?.state_id)
                // eslint-disable-next-line no-unused-expressions
                queryString ? (queryString += `state_id=${data.state_id}`) : (queryString += `?state_id=${data.state_id}`);
            const response = await axios.get(`/location/city${queryString}`);
            setCities(response.data.data.city);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // getCountry();
        getStates({ country_id: '101' });
        dispatch(getCustomers());
    }, []);

    const formik = useFormik({
        initialValues: {
            dispatch_type: '',
            customer: '',
            customer_name: '',
            dispatch_customer: '',
            // country: '',
            // country_name: '',
            state: '',
            state_name: '',
            address: '',
            city: '',
            city_name: '',
            pin_code: '',
            gst_no: ''
            // category: []
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    // setOpen(true);
                    console.log('val', formik.values);
                    await axios.post('/dispatch/customer', formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Dispatch Customer Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/admin/dispatch/type/customer');
                } catch (error) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: error.message,
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

    return (
        <>
            <MainCard
                title="Create Dispatch Customer"
                secondary={
                    <Grid item>
                        <Button
                            sm={3}
                            variant="contained"
                            onClick={() => {
                                navigate('/admin/dispatch/type/customer');
                            }}
                        >
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    </Grid>
                }
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small" variant="outlined">
                                <InputLabel id="Select-Service-Type">Select Dispatch Type</InputLabel>
                                <Select
                                    labeId="Select-Dispatch-Type"
                                    id="dispatch_type"
                                    name="dispatch_type"
                                    label="Select Dispatch Type"
                                    size="large"
                                    placeholder="Select Dispatch Type"
                                    // defaultValue="Select Service Type"
                                    value={formik.values.dispatch_type}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="inPlant">Stock Transfer</MenuItem>
                                    <MenuItem value="Domestic">Sales</MenuItem>
                                    <MenuItem value="InterNational">Export</MenuItem>
                                    <MenuItem value="InterNational">Return</MenuItem>
                                </Select>
                                {formik.errors.dispatch_type && <FormHelperText error>{formik.errors.dispatch_type}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                options={customers}
                                getOptionLabel={(option) => option.customer_name}
                                size="large"
                                onBlur={() => formik.setFieldTouched('customer', formik.touched.customer)}
                                onChange={(event, newValue) => {
                                    if (newValue?.id) {
                                        console.log(newValue);
                                        formik.setFieldValue('customer', newValue.id);
                                        formik.setFieldValue('customer_name', newValue.customer_name);
                                    } else formik.setFieldValue('customer', '');
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select a Customer"
                                        error={formik.touched.customer && Boolean(formik.errors.customer)}
                                        helperText={formik.touched.customer && formik.errors.customer}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.customer_name}
                                    </Box>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {/* <Stack> */}
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label="Enter Dispatch Customer"
                                    id="dispatch_customer"
                                    name="dispatch_customer"
                                    autoComplete="new-password"
                                    value={formik.values.dispatch_customer}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Dispatch Customer..."
                                />
                                {/* </Stack> */}
                                {formik.errors.dispatch_customer && (
                                    <FormHelperText error>{formik.errors.dispatch_customer}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                options={country}
                                getOptionLabel={(option) => option.name}
                                size="large"
                                onBlur={() => formik.setFieldTouched('country', formik.touched.country)}
                                onChange={(event, newValue) => {
                                    if (newValue?.country_id) {
                                        formik.setFieldValue('country', newValue?.country_id);
                                        formik.setFieldValue('country_name', newValue?.name);
                                        getStates({ country_id: newValue?.country_id });
                                        // getCities({ country_id: newValue?.country_id });
                                    } else formik.setFieldValue('country', '');
                                    formik.setFieldValue('state', '');
                                    formik.setFieldValue('city', '');
                                }}
                                isOptionEqualToValue={(option, value) => option.country_id === value.country_id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select a country"
                                        error={formik.touched.country && Boolean(formik.errors.country)}
                                        helperText={formik.touched.country && formik.errors.country}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.emoji} {option.name}
                                    </Box>
                                )}
                            />
                        </Grid> */}
                        {/* {formik.values.country && ( */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                options={states}
                                getOptionLabel={(option) => option.name || ''}
                                size="large"
                                key={values.country}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        formik.setFieldValue('state', newValue?.state_id);
                                        formik.setFieldValue('state_name', newValue.name);
                                        getCities({ state_id: newValue?.state_id });
                                    } else {
                                        formik.setFieldValue('state', '');
                                        formik.setFieldValue('state_name', '');

                                        formik.setFieldValue('city', '');
                                        formik.setFieldValue('city_name', '');
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select a state" />}
                                isOptionEqualToValue={(option, value) => option.state_id === value.state_id}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                            />
                        </Grid>
                        {/* )} */}
                        {/* Cities */}
                        {/* {formik.values.state && ( */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                options={cities}
                                getOptionLabel={(option) => option.name || ''}
                                size="large"
                                key={values.state}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        formik.setFieldValue('city', newValue?.city_id);
                                        formik.setFieldValue('city_name', newValue?.name);
                                    } else {
                                        formik.setFieldValue('city', '');
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select a city" />}
                                isOptionEqualToValue={(option, value) => option.city_id === value.city_id}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                            />
                        </Grid>
                        {/* )} */}
                        <Grid item xs={12} md={4}>
                            <Stack>
                                {/* <InputLabel required>Address</InputLabel> */}
                                <TextField
                                    fullWidth
                                    id="address"
                                    label="Enter Address"
                                    name="address"
                                    autoComplete="new-password"
                                    value={formik.values.address}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Address..."
                                />
                            </Stack>
                            {formik.errors.address && <FormHelperText error>{formik.errors.address}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                {/* <InputLabel required>PIN Code</InputLabel> */}
                                <TextField
                                    fullWidth
                                    id="pin"
                                    name="pin_code"
                                    label="Enter PIN Code"
                                    autoComplete="new-password"
                                    value={formik.values.pin_code}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Address..."
                                />
                            </Stack>
                            {formik.errors.pin_code && <FormHelperText error>{formik.errors.pin_code}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                {/* <InputLabel required>GST No.</InputLabel> */}
                                <TextField
                                    fullWidth
                                    id="gst"
                                    name="gst_no"
                                    label="Enter GST No."
                                    autoComplete="new-password"
                                    value={formik.values.gst_no}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter GST No. ..."
                                />
                            </Stack>
                            {formik.errors.gst_no && <FormHelperText error>{formik.errors.gst_no}</FormHelperText>}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Dispatch Customer
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateCustomer;
