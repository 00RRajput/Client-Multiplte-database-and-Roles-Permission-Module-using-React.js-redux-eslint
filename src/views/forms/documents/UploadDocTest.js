import React, { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Stack,
    MenuItem,
    Select,
    Chip
    // ClearIcon
    // CheckIcon
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import CheckIcon from '@mui/icons-material/Check';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from '../../../utils/axios';
import Logo from 'ui-component/Logo';

// import { useLocation } from 'react-router-dom';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [imageURL, setImageURL] = useState([]);
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const [lanes, setLanes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleId, setVehicleId] = useState([]);
    const [laneId, setLaneId] = useState([]);
    // const [imageURL, setImageURL] = useState([]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicatorNumFunc(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    const [aadharPreview, setAadharPreview] = useState(null);
    const [panPreview, setPanPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [checkPreview, setCheckPreview] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log('id', id);

    const renderImagePreview = (field, preview, setPreview, setFieldValue) => (
        <>
            <Box position="relative" display="inline-block" width="100%" mt={2}>
                <img src={preview} alt={`${field} Preview`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box position="absolute" top={0} right={0} zIndex={1} bgcolor="rgba(255, 255, 255, 0.7)" p={1} borderRadius="0 0 0 4px">
                    {/* Add the dotted box styling here */}
                    <Box border="1px dashed grey" width="100%" height="100%" position="absolute" top={0} left={0} pointerEvents="none" />
                    {/* End of dotted box styling */}
                    <IconButton
                        size="small"
                        onClick={() => {
                            setFieldValue(field, null);
                            setPreview(null);
                        }}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
    // ...
    return (
        <>
            {/* Header */}
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item sx={{ mb: 3 }}>
                    <Link to="#" aria-label="theme-logo">
                        <Logo />
                    </Link>
                </Grid>
            </Grid>

            {/* Vendor registration notice */}
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" color="error">
                            This is only for Vendor registration*
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

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
                            .post('/vendors/file', formData)
                            .then((response) => {
                                console.log(response.data.data.fileUrls);
                                imgurl = response.data.data.fileUrls.map((url) => url);
                                imgurl = [...imageURL, ...imgurl];
                                setImageURL(imgurl);
                                console.log('image', imgurl);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        console.log('image', imgurl[0]);
                        await axios
                            .put(`/vendors/${id}`, {
                                aadhar: imgurl[0],
                                pan: imgurl[1],
                                license: imgurl[2],
                                cheque: imgurl[3]
                            })
                            .then((response) => {
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: 'Your Documents has been successfully Uploaded wait for your approval.',
                                        variant: 'alert',
                                        alert: {
                                            color: 'success'
                                        },
                                        close: false
                                    })
                                );
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
                        {/* File Upload */}
                        <Grid container spacing={2}>
                            {/* Aadhar Card */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel htmlFor="aadhar-upload">Upload Aadhar Card</InputLabel>
                                    <OutlinedInput
                                        id="aadhar-upload"
                                        name="aadhar"
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('aadhar', file);
                                            setAadharPreview(URL.createObjectURL(file));
                                        }}
                                        // ...
                                    />
                                    {aadharPreview ? (
                                        renderImagePreview('aadhar', aadharPreview)
                                    ) : (
                                        <Box
                                            border="1px dashed grey"
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            minHeight={150}
                                            mt={2}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                Upload Aadhar Card
                                            </Typography>
                                        </Box>
                                    )}
                                    {touched.aadhar && errors.aadhar && <FormHelperText error>{errors.aadhar}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {/* File 2 */}
                            {/* Upload PAN Card */}
                            {/* <Grid container spacing={2}> */}
                            {/* Aadhar Card */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel htmlFor="aadhar-upload">Upload Aadhar Card</InputLabel>
                                    <OutlinedInput
                                        id="aadhar-upload"
                                        name="aadhar"
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('aadhar', file);
                                            setAadharPreview(URL.createObjectURL(file));
                                        }}
                                        // ...
                                    />
                                    {aadharPreview ? (
                                        renderImagePreview('aadhar', aadharPreview)
                                    ) : (
                                        <Box
                                            border="1px dashed grey"
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            minHeight={150}
                                            mt={2}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                Upload Aadhar Card
                                            </Typography>
                                        </Box>
                                    )}
                                    {touched.aadhar && errors.aadhar && <FormHelperText error>{errors.aadhar}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {/* </Grid> */}
                            {/* File 3 */}
                            {/* <Grid container spacing={2}> */}
                            {/* Aadhar Card */}
                            {/* Aadhar Card */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel htmlFor="aadhar-upload">Upload Aadhar Card</InputLabel>
                                    <OutlinedInput
                                        id="aadhar-upload"
                                        name="aadhar"
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('aadhar', file);
                                            setAadharPreview(URL.createObjectURL(file));
                                        }}
                                        // ...
                                    />
                                    {aadharPreview ? (
                                        renderImagePreview('aadhar', aadharPreview)
                                    ) : (
                                        <Box
                                            border="1px dashed grey"
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            minHeight={150}
                                            mt={2}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                Upload Aadhar Card
                                            </Typography>
                                        </Box>
                                    )}
                                    {touched.aadhar && errors.aadhar && <FormHelperText error>{errors.aadhar}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {/* </Grid> */}
                            {/* File 4 */}
                            {/* Aadhar Card */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel htmlFor="aadhar-upload">Upload Aadhar Card</InputLabel>
                                    <OutlinedInput
                                        id="aadhar-upload"
                                        name="aadhar"
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('aadhar', file);
                                            setAadharPreview(URL.createObjectURL(file));
                                        }}
                                        // ...
                                    />
                                    {aadharPreview ? (
                                        renderImagePreview('aadhar', aadharPreview)
                                    ) : (
                                        <Box
                                            border="1px dashed grey"
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            minHeight={150}
                                            mt={2}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                Upload Aadhar Card
                                            </Typography>
                                        </Box>
                                    )}
                                    {touched.aadhar && errors.aadhar && <FormHelperText error>{errors.aadhar}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {/* Buttons */}
                            {/* Buttons */}
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
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

export default JWTRegister;
