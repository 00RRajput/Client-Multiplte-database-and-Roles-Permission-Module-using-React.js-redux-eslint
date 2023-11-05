import React, { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    useMediaQuery,
    Stack,
    Divider
    // CheckIcon
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import axios from '../../../utils/axios';
import Logo from 'ui-component/Logo';

// import { useLocation } from 'react-router-dom';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const UploadDocs = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [imageURL, setImageURL] = useState([]);

    const [aadharPreview, setAadharPreview] = useState(null);
    const [panPreview, setPanPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [checkPreview, setCheckPreview] = useState(null);

    const [formSubmitted, setFormSubmitted] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log('id', id);

    // ...
    return (
        <>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item sx={{ mb: 3 }}>
                    <Link to="#" aria-label="theme-logo">
                        <Logo />
                    </Link>
                </Grid>
            </Grid>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                        <Typography
                            style={{ marginBottom: '20px' }}
                            color={theme.palette.secondary.main}
                            gutterBottom
                            variant={matchDownSM ? 'h3' : 'h2'}
                        >
                            Document Upload
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            {/* <Divider /> */}
            <Formik
                initialValues={{
                    aadhar: '',
                    pan: '',
                    license: '',
                    check: ''
                }}
                validationSchema={Yup.object().shape({
                    aadhar: Yup.mixed().required('Aadhar Card  is required'),
                    pan: Yup.mixed().required('PAN Card is required'),
                    license: Yup.mixed().required('License is required'),
                    check: Yup.mixed().required('Cancelled Cheque  is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        console.log('aadhar', values.aadhar);
                        const formData = new FormData();
                        formData.append('aadhar', values.aadhar);
                        formData.append('pan', values.pan);
                        formData.append('license', values.license);
                        formData.append('check', values.check);
                        console.log('formdata', formData);
                        let imgurl;
                        await axios
                            .post(`/vendors/file/${id}`, formData)
                            .then((response) => {
                                console.log(response.data.data);
                                setImageURL(response.data.data);
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: 'Your registration has been successfully completed wait 24-72hours for your approval.',
                                        variant: 'alert',
                                        alert: {
                                            color: 'success'
                                        },
                                        close: false
                                    })
                                );
                                setFormSubmitted(true);
                                navigate('/login');
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } catch (err) {
                        console.log(err);
                        console.log(setErrors);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: err.message,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Divider />
                        {/* File 1 */}
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload Aadhar Card"
                                    name="aadhar"
                                    size="small"
                                    onBlur={handleBlur}
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    // onChange={handleChange}
                                    // value={values.aadhar}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={touched.aadhar && Boolean(errors.aadhar)}
                                    helperText={touched.aadhar && errors.aadhar}
                                    style={{ marginBottom: '10px' }}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            // Valid image file
                                            setFieldValue('aadhar', file);
                                            setAadharPreview(URL.createObjectURL(file));
                                        } else {
                                            // Invalid file type
                                            event.target.value = '';
                                            setFieldValue('aadhar', null);
                                            setAadharPreview(null);
                                            // Show error message or perform any other action
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: 'Please select a valid image file (JPEG, PNG).',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'error'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                />

                                {aadharPreview && (
                                    <img src={aadharPreview} alt="Aadhar Card Preview" style={{ width: '100%', marginTop: '10px' }} />
                                )}
                            </Grid>
                            {/* File 2 */}
                            {/* Upload PAN Card */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload PAN Card"
                                    name="pan"
                                    size="small"
                                    onBlur={handleBlur}
                                    // onChange={handleChange}
                                    // value={values.pan}
                                    accept="image/jpeg, image/png"
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={touched.pan && Boolean(errors.pan)}
                                    helperText={touched.pan && errors.pan}
                                    style={{ marginBottom: '10px' }}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            // Valid image file
                                            setFieldValue('pan', file);
                                            setPanPreview(URL.createObjectURL(file));
                                        } else {
                                            // Invalid file type
                                            event.target.value = '';
                                            setFieldValue('pan', null);
                                            setPanPreview(null);
                                            // Show error message or perform any other action
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: 'Please select a valid image file (JPEG, PNG).',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'error'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                />
                                {panPreview && <img src={panPreview} alt="PAN Card Preview" style={{ width: '100%', marginTop: '10px' }} />}
                            </Grid>
                            {/* File 3 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload License Card"
                                    name="license"
                                    size="small"
                                    onBlur={handleBlur}
                                    accept="image/jpeg, image/png"
                                    style={{ marginBottom: '10px' }}
                                    // onChange={handleChange}
                                    // value={values.license}
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={touched.license && Boolean(errors.license)}
                                    helperText={touched.license && errors.license}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            // Valid image file
                                            setFieldValue('license', file);
                                            setLicensePreview(URL.createObjectURL(file));
                                        } else {
                                            // Invalid file type
                                            event.target.value = '';
                                            setFieldValue('license', null);
                                            setLicensePreview(null);
                                            // Show error message or perform any other action
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: 'Please select a valid image file (JPEG, PNG).',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'error'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                />
                                {licensePreview && (
                                    <img src={licensePreview} alt="License Card Preview" style={{ width: '100%', marginTop: '10px' }} />
                                )}
                            </Grid>
                            {/* File 4 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload Cancelled Cheque"
                                    name="check"
                                    size="small"
                                    onBlur={handleBlur}
                                    accept="image/jpeg, image/png"
                                    style={{ marginBottom: '10px' }}
                                    // onChange={handleChange}
                                    // value={values.check}
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={touched.check && Boolean(errors.check)}
                                    helperText={touched.check && errors.check}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            // Valid image file
                                            setFieldValue('check', file);
                                            setCheckPreview(URL.createObjectURL(file));
                                        } else {
                                            // Invalid file type
                                            event.target.value = '';
                                            setFieldValue('check', null);
                                            setCheckPreview(null);
                                            // Show error message or perform any other action
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: 'Please select a valid image file (JPEG, PNG).',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'error'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                />
                                {checkPreview && (
                                    <img src={checkPreview} alt="License Card Preview" style={{ width: '100%', marginTop: '10px' }} />
                                )}
                            </Grid>
                            {/* Buttons */}
                            <Grid item xs={12} alignItems="center" justifyContent="center">
                                <Stack
                                    direction={matchDownSM ? 'column' : 'row'}
                                    spacing={matchDownSM ? 2 : 1}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth={matchDownSM}
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            alignItems="center"
                                            justifyContent="center"
                                            disabled={isSubmitting}
                                        >
                                            Document Upload
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default UploadDocs;
