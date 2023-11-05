import React, { useEffect, useState, useReducer } from 'react';
import useAuth from 'hooks/useAuth';
// material-ui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    FormHelperText,
    Grid,
    MenuItem,
    InputAdornment,
    Stack,
    TextField
} from '@mui/material';

import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import DateRangeIcon from '@mui/icons-material/DateRange';
import '@mui/lab';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

import axios from '../../../utils/axios';

// yup validation-schema
const validationSchema = yup.object({
    client_name: yup.string().required('Client Name is Required'),
    client_user_name: yup.string().required('User Name is Required').matches(/^\S*$/, 'This field cannot contain only blankspaces'),
    client_code: yup.string().required('Client Code is Required'),
    msme_no: yup.string(),
    registration_no: yup.string(),
    license_no: yup.string(),
    license_issue_date: yup.string(),
    license_expiry_date: yup.string(),
    contact_person_poc: yup.string().required('Contact Person is Required'),
    poc_mobile: yup
        .string()
        .test('positiveIntegerTest', 'Phone number should be a valid positive integer alphabets are not allowed !', (value) => {
            if (!value) return true;
            let parsedValue;
            try {
                parsedValue = parseInt(value, 10);
            } catch (error) {
                return true;
            }
            return !Number.isNaN(parsedValue) && parsedValue > 0;
        })
        .test('integerTest', 'Phone number should start with 6,7,8,9 and must have a length of 10 digits !', (value) => {
            if (!value) return true;
            return /^[6-9][0-9]{9}$/.test(value);
        })
        .required('Phone Number is required'),
    poc_other_phone: yup
        .string()
        .test('positiveIntegerTest', 'Phone number should be a valid positive integer alphabets are not allowed !', (value) => {
            if (!value) return true;
            let parsedValue;
            try {
                parsedValue = parseInt(value, 10);
            } catch (error) {
                return true;
            }
            return !Number.isNaN(parsedValue) && parsedValue > 0;
        })
        .test('integerTest', 'Phone number should start with 6,7,8,9 and must have a length of 10 digits !', (value) => {
            if (!value) return true;
            return /^[6-9][0-9]{9}$/.test(value);
        }),
    client_official_mail: yup.string().email('In-valid email').required('Email is required'),
    industry: yup.string(),
    year_incorporated: yup.string(),
    business_presence: yup.string(),
    website: yup.string(),
    resgister_address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    pincode: yup
        .string()
        .test('positiveIntegerTest', 'Pincode should be a valid positive integer alphabets are not allowed !', (value) => {
            if (!value) return true;
            let parsedValue;
            try {
                parsedValue = parseInt(value, 6);
            } catch (error) {
                return true;
            }
            return !Number.isNaN(parsedValue) && parsedValue > 0;
        })
        .required('Pincode is required'),
    yard_limitation: yup.number().required('No of yard is required')
});
// ==============================|| CREATE CLIENT ||============================== //

