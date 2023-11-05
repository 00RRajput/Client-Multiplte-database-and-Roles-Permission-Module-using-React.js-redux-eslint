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
    Select,
    Stack,
    TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
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
    country: yup.string().required('Country Name is Required'),
    state: yup.string().required('State Name is Required'),
    cityfrom: yup.string().required('City Name is Required'),
    state1: yup.string().required('State Name is Required'),
    cityto: yup.string().required('City Name is Required')
});
// ==============================|| CREATE LANE ||============================== //

function CreateLane({ create }) {
    const dispatch = useDispatch();
    // const [open, setOpen] = useState(false);
    const [cityfrom, setfromcity] = useState([]);
    const [cityto, settocity] = useState([]);
    const [states, setStates] = useState([]);
    const [cityfromCor, setfromcityCor] = useState([]);
    const [citytoCor, settocityCor] = useState([]);
    const [name, setName] = useState({ fromcity: '', tocity: '', from_city_id: '', to_city_id: '' });
    const [country, setCountry] = useState([]);
    const formik = useFormik({
        initialValues: {
            country: '',
            state: '',
            cityfrom: '',
            cityto: '',
            state1: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // if (values) {
            //     setOpen(true);
            // }
            try {
                await axios.post('/routes/lane', {
                    country: values.country,
                    from_lat_lng: cityfromCor,
                    to_lat_lng: citytoCor,
                    from_city: name.fromcity,
                    to_city: name.tocity,
                    from_city_id: name.from_city_id,
                    to_city_id: name.to_city_id,
                    from_state_id: values.state,
                    to_state_id: values.state1
                });
                console.log('sending');
                create();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lane Created successfully !',
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
    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setCountry(res.data.data.country);
    };
    // const getStates = async () => {
    //     const CountryId = 101;
    //     const res = await axios.get(`/location/state?country_id=${CountryId}`);
    //     setStates(res.data.data.state);
    // };
    const handleCountry = async (id) => {
        console.log('hi', id);
        const res = await axios.get(`/location/state?country_id=${id}`);
        setStates(res.data.data.state);
        formik.setFieldValue('country', id);
        formik.setFieldValue('cityfrom', '');
        setfromcity([]);
        formik.setFieldValue('cityto', '');
        settocity([]);
        formik.setFieldValue('state', '');
        formik.setFieldValue('state1', '');
    };

    useEffect(() => {
        getCountry();
        // getStates();
    }, []);
    const handleMenu = async (event, key) => {
        const cityid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/city?state_id=${cityid}`);
        setfromcity(res.data.data.city);
        formik.setFieldValue('cityfrom', '');
    };
    const handleMenu1 = async (event, key) => {
        const cityid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/city?state_id=${cityid}`);
        settocity(res.data.data.city);
        formik.setFieldValue('cityto', '');
    };
    const handleCity = async (event, name, id, cordinates) => {
        setName((prevState) => ({ ...prevState, fromcity: name, from_city_id: id }));
        setfromcityCor(cordinates);
    };
    const handleCity1 = async (event, name, id, cordinates) => {
        setName((prevState) => ({ ...prevState, tocity: name, to_city_id: id }));
        settocityCor(cordinates);
    };
    return (
        <>
            <MainCard title="Create Lane">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select Country</InputLabel>
                                <Select
                                    id="country"
                                    name="country"
                                    defaultValue="Select Country"
                                    // value={formik.values.country}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select Country" disabled>
                                        Select Country
                                    </MenuItem>
                                    {country.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.country_id}
                                            onClick={() => {
                                                handleCountry(item.country_id);
                                                formik.setFieldValue('state', '');
                                                formik.setFieldValue('state1', '');
                                                formik.setFieldValue('cityfrom', '');
                                                formik.setFieldValue('cityto', '');
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
                                <InputLabel required>Select From State</InputLabel>
                                <Select
                                    id="state"
                                    name="state"
                                    defaultValue="Select From Location State"
                                    // value={formik.values.country}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select From Location State" disabled>
                                        Select From Location State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.state_id}
                                            onClick={(event) => {
                                                handleMenu(event, item.id);
                                                formik.setFieldValue('cityfrom', '');
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.state && <FormHelperText error>{formik.errors.state}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select To State</InputLabel>
                                <Select
                                    id="state1"
                                    name="state1"
                                    defaultValue="Select To Location State"
                                    // value={formik.values.country}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select To Location State" disabled>
                                        Select to Location State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.state_id}
                                            onClick={(event) => {
                                                handleMenu1(event, item.id);
                                                formik.setFieldValue('cityto', '');
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.state1 && <FormHelperText error>{formik.errors.state1}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select From City</InputLabel>
                                <Select
                                    id="cityfrom"
                                    name="cityfrom"
                                    defaultValue="Select From Location City"
                                    // value={formik.values.country}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select From Location City" disabled>
                                        Select From Location City
                                    </MenuItem>
                                    {cityfrom.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                            onClick={(event) => handleCity(event, item.name, item.city_id, item.location.coordinates)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.cityfrom && <FormHelperText error>{formik.errors.cityfrom}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select To City</InputLabel>
                                <Select
                                    id="cityto"
                                    name="cityto"
                                    defaultValue="Select To Location City"
                                    // value={formik.values.country}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select To Location City" disabled>
                                        Select To Location City
                                    </MenuItem>
                                    {cityto.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                            onClick={(event) => handleCity1(event, item.name, item.city_id, item.location.coordinates)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.cityto && <FormHelperText error>{formik.errors.cityto}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Lane
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateLane;
