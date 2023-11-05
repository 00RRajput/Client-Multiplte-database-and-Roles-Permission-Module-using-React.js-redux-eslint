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
import '@mui/lab';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTheme } from '@mui/material/styles';

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

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { values } from 'lodash';
import { Category } from '@mui/icons-material';
import customer from 'store/slices/customer';

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
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [values, setValues] = useState([]);
    const params = useParams();
    // const [products, setProductType] = useState([]);

    const { user } = useAuth();
    const { customers } = useSelector((state) => state.customer);

    const locationApi = async () => {
        const res = await axios.get(`/location/admin?client=${user.client_id}`);
        setLocations(res.data.data.data);
    };

    useEffect(() => {
        locationApi();
        // setProductType(response.data.data.data);
        setValues(customers.filter((item) => item.id === params.id));
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
            prestages: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    // setOpen(true);
                    console.log('val', formik.values);
                    const transformedValues = {
                        ...formik.values,
                        location: formik.values.location.map((loc) => (loc.id ? loc.id : loc.location))
                    };
                    console.log('transformedValues', transformedValues);
                    await axios.put(`/customer/${params.id} `, transformedValues);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Customer Updated successfully !',
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
    useEffect(() => {
        console.log('val', values);
        if (values.length)
            formik.setValues({
                location: values[0].location.map((id, index) => ({
                    location: id,
                    location_name: values[0].location_name[index]
                })),
                location_name: values[0].location_name,
                customer_name: values[0].customer_name,
                contact_person: values[0].contact_person,
                phone_no: values[0].phone_no,
                email: values[0].email,
                address: values[0].address,
                prestages: values[0].prestages
            });
        if (values.length)
            console.log(
                'locations',
                values[0].location.map((id, index) => ({
                    location: id,
                    location_name: values[0].location_name[index]
                }))
            );
    }, [values]);
    return (
        <>
            <MainCard
                title="Edit Customer"
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
                                <InputLabel required>Shipping Address</InputLabel>
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
                                name="location"
                                multiple
                                disablePortal
                                options={locations}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => (option ? option.location_name : '')}
                                getOptionSelected={(option, value) => option.location === value.location}
                                value={formik.values.location || []}
                                // value={formik.values.location.map((loc) => locations.find((option) => option.location === loc))}
                                onChange={(event, newValue) => {
                                    formik.setFieldTouched('location', true);
                                    formik.setFieldValue('location', newValue || []); // Ensure newValue is an array

                                    const newValueNames = newValue ? newValue.map((value) => value.location_name) : [];
                                    formik.setFieldValue('location_name', newValueNames);

                                    if (!newValue.length || !newValueNames) {
                                        console.log('in', newValue, newValueNames);
                                        formik.setFieldTouched('location', true);
                                        formik.setFieldValue('location', '');
                                        // formik.setFieldError('location');
                                        // formik.setFieldError('location_name');
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="" />}
                                // isOptionEqualToValue={(option, value) => option.location === value.location}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.location_name}
                                    </Box>
                                )}
                            />
                            {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                            {/* {formik.errors.location_name && <FormHelperText error>{formik.errors.location_name}</FormHelperText>} */}
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
                                Update Customer
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateCustomer;