function EditClient({ edit, data }) {
    const dispatch = useDispatch();
    // const [name, setName] = useState({ fromcity: '', tocity: '', from_city_id: '', to_city_id: '' });

    const formik = useFormik({
        initialValues: {
            client_name: data.client_name || '',
            client_user_name: data.client_user_name || '',
            client_code: data.client_code || '',
            msme_no: data.msme_no || '',
            registration_no: data.registration_no || '',
            license_no: data.license_no || '',
            license_issue_date: new Date(data.license_issue_date),
            license_expiry_date: new Date(data.license_expiry_date),
            contact_person_poc: data.contact_person_poc || '',
            poc_mobile: data.poc_mobile || '',
            poc_other_phone: data.poc_other_phone || '',
            client_official_mail: data.client_official_mail || '',
            industry: data.industry || '',
            year_incorporated: data.year_incorporated || '',
            business_presence: data.business_presence || '',
            website: data.website || '',
            resgister_address: data.resgister_address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            pincode: data.pincode || '',
            yard_limitation: data.yard_limitation || 0
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // if (values) {
            //     setOpen(true);
            // }
            try {
                await axios.put(`/client/${data?.id}`, formik.values);
                resetForm();
                edit();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Client Updated successfully !',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        transition: 'SlideLeft',
                        close: true
                    })
                );
            } catch (error) {
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
    });

    useEffect(() => {
        // getStates();
    }, []);

    return (
        <>
            <MainCard title="Create Client">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Client Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="client_name"
                                    name="client_name"
                                    autoComplete="client_name"
                                    value={formik.values.client_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Client Name..."
                                />
                            </Stack>
                            {formik.errors.client_name && <FormHelperText error>{formik.errors.client_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Client User Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="client_user_name"
                                    name="client_user_name"
                                    autoComplete="client_user_name"
                                    value={formik.values.client_user_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Client User Name..."
                                />
                            </Stack>
                            {formik.errors.client_user_name && <FormHelperText error>{formik.errors.client_user_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Client Code</InputLabel>
                                <TextField
                                    fullWidth
                                    id="client_code"
                                    name="client_code"
                                    autoComplete="client_code"
                                    value={formik.values.client_code}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Client Code..."
                                />
                            </Stack>
                            {formik.errors.client_code && <FormHelperText error>{formik.errors.client_code}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>MSME No</InputLabel>
                                <TextField
                                    fullWidth
                                    id="msme_no"
                                    name="msme_no"
                                    autoComplete="msme_no"
                                    value={formik.values.msme_no}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter MSME No..."
                                />
                            </Stack>
                            {formik.errors.msme_no && <FormHelperText error>{formik.errors.msme_no}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Registration No</InputLabel>
                                <TextField
                                    fullWidth
                                    id="registration_no"
                                    name="registration_no"
                                    autoComplete="registration_no"
                                    value={formik.values.registration_no}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Registration No..."
                                />
                            </Stack>
                            {formik.errors.registration_no && <FormHelperText error>{formik.errors.registration_no}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>License No</InputLabel>
                                <TextField
                                    fullWidth
                                    id="license_no"
                                    name="license_no"
                                    autoComplete="license_no"
                                    value={formik.values.license_no}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter License No..."
                                />
                            </Stack>
                            {formik.errors.license_no && <FormHelperText error>{formik.errors.license_no}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>License Issue Date</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileDateTimePicker
                                        value={formik.values.license_issue_date}
                                        onChange={(newValue) => {
                                            // setValue(newValue);
                                            formik.setFieldValue('license_issue_date', newValue);
                                        }}
                                        label=""
                                        onError={console.log}
                                        minDate={new Date()}
                                        inputFormat="yyyy/MM/dd"
                                        mask="___/__/__ __"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <DateRangeIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                {/* <DesktopDatePicker
                                    label="Due Date"
                                    value={formik.values.license_issue_date}
                                    inputFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        formik.setFieldValue('license_issue_date', date);
                                    }}
                                    renderInput={(props) => <TextField fullWidth {...props} />}
                                /> */}
                            </Stack>
                            {formik.errors.license_issue_date && <FormHelperText error>{formik.errors.license_issue_date}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>License Expiry Date</InputLabel>
                                <Grid item xs={12} sm={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDateTimePicker
                                            value={formik.values.license_expiry_date}
                                            onChange={(newValue) => {
                                                // setValue(newValue);
                                                formik.setFieldValue('license_expiry_date', newValue);
                                            }}
                                            label=""
                                            onError={console.log}
                                            minDate={new Date()}
                                            inputFormat="yyyy/MM/dd"
                                            mask="___/__/__ __"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <DateRangeIcon />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                {/* <Grid item xs={12} sm={8}>
                                    <DesktopDatePicker
                                        label="Due Date"
                                        value={formik.values.license_expiry_date}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                            formik.setFieldValue('license_expiry_date', date);
                                        }}
                                        renderInput={(props) => <TextField fullWidth {...props} />}
                                    />
                                </Grid> */}
                            </Stack>
                            {formik.errors.license_expiry_date && (
                                <FormHelperText error>{formik.errors.license_expiry_date}</FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Contact Person (POC)</InputLabel>
                                <TextField
                                    fullWidth
                                    id="contact_person_poc"
                                    name="contact_person_poc"
                                    autoComplete="contact_person_poc"
                                    value={formik.values.contact_person_poc}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Contact Person..."
                                />
                            </Stack>
                            {formik.errors.contact_person_poc && <FormHelperText error>{formik.errors.contact_person_poc}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>POC Mobile</InputLabel>
                                <TextField
                                    fullWidth
                                    id="poc_mobile"
                                    name="poc_mobile"
                                    autoComplete="poc_mobile"
                                    value={formik.values.poc_mobile}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter POC Mobile..."
                                />
                            </Stack>
                            {formik.errors.poc_mobile && <FormHelperText error>{formik.errors.poc_mobile}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Poc Other Phone</InputLabel>
                                <TextField
                                    fullWidth
                                    id="poc_other_phone"
                                    name="poc_other_phone"
                                    autoComplete="poc_other_phone"
                                    value={formik.values.poc_other_phone}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Other Phone..."
                                />
                            </Stack>
                            {formik.errors.poc_other_phone && <FormHelperText error>{formik.errors.poc_other_phone}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Client Official Email</InputLabel>
                                <TextField
                                    fullWidth
                                    id="client_official_mail"
                                    name="client_official_mail"
                                    autoComplete="client_official_mail"
                                    value={formik.values.client_official_mail}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Email..."
                                />
                            </Stack>
                            {formik.errors.client_official_mail && (
                                <FormHelperText error>{formik.errors.client_official_mail}</FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Industry</InputLabel>
                                <TextField
                                    fullWidth
                                    id="industry"
                                    name="industry"
                                    autoComplete="industry"
                                    value={formik.values.industry}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Industry..."
                                />
                            </Stack>
                            {formik.errors.industry && <FormHelperText error>{formik.errors.industry}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Year Incorporated</InputLabel>
                                <TextField
                                    fullWidth
                                    id="year_incorporated"
                                    name="year_incorporated"
                                    autoComplete="year_incorporated"
                                    value={formik.values.year_incorporated}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Year Incorporated Name..."
                                />
                            </Stack>
                            {formik.errors.year_incorporated && <FormHelperText error>{formik.errors.year_incorporated}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Business Presence (DOM / MNC)</InputLabel>
                                <TextField
                                    fullWidth
                                    id="business_presence"
                                    name="business_presence"
                                    autoComplete="business_presence"
                                    value={formik.values.business_presence}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Business Presence Name..."
                                />
                            </Stack>
                            {formik.errors.business_presence && <FormHelperText error>{formik.errors.business_presence}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Website</InputLabel>
                                <TextField
                                    fullWidth
                                    id="website"
                                    name="website"
                                    autoComplete="website"
                                    value={formik.values.website}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Website Link Here..."
                                />
                            </Stack>
                            {formik.errors.website && <FormHelperText error>{formik.errors.website}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Registere Address </InputLabel>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-flexible"
                                    label="Enter Address..."
                                    multiline
                                    rows={2}
                                    value={formik.values.resgister_address}
                                    name="resgister_address"
                                    autoComplete="resgister_address"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                            </Stack>
                            {formik.errors.resgister_address && <FormHelperText error>{formik.errors.resgister_address}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>City</InputLabel>
                                <TextField
                                    fullWidth
                                    id="city"
                                    name="city"
                                    autoComplete="city"
                                    value={formik.values.city}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter City Name..."
                                />
                            </Stack>
                            {formik.errors.city && <FormHelperText error>{formik.errors.city}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>State</InputLabel>
                                <TextField
                                    fullWidth
                                    id="state"
                                    name="state"
                                    autoComplete="state"
                                    value={formik.values.state}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter State Name..."
                                />
                            </Stack>
                            {formik.errors.state && <FormHelperText error>{formik.errors.state}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Country</InputLabel>
                                <TextField
                                    fullWidth
                                    id="country"
                                    name="country"
                                    autoComplete="country"
                                    value={formik.values.country}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Country Name..."
                                />
                            </Stack>
                            {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Pincode</InputLabel>
                                <TextField
                                    fullWidth
                                    id="pincode"
                                    name="pincode"
                                    autoComplete="pincode"
                                    value={formik.values.pincode}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Picode..."
                                />
                            </Stack>
                            {formik.errors.pincode && <FormHelperText error>{formik.errors.pincode}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>No. of Yard</InputLabel>
                                <TextField
                                    fullWidth
                                    id="yard_limitation"
                                    name="yard_limitation"
                                    autoComplete="yard_limitation"
                                    value={formik.values.yard_limitation}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter No Of Yard..."
                                />
                            </Stack>
                            {formik.errors.yard_limitation && <FormHelperText error>{formik.errors.yard_limitation}</FormHelperText>}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default EditClient;
