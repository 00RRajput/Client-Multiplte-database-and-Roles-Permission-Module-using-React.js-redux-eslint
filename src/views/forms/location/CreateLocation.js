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

// ==============================|| CREATE INVOICE ||============================== //

function CreateProduct() {
    const dispatch = useDispatch();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState([]);
    const [states, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    const validationSchema = yup.object({
        location_name: yup.string().min(3).max(30).required('Location Name is Required'),
        address: yup.string().required('Address is Required').max(30),
        country: yup.string().required('Country is Required'),
        state: yup.string().required('State is Required'),
        city: yup.string().required('City is Required'),
        pin: yup.string().required('PIN/ZIP Code is Required'),
        phone: yup.string().required('Phone No. is Required'),
        email: yup.string().required('Email is Required')
        // client: yup.().required('Client is Required')
    });
    const formik = useFormik({
        initialValues: {
            location_name: '',
            address: '',
            client: params.id,
            country: '',
            country_name: '',
            state: '',
            state_name: '',
            city: '',
            city_name: '',
            pin: '',
            phone: '',
            email: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // console.log('formik.values', formik.values);
            if (values) {
                console.log('formik.values', formik.values);
                try {
                    setOpen(true);
                    await axios.post('/location', formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Location Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate(`/admin/location/${params.id}`);
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

    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setCountry(res.data.data.country);
    };
    const getClients = async () => {
        const res = await axios.get('/client');
        console.log(res);
        setClients(res.data.data.data);
    };
    const handleState = async (id, name) => {
        console.log(name);
        const res = await axios.get(`/location/state?country_id=${id}`);
        formik.setFieldValue('country_name', name);
        setState(res.data.data.state);
    };
    const handleCity = async (id, name) => {
        console.log(id);
        const res = await axios.get(`/location/city?state_id=${id}`);
        formik.setFieldValue('state_name', name);
        setCity(res.data.data.city);
    };
    useEffect(() => {
        getCountry();
        getClients();
    }, []);
    return (
        <>
            <MainCard title="Create Location">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Location Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="location_name"
                                    name="location_name"
                                    autoComplete="location_name"
                                    value={formik.values.location_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Location Name..."
                                />
                            </Stack>
                            {formik.errors.location_name && <FormHelperText error>{formik.errors.location_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Address</InputLabel>
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    autoComplete="address"
                                    value={formik.values.address}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Address"
                                />
                            </Stack>
                            {formik.errors.address && <FormHelperText error>{formik.errors.address}</FormHelperText>}
                        </Grid>
                        {/* <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select Client</InputLabel>
                                <Select
                                    id="client"
                                    name="client"
                                    defaultValue="Select Client"
                                    // value={formik.values.country || 'Select Country'}
                                    onChange={formik.handleChange}
                                    // onClick={countrydata}
                                >
                                    <MenuItem value="" disabled>
                                        Select Client
                                    </MenuItem>
                                    {clients.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                            onClick={() => {
                                                formik.setFieldValue('client_name', item.client_name);
                                            }}
                                        >
                                            {item.client_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.client && <FormHelperText error>{formik.errors.client}</FormHelperText>}
                            </Stack>
                        </Grid> */}
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Country</InputLabel>
                                <Select
                                    id="country"
                                    name="country"
                                    defaultValue="Select Country"
                                    // value={formik.values.country || 'Select Country'}
                                    onChange={formik.handleChange}
                                    // onClick={countrydata}
                                >
                                    <MenuItem value="" disabled>
                                        Select Country
                                    </MenuItem>
                                    {country.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.country_id}
                                            onClick={() => {
                                                handleState(item.country_id, item.name);
                                                formik.setFieldValue('state', '');
                                                formik.setFieldValue('city', '');
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>State</InputLabel>
                                <Select
                                    id="state"
                                    name="state"
                                    defaultValue="Select State"
                                    // value={formik.values.statename || 'Select State'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem key={item.id} value={item.state_id} onClick={() => handleCity(item.state_id, item.name)}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.state && <FormHelperText error>{formik.errors.state}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>City</InputLabel>
                                <Select
                                    id="city"
                                    name="city"
                                    defaultValue="Select City"
                                    // value={formik.values.city || 'Select City'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select City
                                    </MenuItem>
                                    {city.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.city_id}
                                            onClick={() => {
                                                formik.setFieldValue('city_name', item.name);
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.city && <FormHelperText error>{formik.errors.city}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>PIN/ZIP Code</InputLabel>
                                <TextField
                                    fullWidth
                                    id="pin"
                                    name="pin"
                                    autoComplete="pin"
                                    value={formik.values.pin}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter location"
                                />
                            </Stack>
                            {formik.errors.pin && <FormHelperText error>{formik.errors.pin}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Location Phone No.</InputLabel>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    autoComplete="phone"
                                    value={formik.values.phone}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter location"
                                />
                            </Stack>
                            {formik.errors.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Location Email Address</InputLabel>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter location"
                                />
                            </Stack>
                            {formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Location
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateProduct;
