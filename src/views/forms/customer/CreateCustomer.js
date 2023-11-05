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
    Box,
    Radio,
    RadioGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

// yup validation-schema
const validationSchema = yup.object({
    customer_name: yup.string().min(3).max(30).required('Customer Name is Required'),
    contact_person: yup.string().required('Contact Person is required'),

    phone_no: yup.string().required('Phone Number is required'),

    email: yup.string().required('Email Address is required'),

    address: yup.string().required('Shipping Address is required'),

    location: yup.array().required('Location is required')

    // category: yup.mixed().required('Category is required')
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateCustomer() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const { user } = useAuth();

    const locationApi = async () => {
        const res = await axios.get(`/location/admin?client=${user.client_id}`);
        setLocations(res.data.data.data);
    };

    useEffect(() => {
        locationApi();
        // setProductType(response.data.data.data);
    }, []);

    const formik = useFormik({
        initialValues: {
            customer_name: '',
            contact_person: '',
            phone_no: '',
            email: '',
            address: '',
            location: [],
            location_name: [],
            prestages: 'un-available'
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    await axios.post('/customer', formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Customer Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/admin/customer');
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
                title="Create Customer"
                secondary={
                    <Grid item>
                        <Button
                            sm={3}
                            variant="contained"
                            onClick={() => {
                                navigate('/admin/customer');
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
                            <Stack>
                                <InputLabel required>Customer Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="customer_name"
                                    name="customer_name"
                                    autoComplete="new-password"
                                    value={formik.values.customer_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Customer Name..."
                                />
                            </Stack>
                            {formik.errors.customer_name && <FormHelperText error>{formik.errors.customer_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Contact Person</InputLabel>
                                <TextField
                                    fullWidth
                                    id="contact_person"
                                    name="contact_person"
                                    autoComplete="new-password"
                                    value={formik.values.contact_person}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Contact Person..."
                                />
                            </Stack>
                            {formik.errors.contact_person && <FormHelperText error>{formik.errors.contact_person}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Phone Number</InputLabel>
                                <TextField
                                    fullWidth
                                    id="phone_no"
                                    name="phone_no"
                                    autoComplete="new-password"
                                    value={formik.values.phone_no}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Phone Number..."
                                />
                            </Stack>
                            {formik.errors.phone_no && <FormHelperText error>{formik.errors.phone_no}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Email</InputLabel>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    autoComplete="new-password"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Email..."
                                />
                            </Stack>
                            {formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Customer Address</InputLabel>
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    autoComplete="new-password"
                                    value={formik.values.address}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Shipping Address ..."
                                />
                            </Stack>
                            {formik.errors.address && <FormHelperText error>{formik.errors.address}</FormHelperText>}
                        </Grid>
                        {/* <Grid item xs={12} md={3}>
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
                                    <MenuItem value="" disabled>
                                        Select Location
                                    </MenuItem>
                                    {locations.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.location_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                            </Stack>
                        </Grid> */}
                        <Grid item xs={12} md={3}>
                            <InputLabel required>Select Location</InputLabel>
                            <Autocomplete
                                id="location"
                                multiple
                                disablePortal
                                options={locations}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => option.location_name}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        console.log('newvalalala', newValue);
                                        const newValueID = [];
                                        const newValue1 = [];
                                        newValue.map((value) => {
                                            newValueID.push(value.id);
                                            newValue1.push(value.location_name);
                                            return 0;
                                        });

                                        console.log('in if', newValueID, newValue1);
                                        formik.setFieldTouched('location', true);

                                        formik.setFieldValue('location', newValueID);
                                        formik.setFieldValue('location_name', newValue1);

                                        if (!newValue.length) {
                                            console.log('in loop if', newValue);
                                            formik.setFieldTouched('location', true);
                                            formik.setFieldValue('location', '');

                                            // formik.setFieldError('location', 'Location is Required');
                                        }
                                    } else {
                                        console.log('in else', newValue);
                                        formik.setFieldValue('location', '');
                                        formik.setFieldError('location', 'Location is Required');
                                    }
                                    formik.setFieldTouched('location', true);
                                }}
                                renderInput={(params) => <TextField {...params} label="" />}
                                // isOptionEqualToValue={(option, value) => option.city_id === value.city_id}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.location_name}
                                    </Box>
                                )}
                            />
                            {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Pre-stages</InputLabel>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-label="prestages"
                                        value={formik.values.prestages}
                                        onChange={(e) => formik.setFieldValue('prestages', e.target.value)}
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel
                                            value="un-available"
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '&.Mui-checked': { color: theme.palette.error.main }
                                                    }}
                                                />
                                            }
                                            label="Un-available"
                                        />
                                        <FormControlLabel
                                            value="available"
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: theme.palette.success.main,
                                                        '&.Mui-checked': { color: theme.palette.success.main }
                                                    }}
                                                />
                                            }
                                            label="Available"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            {/* {formik.errors.address && <FormHelperText error>{formik.errors.address}</FormHelperText>} */}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Customer
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateCustomer;
