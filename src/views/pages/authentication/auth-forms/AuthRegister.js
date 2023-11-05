import { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';
// import { Document, Page, pdfjs } from 'react-pdf';

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
    Chip,
    Radio,
    RadioGroup,
    Autocomplete
    // CheckIcon
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import * as libphonenumber from 'google-libphonenumber';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from '../../../../utils/axios';
import { MAX_FILE_SIZE_REGISTER } from '../../../../utils/static-data';
// import { height } from '@mui/system';
// import { height } from '@mui/system';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [lanes, setLanes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isVOpen, setIsVOpen] = useState(false);
    const [isTurnoverOpen, setIsTurnoverOpen] = useState(false);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [stateCountry, setStateCountry] = useState('');
    const [cityCountry, setCityCountry] = useState('');
    const [states, setStates] = useState([]);
    const [panPreview, setPanPreview] = useState(null);
    const [panType, setPanType] = useState('');
    const [gstPreview, setGSTPreview] = useState(null);
    const [gstType, setGstType] = useState('');
    const [icPreview, setICPreview] = useState(null);
    const [icType, setIcType] = useState('');
    const [msmePreview, setMSMEPreview] = useState(null);
    const [msmeType, setMSMEType] = useState('');
    const [chequePreview, setChequePreview] = useState(null);
    const [chequeType, setChequeType] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [contactPerson, setContactPerson] = useState([]);
    const [iso, setIso] = useState('');

    const getCountries = async () => {
        try {
            const response = await axios.get('/location/country');
            setCountries(response.data.data.country);
        } catch (error) {
            console.log(error);
        }
    };

    const getContactPerson = async () => {
        try {
            const response = await axios.get('/users/holibook');
            setContactPerson(response.data.data);
        } catch (error) {
            console.log(error);
        }
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
    const handleFileRemove = (type) => {
        switch (type) {
            case 'msme':
                setMSMEPreview('');
                setMSMEType('');
                break;
            case 'pan':
                setPanPreview('');
                setPanType('');
                break;
            case 'ic':
                setICPreview('');
                setIcType('');
                break;
            case 'cc':
                setChequePreview('');
                setChequeType('');
                break;
            case 'gst':
                setGSTPreview('');
                setGstType('');
                break;
            default:
                break;
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowCPassword = () => {
        setShowCPassword(!showCPassword);
    };

    const handleMouseDownCPassword = (event) => {
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

    const getLanes = async (id) => {
        const res = await axios.get(`/routes?country_id=${id}`);
        setLanes(res.data.data.data);
    };
    const getRoles = async () => {
        const res = await axios.get(`/roles`);
        setRoles(res.data.data.data);
    };
    const getVehicles = async () => {
        const res = await axios.get('/vehicles');
        setVehicles(res.data.data.vehicles);
    };
    const handleOK = () => {
        setIsOpen(false);
        setIsVOpen(false);
    };
    useEffect(() => {
        getCountries();
        getRoles();
        getVehicles();
        getContactPerson();
    }, []);

    const phoneValidation = (value, countryCode) => {
        if (!value) return true;

        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        try {
            const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);
            const isValid = phoneUtil.isValidNumber(phoneNumber);

            if (!isValid) {
                return false;
            }
        } catch (error) {
            console.log('error', error);
            return false;
        }

        return true;
    };

    const getCountryIso = (selectedCountry) => {
        const countryArr = countries.filter((country) => country.country_id === parseInt(selectedCountry, 10));
        if (countryArr.length) {
            setIso(countryArr[0].iso2 || '');
            return countryArr[0].iso2;
        }
        return '';
    };
    // const phone_code = {};
    return (
        <>
            <Formik
                initialValues={{
                    gst_no: '',
                    gst_certificate: '',
                    entity_name: '',
                    is_gst_available: 'no',
                    country: '',
                    currency: '',
                    state: '',
                    city: '',
                    password: '',
                    confirmpassword: '',
                    primary_contact_name: '',
                    secondary_contact_name: '',
                    pan_name: '',
                    primary_phone: '',
                    primary_email: '',
                    secondary_phone: '',
                    secondary_email: '',
                    vehicletype: [],
                    laneRoute: [],
                    swift_code: '',
                    cin_no: '',
                    msme_no: '',
                    msme_certificate: '',
                    billing_address: '',
                    billing_pin_code: '',
                    correspondence_address: '',
                    correspondence_pin_code: '',
                    contact_person: '',
                    pan: '',
                    pan_card_no: '',
                    bank_name: '',
                    branch_name: '',
                    branch_address: '',
                    account_holder: '',
                    account_type: 'current',
                    account_number: '',
                    ifsc_code: '',
                    org_type: '',
                    correspondence_same_as_billing_address: false,
                    msme_registration: 'no',
                    incorporation_certificate: '',
                    cancelled_cheque: '',
                    aggregate_annual_turnover: '',
                    primary_phone_code: '',
                    sec_phone_code: '',
                    other_org_type: '',
                    declaration_confirmation: true,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    entity_name: Yup.string()
                        .min(3, 'Entity name must be at least 3 characters')
                        .max(100, 'Entity name cannot exceed 100 characters')
                        // .matches(/^[A-Za-z\s]+$/, 'Entity name must only contain letters')
                        .required('Entity name is required !'),
                    primary_contact_name: Yup.string()
                        .matches(/^[A-Za-z\s]+$/, 'contact name must only contain letters')
                        .min(3, 'contact name must be at least 3 characters')
                        .max(30, 'contact name cannot exceed 30 characters')
                        .required('contact name is required'),
                    secondary_contact_name: Yup.string()
                        .matches(/^[A-Za-z\s]+$/, 'contact name must only contain letters')
                        .min(3, 'contact name must be at least 3 characters')
                        .max(30, 'contact name cannot exceed 30 characters')
                        .optional(),
                    primary_phone: Yup.string()
                        .matches(/^[0-9]+$/, 'Primary phone must contain only numbers')
                        .test('validPhoneNumber', 'Invalid phone number', (value, ctx) =>
                            phoneValidation(value, getCountryIso(ctx.parent.country))
                        )
                        .required('Primary phone is required'),

                    // primary_phone_code: Yup.string()
                    // .test('validPhoneNumber', 'Invalid phone number', (value, ctx) =>
                    //     phoneValidation(value, getCountryIso(ctx.parent.country))
                    // )
                    // .required('Primary phone is required'),

                    primary_email: Yup.string().max(63).email('Must be a valid email').required('Primary email is required'),
                    secondary_phone: Yup.string()
                        .matches(/^[0-9]+$/, 'Secondary phone must contain only numbers')
                        .test('validPhoneNumber', 'Invalid phone number', (value, ctx) =>
                            phoneValidation(value, getCountryIso(ctx.parent.country))
                        )
                        .optional(),
                    secondary_email: Yup.string().max(63).email('Must be a valid email').optional(),
                    password: Yup.string().min(6).max(20).required('Password is required'),
                    confirmpassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords does not match'),
                    is_gst_available: Yup.string().oneOf(['yes', 'no']),
                    gst_no: Yup.string().when('is_gst_available', {
                        is: 'yes',
                        then: Yup.string()
                            .required('GST No. is required')
                            .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/i, 'Invalid GST No.')
                            .max(15, 'GST No. must not exceed 15 characters'),
                        otherwise: Yup.string().notRequired()
                    }),
                    gst_certificate: Yup.mixed().when('is_gst_available', {
                        is: 'yes',
                        then: Yup.mixed().required('gst certificate is required'),
                        otherwise: Yup.string().notRequired()
                    }),
                    country: Yup.string().required('country is required'),
                    contact_person: Yup.string().required('Contact Person is required'),
                    state: Yup.string().notRequired(),
                    city: Yup.string().notRequired(),
                    currency: Yup.string().required('Currency is required'),
                    billing_pin_code: Yup.string().when('country', (country, schema) => {
                        if (country === '101' || country === 101) {
                            return schema
                                .min(6, 'Pin code must have 6 characters')
                                .max(6, 'Pin code must have 6 characters')
                                .matches(/^\d{6}$/, 'Invalid PIN Code')
                                .required('Pin code is required');
                        }
                        return schema
                            .trim()
                            .required('Zip code is required')
                            .matches(/^(.|[\r\n]){0,10}$/gm, 'Invalid zip code');

                        // return schema.notRequired();
                    }),
                    vehicletype: Yup.mixed().required('Vehicle Type is required'),
                    laneRoute: Yup.mixed().required('Lane Route is required'),
                    swift_code: Yup.string()
                        .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i, 'Invalid Swift Code')
                        .max(11)
                        .optional(),
                    correspondence_same_as_billing_address: Yup.string().max(255),
                    correspondence_address: Yup.string()
                        .max(255)
                        .matches(/^[a-zA-Z0-9\s]+$/, 'Correspondence Address Must contains only AlphaNumeric value')
                        .required('correspondence address is required'),
                    correspondence_pin_code: Yup.string().when('country', (country, schema) => {
                        if (country === '101' || country === 101) {
                            return schema
                                .min(6, 'Pin code must have 6 characters')
                                .max(6, 'Pin code must have 6 characters')
                                .matches(/^\d{6}$/, 'Invalid PIN Code')
                                .optional();
                        }
                        return schema
                            .trim()
                            .optional()
                            .matches(/^(.|[\r\n]){0,10}$/gm, 'Invalid zip code');

                        // return schema.notRequired();
                    }),
                    billing_address: Yup.string()
                        .matches(/^[a-zA-Z0-9\s]+$/, 'Billing Address Must contains only AlphaNumeric value')
                        .max(255)
                        .required('billing address is required'),
                    org_type: Yup.number().min(1).max(5).required('organization type is required'),
                    pan: Yup.mixed().when('country', {
                        is: 101,
                        then: Yup.mixed().required('pan card is required'),
                        otherwise: Yup.mixed().notRequired()
                    }),
                    pan_card_no: Yup.string().when('country', {
                        is: 101,
                        then: Yup.string()
                            .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/i, 'Invalid Pan Number')
                            .min(10, 'pan number must have 10 character')
                            .max(10, 'pan number must have 10 character')
                            .required('Pan card number is required'),
                        otherwise: Yup.string().notRequired()
                    }),
                    name_pan: Yup.string().when('country', {
                        is: 101,
                        then: Yup.string().min(3, 'name must be at least 3 characters').max(30, 'name cannot exceed 30 characters'),
                        otherwise: Yup.string().notRequired()
                    }),
                    msme_registration: Yup.string().oneOf(['yes', 'no']),
                    msme_no: Yup.string().when('msme_registration', {
                        is: 'yes',
                        then: Yup.string()
                            .matches(/^[A-Z]{2}\d{2}[A-Z]\d{7}$/i, 'Invalid MSME Number')
                            .min(12, 'MSME number must have 18 character')
                            .max(12, 'MSME number must have 18 character')
                            .required('MSME is required'),
                        otherwise: Yup.string().notRequired()
                    }),
                    msme_certificate: Yup.mixed().when('msme_registration', {
                        is: 'yes',
                        then: Yup.mixed().required('MSME certificate is required'),
                        otherwise: Yup.mixed().notRequired()
                    }),
                    cin_no: Yup.string().when(['org_type', 'country'], {
                        // eslint-disable-next-line camelcase
                        is: (org_type, country) => (org_type === 1 || org_type === 2) && country === 101,
                        then: Yup.string()
                            .matches(/^([L|U|C|F]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6})$/i, 'Invalid CIN Number')
                            .min(21, 'CIN number must have 21 character')
                            .max(21, 'CIN number must have 21 character')
                            .required('CIN is required'),
                        otherwise: Yup.string()
                    }),
                    bank_name: Yup.string()
                        .matches(/^[A-Za-z\s]+$/, 'bank name must only contain letters')
                        .required('bank name is required')
                        .min(3)
                        .max(60),
                    branch_name: Yup.string()
                        .matches(/^[A-Za-z\s]+$/, 'branch name must only contain letters')
                        .max(60, 'branch name cannot exceed 60 characters')
                        .required('Branch name is required'),
                    branch_address: Yup.string()
                        .matches(/^[a-zA-Z0-9\s]+$/, 'Branch Address must only contain alphanumeric values')
                        .max(200, 'branch address cannot exceed 200 characters')
                        .required('Branch Address is required'),
                    account_holder: Yup.string()
                        .matches(/^[A-Za-z\s]+$/, 'Account Holder name must only contain letters')
                        .max(60, 'account holder name cannot exceed 60 characters')
                        .required('Account holder name is required'),
                    account_type: Yup.string().oneOf(['current', 'savings']).required('account type is required'),
                    account_number: Yup.string()
                        .matches(/^\d+$/, 'Account No. must only contain digits')
                        .min(11, 'Account no. must have minimum 11 digits')
                        .max(16, 'Account No. cannot exceed 16 digits')
                        .required('Account No. is required'),
                    ifsc_code: Yup.string().when('country', {
                        is: 101,
                        then: Yup.string()
                            .matches(/^[A-Za-z]{4}\d{7}$/i, 'Invalid IFSC Code')
                            .min(11)
                            .max(11)
                            .required('IFSC Code is required'),
                        otherwise: Yup.string().notRequired()
                    }),
                    cancelled_cheque: Yup.mixed().when('bank_name', {
                        is: (value) => value && value.length,
                        then: Yup.mixed().required('Cancelled cheque is required'),
                        otherwise: Yup.mixed().notRequired()
                    }),
                    aggregate_annual_turnover: Yup.string().required('Annual Turnover is required'),
                    incorporation_certificate: Yup.mixed().when('org_type', {
                        is: (value) => value === 1 || value === 2,
                        then: Yup.mixed().required('Incorporation certificate is required'),
                        otherwise: Yup.string().notRequired()
                    }),
                    other_org_type: Yup.mixed().when('org_type', {
                        is: (value) => value === 5,
                        then: Yup.mixed().required('Please Specify'),
                        otherwise: Yup.string().notRequired()
                    }),
                    declaration_confirmation: Yup.boolean()
                        .required('Please accept self declaration')
                        .oneOf([true], 'Please accept self declaration')
                })}
                onSubmit={async (values, { setErrors }) => {
                    try {
                        if (!checked) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Please Agree to all terms and conditions.',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    close: false
                                })
                            );
                            return;
                        }
                        //! state and city's country matches selected country
                        if (values.state && stateCountry !== values.country) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Please select state from same country.',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    close: false
                                })
                            );
                            return;
                        }
                        if (values.city && cityCountry !== values.city) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Please select city from same country/state.',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    close: false
                                })
                            );
                            return;
                        }
                        const formData = new FormData();
                        Object.keys(values).filter(
                            (formKey) =>
                                formKey !== 'submit' &&
                                formKey !== 'vehicletype' &&
                                formKey !== 'laneRoute' &&
                                formData.append(formKey, values[formKey])
                        );
                        formData.append('iso', iso);
                        const updatedLane = values.laneRoute.map((route) => route.id);
                        updatedLane.map((lane, index) => formData.append(`lane[${index}]`, lane));
                        const updatedIds = values.vehicletype.map((vehicle) => vehicle.id);
                        updatedIds.map((vehicle, index) => formData.append(`vehicle_type[${index}]`, vehicle));
                        await axios.post('/vendors', formData, { 'Content-Type': 'multipart/form-data' });
                        // const userId = response.data.data.id;
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: 'Registration Process Completed.',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                        setFormSubmitted(true);
                        navigate(`/login`);
                        //
                    } catch (err) {
                        console.log(err);
                        console.log(setErrors);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: err.response.data.message,
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        );
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setFieldTouched }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            {/* Entity Name */}
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Entity Name"
                                    name="entity_name"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.entity_name.toUpperCase()}
                                    variant="outlined"
                                    error={touched.entity_name && Boolean(errors.entity_name)}
                                    helperText={touched.entity_name && errors.entity_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="subtitle1" fontSize="0.75rem">
                                    GST Registration:
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-label="is_gst_available"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.is_gst_available}
                                        name="is_gst_available"
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8}>
                                {values.is_gst_available === 'yes' && (
                                    <TextField
                                        fullWidth
                                        label="GST No."
                                        name="gst_no"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.gst_no.toUpperCase()}
                                        variant="outlined"
                                        error={touched.gst_no && Boolean(errors.gst_no)}
                                        helperText={touched.gst_no && errors.gst_no}
                                        sx={{
                                            marginTop: '16px'
                                        }}
                                    />
                                )}
                            </Grid>
                            {values.is_gst_available === 'yes' && (
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Upload GST Certificate"
                                        name="gst_certificate"
                                        size="small"
                                        onBlur={handleBlur}
                                        type="file"
                                        accept="image/jpeg, image/png, application/pdf"
                                        // onChange={handleChange}
                                        // value={values.aadhar}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        error={touched.gst_certificate && Boolean(errors.gst_certificate)}
                                        helperText={touched.gst_certificate && (errors.gst_certificate || '')}
                                        style={{ marginBottom: '10px' }}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (
                                                file &&
                                                (file.type.startsWith('image/') || file.type === 'application/pdf') &&
                                                file.size < MAX_FILE_SIZE_REGISTER * 1024
                                            ) {
                                                // Valid image file
                                                setFieldValue('gst_certificate', file);
                                                if (file.type.startsWith('image/')) {
                                                    setGstType('img');
                                                    setGSTPreview(URL.createObjectURL(file));
                                                } else {
                                                    setGstType('pdf');
                                                    setGSTPreview(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
                                                }
                                                // setGSTPreview(URL.createObjectURL(file));
                                            } else {
                                                // Invalid file type
                                                event.target.value = '';
                                                setGstType('');
                                                setFieldValue('gst_certificate', null);
                                                setGSTPreview(null);
                                                let errorMsg = 'Please select a valid file type (JPEG, PNG, PDF)';
                                                if (file.size > MAX_FILE_SIZE_REGISTER * 1024)
                                                    errorMsg = 'Please select a file below 2MB in size';
                                                // Show error message or perform any other action
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: errorMsg,
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
                                    {gstPreview && (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            sx={{ height: '400px', overflowX: 'auto', position: 'relative' }}
                                        >
                                            <IconButton
                                                aria-label="toggle remove doc/image"
                                                onClick={() => {
                                                    handleFileRemove('gst');
                                                    setFieldValue('gst_certificate', null);
                                                }}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    position: 'absolute!important',
                                                    top: '16px',
                                                    right: '16px',
                                                    zIndex: '999',
                                                    backgroundColor: theme.palette.error.dark,
                                                    padding: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <HighlightOffIcon />
                                            </IconButton>
                                            {gstType === 'img' && (
                                                <img
                                                    src={gstPreview}
                                                    alt="Gst Preview"
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '10px',
                                                        height: 'auto',
                                                        // justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                />
                                            )}
                                            {gstType === 'pdf' && (
                                                <iframe id="gst_cert" title="gst doc preview" width="100%" height="100%" src={gstPreview} />
                                            )}
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                            {/* Country */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    options={countries}
                                    getOptionLabel={(option) => option.name}
                                    size="small"
                                    onBlur={() => setFieldTouched('country', touched.country)}
                                    onChange={(event, newValue) => {
                                        if (newValue?.country_id) {
                                            setFieldValue('country', newValue?.country_id);
                                            setFieldValue('primary_phone_code', newValue?.phone_code);
                                            setFieldValue('sec_phone_code', newValue?.phone_code);
                                            getStates({ country_id: newValue?.country_id });
                                            getCities({ country_id: newValue?.country_id });
                                            getLanes(newValue.country_id);
                                        } else setFieldValue('country', '');
                                        setFieldValue('state', '');
                                        setFieldValue('city', '');
                                    }}
                                    isOptionEqualToValue={(option, value) => option.country_id === value.country_id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a country"
                                            error={touched.country && Boolean(errors.country)}
                                            helperText={touched.country && errors.country}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.emoji} {option.name}
                                        </Box>
                                    )}
                                />
                            </Grid>
                            {/* States */}
                            {values.country && (
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={states}
                                        getOptionLabel={(option) => option.name || ''}
                                        size="small"
                                        key={values.country}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setFieldValue('state', newValue?.state_id);
                                                getCities({ state_id: newValue?.state_id });
                                            } else setFieldValue('state', '');
                                            setFieldValue('city', '');
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
                            )}
                            {/* Cities */}
                            {values.state && (
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={cities}
                                        getOptionLabel={(option) => option.name || ''}
                                        size="small"
                                        key={values.state}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setFieldValue('city', newValue?.city_id);
                                                setCityCountry(newValue?.country_id);
                                            } else {
                                                setCityCountry('');
                                                setFieldValue('city', '');
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
                            )}
                            {/* Currency */}
                            {/* <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Currency"
                                    name="currency"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.currency}
                                    variant="outlined"
                                    disabled
                                    error={touched.currency && Boolean(errors.currency)}
                                    helperText={touched.currency && errors.currency}
                                    style={{ height: '40px' }}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    options={countries}
                                    getOptionLabel={(option) => option.currency}
                                    size="small"
                                    onBlur={() => setFieldTouched('currency', touched.currency)}
                                    onChange={(event, newValue) => {
                                        setFieldValue('currency', newValue?.currency);
                                    }}
                                    isOptionEqualToValue={(option, value) => option.currency.toLowerCase() === value.currency.toLowerCase()}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Currency"
                                            error={touched.currency && Boolean(errors.currency)}
                                            helperText={touched.currency && errors.currency}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={`${option.id}-${option.country_id}`}>
                                            {option.emoji} {option.currency}
                                        </Box>
                                    )}
                                />
                            </Grid>
                            {/* Billing address */}
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Billing Address (As per GSTIN)"
                                    name="billing_address"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.billing_address}
                                    variant="outlined"
                                    error={touched.billing_address && Boolean(errors.billing_address)}
                                    helperText={touched.billing_address && errors.billing_address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                {/* {(values.country === '101' || values.country === 101) && ( */}
                                <TextField
                                    fullWidth
                                    label="Billing pin/zip code"
                                    name="billing_pin_code"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.billing_pin_code}
                                    variant="outlined"
                                    // disabled={values.country !== 101 && values.country !== '101'}
                                    error={touched.billing_pin_code && Boolean(errors.billing_pin_code)}
                                    helperText={touched.billing_pin_code && errors.billing_pin_code}
                                />
                                {/* )} */}
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.correspondence_same_as_billing_address}
                                            onChange={(e) => {
                                                setFieldValue('correspondence_same_as_billing_address', e.target.checked);
                                                setFieldValue('correspondence_address', e.target.checked ? values.billing_address : '');
                                                setFieldValue('correspondence_pin_code', e.target.checked ? values.billing_pin_code : '');
                                            }}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="subtitle1">Correspondence Address same as billing address</Typography>}
                                />
                            </Grid>
                            {/* Correspondence Address */}
                            <Grid item xs={12} sm={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Correspondence Address"
                                    name="correspondence_address"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={
                                        values.correspondence_same_as_billing_address
                                            ? values.billing_address
                                            : values.correspondence_address
                                    }
                                    variant="outlined"
                                    error={touched.correspondence_address && Boolean(errors.correspondence_address)}
                                    helperText={touched.correspondence_address && errors.correspondence_address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                {/* {(values.country === '101' || values.country === 101) && ( */}
                                <TextField
                                    fullWidth
                                    label="Correspondence pin/zip code"
                                    name="correspondence_pin_code"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    // disabled={values.country !== 101 && values.country !== '101'}
                                    type="text"
                                    value={
                                        values.correspondence_same_as_billing_address
                                            ? values.billing_pin_code
                                            : values.correspondence_pin_code
                                    }
                                    variant="outlined"
                                    error={touched.correspondence_pin_code && Boolean(errors.correspondence_pin_code)}
                                    helperText={touched.correspondence_pin_code && errors.correspondence_pin_code}
                                />
                            </Grid>
                            {/* Primary Contact Person */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Contact person (Primary)"
                                    name="primary_contact_name"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.primary_contact_name}
                                    variant="outlined"
                                    error={touched.primary_contact_name && Boolean(errors.primary_contact_name)}
                                    helperText={touched.primary_contact_name && errors.primary_contact_name}
                                />
                            </Grid>
                            {/* Email */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Primary Email Address"
                                    name="primary_email"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    autoComplete="new-email"
                                    type="email"
                                    value={values.primary_email}
                                    variant="outlined"
                                    error={touched.primary_email && Boolean(errors.primary_email)}
                                    helperText={touched.primary_email && errors.primary_email}
                                />
                            </Grid>
                            {/* Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Primary Phone Number"
                                    name="primary_phone"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="tel"
                                    value={values.primary_phone}
                                    variant="outlined"
                                    error={touched.primary_phone && Boolean(errors.primary_phone)}
                                    helperText={touched.primary_phone && errors.primary_phone}
                                    InputProps={{
                                        startAdornment: (
                                            <Autocomplete
                                                id="primary_phone_code"
                                                options={countries}
                                                getOptionLabel={(option) => {
                                                    if (option.phone_code.startsWith('+')) return `${option.phone_code}`;

                                                    return `+${option.phone_code}`;
                                                }}
                                                value={{ phone_code: values?.primary_phone_code || '' }}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('primary_phone_code', newValue?.phone_code || '');
                                                }}
                                                isOptionEqualToValue={(option, value) => option.phone_code === value.phone_code}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        style={{ minWidth: 100 }}
                                                        key={`${params.inputProps.value}-${params.inputProps.placeholder}`}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            autoComplete: 'off' // Disable autocomplete for this input field
                                                        }}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li"
                                                        {...props}
                                                        key={option.country_id}
                                                        // value={{ primary_phone_code: values.primary_phone_code || '' }}
                                                    >
                                                        {option.emoji} {option.phone_code}
                                                    </Box>
                                                )}
                                                disabled
                                            />
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} />
                            {/* Secondary Contact Person */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Contact person (Secondary)"
                                    name="secondary_contact_name"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.secondary_contact_name}
                                    variant="outlined"
                                    error={touched.secondary_contact_name && Boolean(errors.secondary_contact_name)}
                                    helperText={touched.secondary_contact_name && errors.secondary_contact_name}
                                />
                            </Grid>
                            {/* Email */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Secondary Email Address"
                                    name="secondary_email"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    autoComplete="new-email"
                                    type="email"
                                    value={values.secondary_email}
                                    variant="outlined"
                                    error={touched.secondary_email && Boolean(errors.secondary_email)}
                                    helperText={touched.secondary_email && errors.secondary_email}
                                />
                            </Grid>
                            {/* Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Secondary Phone Number"
                                    name="secondary_phone"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="tel"
                                    value={values.secondary_phone}
                                    variant="outlined"
                                    error={touched.secondary_phone && Boolean(errors.secondary_phone)}
                                    helperText={touched.secondary_phone && errors.secondary_phone}
                                    InputProps={{
                                        startAdornment: (
                                            <Autocomplete
                                                id="sec_phone_code"
                                                options={countries}
                                                getOptionLabel={(option) => {
                                                    const countryCode = option.phone_code.startsWith('+')
                                                        ? option.phone_code
                                                        : `+${option.phone_code}`;
                                                    return `${countryCode}`;
                                                }}
                                                value={{ phone_code: values.sec_phone_code || '' }}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('sec_phone_code', newValue?.phone_code || '');
                                                }}
                                                isOptionEqualToValue={(option, value) => option.phone_code === value.phone_code}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        style={{ minWidth: 120 }}
                                                        key={`${params.inputProps.value}-${params.inputProps.placeholder}`}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props} key={option.country_id}>
                                                        {option.emoji} {option.phone_code}
                                                    </Box>
                                                )}
                                                disabled
                                            />
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} />
                            {/* Password */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onBlur={handleBlur}
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        error={touched.password && Boolean(errors.password)}
                                    />
                                    {strength > 0 && (
                                        <Box mt={1}>
                                            <Typography variant="subtitle1" fontSize="0.75rem" color={level.color}>
                                                {level.label}
                                            </Typography>
                                        </Box>
                                    )}
                                    {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        type={showCPassword ? 'text' : 'password'}
                                        value={values.confirmpassword}
                                        onBlur={handleBlur}
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirmpassword visibility"
                                                    onClick={handleClickShowCPassword}
                                                    onMouseDown={handleMouseDownCPassword}
                                                    edge="end"
                                                >
                                                    {showCPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="ConfirmPassword"
                                        error={touched.confirmpassword && Boolean(errors.confirmpassword)}
                                    />
                                    {touched.confirmpassword && errors.confirmpassword && (
                                        <FormHelperText error>{errors.confirmpassword}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* Vehicle Type */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                                    <Select
                                        labelId="vehicle-type-label"
                                        id="vehicle-type"
                                        name="vehicletype"
                                        value={values.vehicletype}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={touched.vehicletype && Boolean(errors.vehicletype)}
                                        label="Vehicle Type"
                                        multiple
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>None</em>;
                                            }

                                            const selectedOptions = selected.map((value) => {
                                                if (value && value.id) {
                                                    return (
                                                        <Chip
                                                            key={`${value.id}-${value.vehicle_type}`}
                                                            label={value.vehicle_type}
                                                            onClick={() => {
                                                                const index = values.vehicletype.findIndex((item) => item.id === value.id);
                                                                if (index > -1) {
                                                                    const updatedValues = [...values.vehicletype];
                                                                    updatedValues.splice(index, 1);
                                                                    handleChange({
                                                                        target: { name: 'vehicletype', value: updatedValues }
                                                                    });
                                                                }
                                                            }}
                                                            sx={{
                                                                mb: '2px',
                                                                mr: '2px'
                                                            }}
                                                        />
                                                    );
                                                }
                                                return null;
                                            });

                                            return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{selectedOptions}</div>;
                                        }}
                                        open={isVOpen}
                                        onClose={() => setIsVOpen(false)}
                                        onOpen={() => setIsVOpen(true)}
                                    >
                                        {vehicles.map((vehicle) => (
                                            <MenuItem key={vehicle.id} value={vehicle}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values.vehicletype.includes(vehicle)}
                                                            onChange={handleChange}
                                                            name="vehicletype"
                                                            value={vehicle}
                                                            style={{ pointerEvents: 'none' }}
                                                        />
                                                    }
                                                    label={vehicle.vehicle_type}
                                                />
                                            </MenuItem>
                                        ))}
                                        {isVOpen && (
                                            <Button variant="contained" color="primary" onClick={handleOK} fullWidth>
                                                OK
                                            </Button>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Lane Route */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="lane-route-label">Lane Route</InputLabel>
                                    <Select
                                        labelId="lane-route-label"
                                        id="lane-route"
                                        name="laneRoute"
                                        value={values.laneRoute}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={touched.laneRoute && Boolean(errors.laneRoute)}
                                        label="Lane Route"
                                        multiple
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>None</em>;
                                            }

                                            const selectedOptions = selected.map((value) => {
                                                if (value && value.id) {
                                                    return (
                                                        <Chip
                                                            sx={{ pt: '6px', pb: '6px', height: '50px', mr: '2px' }}
                                                            key={value.id}
                                                            label={
                                                                <>
                                                                    <span>
                                                                        {`${value.from} `}
                                                                        <small>(Origin)</small>
                                                                    </span>
                                                                    <br />
                                                                    <span>
                                                                        {`${value.to} `}
                                                                        <small>(Destination)</small>
                                                                    </span>
                                                                </>
                                                            }
                                                            onClick={() => {
                                                                const index = values.laneRoute.findIndex((item) => item.id === value.id);
                                                                if (index > -1) {
                                                                    const updatedValues = [...values.laneRoute];
                                                                    updatedValues.splice(index, 1);
                                                                    handleChange({
                                                                        target: { name: 'laneRoute', value: updatedValues }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    );
                                                }
                                                return null;
                                            });
                                            return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{selectedOptions}</div>;
                                        }}
                                        open={isOpen}
                                        onClose={() => setIsOpen(false)}
                                        onOpen={() => setIsOpen(true)}
                                    >
                                        {lanes.map((route) => (
                                            <MenuItem key={route.id} value={route}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values.laneRoute.includes(route)}
                                                            onChange={handleChange}
                                                            name="laneRoute"
                                                            style={{ pointerEvents: 'none' }}
                                                        />
                                                    }
                                                    label={
                                                        <>
                                                            <span>
                                                                {`${route.from} `}
                                                                <small>(Origin)</small>
                                                            </span>
                                                            <br />
                                                            <span>
                                                                {`${route.to} `}
                                                                <small>(Destination)</small>
                                                            </span>
                                                        </>
                                                    }
                                                />
                                            </MenuItem>
                                        ))}
                                        {isOpen && (
                                            <Button variant="contained" color="primary" onClick={handleOK} fullWidth>
                                                OK
                                            </Button>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    disablePortal
                                    options={contactPerson}
                                    getOptionLabel={(option) => option.name}
                                    size="small"
                                    onBlur={() => setFieldTouched('contact_person', touched.contact_person)}
                                    onChange={(event, newValue) => {
                                        setFieldValue('contact_person', newValue?.id);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a Contact Person"
                                            error={touched.contact_person && Boolean(errors.contact_person)}
                                            helperText={touched.contact_person && errors.contact_person}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                />
                            </Grid>
                            {/* <Grid item xs={12} md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Account No."
                                    name="confirmAccountNo"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.confirmAccountNo}
                                    variant="outlined"
                                    error={touched.confirmAccountNo && Boolean(errors.confirmAccountNo)}
                                />
                                {touched.confirmAccountNo && errors.confirmAccountNo && (
                                    <FormHelperText error>{errors.confirmAccountNo}</FormHelperText>
                                )}
                            </Grid> */}
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography variant="subtitle1" fontSize="0.75rem">
                                    Organization Type:
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-label="org_type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.org_type}
                                        name="org_type"
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Private Limited" />
                                        <FormControlLabel value="2" control={<Radio />} label="Limited" />
                                        <FormControlLabel value="3" control={<Radio />} label="Partnership (including LLP)" />
                                        <FormControlLabel value="4" control={<Radio />} label="Sole Proprietorship" />
                                        <FormControlLabel value="5" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {/* SET REASON */}
                            {values.org_type === '5' && (
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Please Specify"
                                        name="other_org_type"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        error={touched.other_org_type && Boolean(errors.other_org_type)}
                                        helperText={touched.other_org_type && errors.other_org_type}
                                    />
                                </Grid>
                            )}
                            {/* CIN Number */}
                            {(values.org_type === '1' || values.org_type === '2') && values.country === 101 && (
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        fullWidth
                                        label="CIN Number"
                                        name="cin_no"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.cin_no.toUpperCase()}
                                        variant="outlined"
                                        error={touched.cin_no && Boolean(errors.cin_no)}
                                        helperText={touched.cin_no && errors.cin_no}
                                    />
                                </Grid>
                            )}
                            {/* Incorportion Certificate */}
                            {(values.org_type === '1' || values.org_type === '2') && values.country === 101 && (
                                <Grid item xs={6} sm={6} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Incorporation Certificate (jpeg, png, pdf { MAX SIZE: 2MB})"
                                        name="incorporation_certificate"
                                        size="small"
                                        onBlur={handleBlur}
                                        type="file"
                                        accept="image/jpeg, image/png, application/pdf"
                                        // onChange={handleChange}
                                        // value={values.aadhar}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        error={touched.incorporation_certificate && Boolean(errors.incorporation_certificate)}
                                        helperText={touched.incorporation_certificate && errors.incorporation_certificate}
                                        style={{ marginBottom: '10px' }}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (
                                                file &&
                                                (file.type.startsWith('image/') || file.type === 'application/pdf') &&
                                                file.size < MAX_FILE_SIZE_REGISTER * 1024
                                            ) {
                                                // Valid image file
                                                setFieldValue('incorporation_certificate', file);
                                                console.log(file.type);
                                                if (file.type.startsWith('image/')) {
                                                    setIcType('img');
                                                    setICPreview(URL.createObjectURL(file));
                                                } else {
                                                    setIcType('pdf');
                                                    setICPreview(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
                                                }
                                            } else {
                                                // Invalid file type
                                                event.target.value = '';
                                                setFieldValue('incorporation_certificate', null);
                                                setIcType('pdf');
                                                setICPreview(null);
                                                // Show error message or perform any other action
                                                let errorMsg = 'Please select a valid file type (JPEG, PNG, PDF)';
                                                if (file.size > MAX_FILE_SIZE_REGISTER * 1024)
                                                    errorMsg = 'Please select a file below 2MB in size';
                                                // Show error message or perform any other action
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: errorMsg,
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
                                    {icPreview && (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            sx={{ height: '400px', overflowX: 'auto', position: 'relative' }}
                                        >
                                            <IconButton
                                                aria-label="toggle remove doc/image"
                                                onClick={() => {
                                                    handleFileRemove('ic');
                                                    setFieldValue('incorporation_certificate', null);
                                                }}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    position: 'absolute!important',
                                                    top: '16px',
                                                    right: '16px',
                                                    zIndex: '999',
                                                    backgroundColor: theme.palette.error.dark,
                                                    padding: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <HighlightOffIcon />
                                            </IconButton>
                                            {icType === 'img' && (
                                                <img
                                                    src={icPreview}
                                                    alt="Incorporation Certificate Preview"
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '10px',
                                                        height: 'auto',
                                                        // justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                />
                                            )}
                                            {icType === 'pdf' && (
                                                <iframe
                                                    id="ic_cert"
                                                    title="incorporation certificate doc preview"
                                                    width="100%"
                                                    height="100%"
                                                    src={icPreview}
                                                />
                                            )}
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                            {/* MSME  */}
                            <Grid item sm={12} md={12} sx={{ display: 'flex' }}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                        MSME Registration:
                                    </Typography>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-label="msme registration"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.msme_registration}
                                            name="msme_registration"
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {values.msme_registration === 'yes' && (
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="MSME No."
                                            name="msme_no"
                                            size="small"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.msme_no.toUpperCase()}
                                            variant="outlined"
                                            error={touched.msme_no && Boolean(errors.msme_no)}
                                            helperText={touched.msme_no && errors.msme_no}
                                            sx={{
                                                marginTop: '16px'
                                            }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                            {/* MSME Image */}
                            {values.msme_registration === 'yes' && (
                                <Grid item xs={6} sm={6} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Upload MSME Certificate (jpeg, png, pdf { MAX SIZE: 2MB})"
                                        name="msme_certificate"
                                        size="small"
                                        onBlur={handleBlur}
                                        type="file"
                                        accept="image/jpeg, image/png, application/pdf"
                                        // onChange={handleChange}
                                        // value={values.aadhar}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        error={touched.msme_certificate && Boolean(errors.msme_certificate)}
                                        helperText={touched.msme_certificate && errors.msme_certificate}
                                        style={{ marginBottom: '10px' }}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (
                                                file &&
                                                (file.type.startsWith('image/') || file.type === 'application/pdf') &&
                                                file.size < MAX_FILE_SIZE_REGISTER * 1024
                                            ) {
                                                // Valid image file
                                                setFieldValue('msme_certificate', file);
                                                if (file.type.startsWith('image/')) {
                                                    setMSMEType('img');
                                                    setMSMEPreview(URL.createObjectURL(file));
                                                } else {
                                                    setMSMEType('pdf');
                                                    setMSMEPreview(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
                                                }
                                                // setGSTPreview(URL.createObjectURL(file));
                                            } else {
                                                // Invalid file type
                                                event.target.value = '';
                                                setMSMEType('');
                                                setFieldValue('msme_certificate', null);
                                                setMSMEPreview(null);
                                                // Show error message or perform any other action
                                                let errorMsg = 'Please select a valid file type (JPEG, PNG, PDF)';
                                                if (file.size > MAX_FILE_SIZE_REGISTER * 1024)
                                                    errorMsg = 'Please select a file below 2MB in size';
                                                // Show error message or perform any other action
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: errorMsg,
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

                                    {msmePreview && (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            sx={{ height: '400px', overflowX: 'auto', position: 'relative' }}
                                        >
                                            <IconButton
                                                aria-label="toggle remove doc/image"
                                                onClick={() => {
                                                    handleFileRemove('msme');
                                                    setFieldValue('msme_certificate', null);
                                                }}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    position: 'absolute!important',
                                                    top: '16px',
                                                    right: '16px',
                                                    zIndex: '999',
                                                    backgroundColor: theme.palette.error.dark,
                                                    padding: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <HighlightOffIcon />
                                            </IconButton>
                                            {msmeType === 'img' && (
                                                <img
                                                    src={msmePreview}
                                                    alt="MSME Preview"
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '10px',
                                                        height: 'auto',
                                                        // justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                />
                                            )}
                                            {msmeType === 'pdf' && (
                                                <iframe
                                                    id="msme_cert"
                                                    title="msme doc preview"
                                                    width="100%"
                                                    height="100%"
                                                    src={msmePreview}
                                                />
                                            )}
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                            {/* Pan Card No */}
                            {values.country === 101 && (
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Pan Number"
                                        name="pan_card_no"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.pan_card_no.toUpperCase()}
                                        variant="outlined"
                                        error={touched.pan_card_no && Boolean(errors.pan_card_no)}
                                        helperText={touched.pan_card_no && errors.pan_card_no}
                                    />
                                </Grid>
                            )}
                            {values.country === 101 && (
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Name as per PAN"
                                        name="pan_name"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.pan_name.toUpperCase()}
                                        variant="outlined"
                                        error={touched.pan_name && Boolean(errors.pan_name)}
                                        helperText={touched.pan_name && errors.pan_name}
                                    />
                                </Grid>
                            )}
                            {/* PAN Image */}
                            {values.country === 101 && (
                                <Grid item xs={6} sm={6} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Upload PAN Card (jpeg, png, pdf { MAX SIZE: 2MB})"
                                        name="pan"
                                        size="small"
                                        onBlur={handleBlur}
                                        type="file"
                                        accept="image/jpeg, image/png, application/pdf"
                                        // onChange={handleChange}
                                        // value={values.aadhar}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        error={touched.pan && Boolean(errors.pan)}
                                        helperText={touched.pan && errors.pan}
                                        style={{ marginBottom: '10px' }}
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (
                                                file &&
                                                (file.type.startsWith('image/') || file.type === 'application/pdf') &&
                                                file.size < MAX_FILE_SIZE_REGISTER * 1024
                                            ) {
                                                // Valid image file
                                                setFieldValue('pan', file);
                                                if (file.type.startsWith('image/')) {
                                                    setPanType('img');
                                                    setPanPreview(URL.createObjectURL(file));
                                                } else {
                                                    setPanType('pdf');
                                                    setPanPreview(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
                                                }
                                            } else {
                                                // Invalid file type
                                                setPanType('');
                                                event.target.value = '';
                                                setFieldValue('pan', null);
                                                setPanPreview(null);
                                                // Show error message or perform any other action
                                                let errorMsg = 'Please select a valid file type (JPEG, PNG, PDF)';
                                                if (file.size > MAX_FILE_SIZE_REGISTER * 1024)
                                                    errorMsg = 'Please select a file below 2MB in size';
                                                // Show error message or perform any other action
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: errorMsg,
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

                                    {panPreview && (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            sx={{ height: '400px', overflowX: 'auto', position: 'relative' }}
                                        >
                                            <IconButton
                                                aria-label="toggle remove doc/image"
                                                onClick={() => {
                                                    handleFileRemove('pan');
                                                    setFieldValue('pan', null);
                                                }}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    position: 'absolute!important',
                                                    top: '16px',
                                                    right: '16px',
                                                    zIndex: '999',
                                                    backgroundColor: theme.palette.error.dark,
                                                    padding: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <HighlightOffIcon />
                                            </IconButton>
                                            {panType === 'img' && (
                                                <img
                                                    src={panPreview}
                                                    alt="Pan Preview"
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '10px',
                                                        height: 'auto',
                                                        // justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                />
                                            )}
                                            {panType === 'pdf' && (
                                                <iframe id="pan_cert" title="pan doc preview" width="100%" height="100%" src={panPreview} />
                                            )}
                                        </Grid>
                                    )}
                                </Grid>
                            )}

                            {/* Account Holder Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Account Holder Name"
                                    name="account_holder"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.account_holder}
                                    variant="outlined"
                                    error={touched.account_holder && Boolean(errors.account_holder)}
                                    helperText={touched.account_holder && errors.account_holder}
                                    sx={{
                                        marginTop: '16px'
                                    }}
                                />
                            </Grid>
                            {/* Account Type */}
                            <Grid item xs={12} sm={12} md={6}>
                                <Typography variant="subtitle1" fontSize="0.75rem">
                                    Account Type:
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-label="Account Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.account_type}
                                        name="account_type"
                                    >
                                        <FormControlLabel value="current" control={<Radio />} label="Current" />
                                        <FormControlLabel value="savings" control={<Radio />} label="Savings" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {/* Account No. */}
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Account No."
                                    name="account_number"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.account_number}
                                    variant="outlined"
                                    error={touched.account_number && Boolean(errors.account_number)}
                                    helperText={touched.account_number && errors.account_number}
                                />
                            </Grid>
                            {/* IFSC Code */}
                            {(values.country === 101 || values.country === '101') && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="IFSC Code"
                                        name="ifsc_code"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.ifsc_code.toUpperCase()}
                                        variant="outlined"
                                        error={touched.ifsc_code && Boolean(errors.ifsc_code)}
                                        helperText={touched.ifsc_code && errors.ifsc_code}
                                    />
                                </Grid>
                            )}
                            {/* Bank Name */}
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Bank name"
                                    name="bank_name"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    defaultValue={values.bank_name}
                                    variant="outlined"
                                    error={touched.bank_name && Boolean(errors.bank_name)}
                                    helperText={touched.bank_name && errors.bank_name}
                                />
                            </Grid>
                            {/* Branch Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Branch Name"
                                    name="branch_name"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.branch_name}
                                    variant="outlined"
                                    error={touched.branch_name && Boolean(errors.branch_name)}
                                    helperText={touched.branch_name && errors.branch_name}
                                />
                            </Grid>
                            {/* Branch Address */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Branch Address"
                                    name="branch_address"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.branch_address}
                                    variant="outlined"
                                    error={touched.branch_address && Boolean(errors.branch_address)}
                                    helperText={touched.branch_address && errors.branch_address}
                                />
                            </Grid>

                            {/* PAN Image */}
                            <Grid item xs={6} sm={6} md={12}>
                                <TextField
                                    fullWidth
                                    label="Cancelled Cheque (jpeg, png, pdf { MAX SIZE: 2MB})"
                                    name="cancelled_cheque"
                                    size="small"
                                    onBlur={handleBlur}
                                    type="file"
                                    accept="image/jpeg, image/png, application/pdf"
                                    // onChange={handleChange}
                                    // value={values.aadhar}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={touched.cancelled_cheque && Boolean(errors.cancelled_cheque)}
                                    helperText={touched.cancelled_cheque && errors.cancelled_cheque}
                                    style={{ marginBottom: '10px' }}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (
                                            file &&
                                            (file.type.startsWith('image/') || file.type === 'application/pdf') &&
                                            file.size < MAX_FILE_SIZE_REGISTER * 1024
                                        ) {
                                            // Valid image file
                                            setFieldValue('cancelled_cheque', file);
                                            if (file.type.startsWith('image/')) {
                                                setChequeType('img');
                                                setChequePreview(URL.createObjectURL(file));
                                            } else {
                                                setChequeType('pdf');
                                                setChequePreview(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
                                            }
                                            setChequePreview(URL.createObjectURL(file));
                                        } else {
                                            // Invalid file type
                                            setChequeType('');
                                            event.target.value = '';
                                            setFieldValue('cancelled_cheque', null);
                                            setChequePreview(null);
                                            // Show error message or perform any other action
                                            let errorMsg = 'Please select a valid file type (JPEG, PNG, PDF)';
                                            if (file.size > MAX_FILE_SIZE_REGISTER * 1024)
                                                errorMsg = 'Please select a file below 2MB in size';
                                            // Show error message or perform any other action
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: errorMsg,
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
                                {chequePreview && (
                                    <Grid item xs={12} sm={12} md={12} sx={{ height: '400px', overflowX: 'auto', position: 'relative' }}>
                                        <IconButton
                                            aria-label="toggle remove doc/image"
                                            onClick={() => {
                                                handleFileRemove('cc');
                                                setFieldValue('cancelled_cheque', null);
                                            }}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{
                                                position: 'absolute!important',
                                                top: '16px',
                                                right: '16px',
                                                zIndex: '999',
                                                backgroundColor: theme.palette.error.dark,
                                                padding: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <HighlightOffIcon />
                                        </IconButton>
                                        {chequeType === 'img' && (
                                            <img
                                                src={chequePreview}
                                                alt="Cheque Preview"
                                                style={{
                                                    width: '100%',
                                                    marginTop: '10px',
                                                    height: 'auto',
                                                    // justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            />
                                        )}
                                        {chequeType === 'pdf' && (
                                            <iframe id="cheque" title="cheque doc preview" width="100%" height="100%" src={chequePreview} />
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                            {/* Swift Code */}
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Swift code"
                                    name="swift_code"
                                    size="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.swift_code.toUpperCase()}
                                    variant="outlined"
                                    error={touched.swift_code && Boolean(errors.swift_code)}
                                    helperText={touched.swift_code && errors.swift_code}
                                />
                            </Grid>
                            {/* Aggregate annual turnover */}
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="vehicle-type-label">Annual Aggregate Turnover</InputLabel>
                                    <Select
                                        labelId="aggregate_annual_turnover"
                                        id="aggregate_annual_turnover"
                                        name="aggregate_annual_turnover"
                                        value={values.aggregate_annual_turnover}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={touched.aggregate_annual_turnover && Boolean(errors.aggregate_annual_turnover)}
                                        label="Annual Aggregate Turnover"
                                        open={isTurnoverOpen}
                                        onClose={() => setIsTurnoverOpen(false)}
                                        onOpen={() => setIsTurnoverOpen(true)}
                                    >
                                        <MenuItem key="0" value="">
                                            Please select aggregate turnover
                                        </MenuItem>
                                        <MenuItem key="1" value="1">
                                            Less than 2 Million
                                        </MenuItem>
                                        <MenuItem key="2" value="2">
                                            More than 2 Million
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Checkbox */}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(e) => setChecked(e.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            I have read the{' '}
                                            <Typography
                                                variant="subtitle1"
                                                component={Link}
                                                to="/terms"
                                                color="secondary"
                                                name="check"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Terms and Conditions
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>

                            {/* Declaration check */}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.declaration_confirmation}
                                            onChange={(e) => setFieldValue('declaration_confirmation', e.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            {`I on behalf of ${values.entity_name || ''} do hereby delcare that all the
                                            information provided is true and nothing has been concealed. I further declare that no
                                            information shared by Holisol will be disclosed to any third party. I will not offer any bribes
                                            to representatives of Holisol. In any such case Holisol shall have right to terminate the
                                            Service agreement without any prior notice. In case any representative of Holisol contacts me
                                            for any type of unethical business practice, I will inform to the office of Holisol.`}
                                        </Typography>
                                    }
                                />
                            </Grid>
                            {/* Buttons */}
                            <Grid item xs={12}>
                                <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 2 : 1}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth={matchDownSM}
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting}
                                        >
                                            Submit Registration Request
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
