import React, { useEffect, useState } from 'react';

// material-ui
import { Button, FormHelperText, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import '@mui/lab';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
// // third-party
import * as yup from 'yup';
// import ProductsPage from './ProductsPage';
// import TotalCard from './TotalCard';
import { useFormik } from 'formik';

import Map from '../../gmaps/gmaps';
import axios from 'utils/axios';

// yup validation-schema
const validationSchema = yup.object({
    country: yup.string().required('Country is Required'),
    statename: yup.string().required('State is Required'),
    city: yup.string().required('City is required'),
    HubName: yup.string().required('Hubname is required')
});

// ==============================|| CREATE INVOICE ||============================== //

function CreateHub({ disabling, update }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [country, setcountry] = useState([]);
    const [states, setstate] = useState([]);
    const [city, setcity] = useState([]);
    const [coordinate, setcoordinates] = useState([]);
    const [mapcor, setmapcor] = useState([]);
    const [idkeys, setidkeys] = useState({ country: '', state: '', city: '' });

    const formik = useFormik({
        initialValues: {
            country: '',
            statename: '',
            city: '',
            HubName: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    const hubName = values.HubName || '';
                    const lang = mapcor.lng;
                    const lat = mapcor.lat;
                    const stateId = idkeys.state;
                    const countryId = idkeys.country;
                    const countryID = values.country || '';
                    const stateID = values.statename || '';
                    const cityID = values.city || '';
                    setOpen(true);
                    console.log(mapcor);
                    if (mapcor.length === 0) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: 'Please Select coordinates from map !',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                transition: 'SlideLeft',
                                close: true
                            })
                        );
                        return;
                    }
                    await axios.post('/hubs', { hubName, stateId, countryId, lat, lang, countryID, stateID, cityID });

                    resetForm();
                    disabling(false);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Hub Created successfully !',
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
        }
    });

    const handleMenu = async (event, key, id) => {
        const cid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/state?country_id=${cid}`);

        setstate(res.data.data.state);
        setidkeys((prevState) => ({ ...prevState, country: key }));
        formik.setFieldValue('statename', '');
        formik.setFieldError('statename', 'State is Required');
        formik.setFieldValue('city', '');
        setcity([]);
    };

    const handleMenu1 = async (event, key, id) => {
        const cityid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/city?state_id=${cityid}`);
        formik.setFieldValue('city', '');
        setcity(res.data.data.city);
        setidkeys((prevState) => ({ ...prevState, state: key }));
    };

    const handlemapvalue = async (event, coordinatemap) => {
        const corhub = city.filter((city) => city.id === event.target.getAttribute('data-value'));
        setcoordinates(coordinatemap);
        // setidkeys((prevState) => ({ ...prevState, city: key }));
    };

    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setcountry(res.data.data.country);
    };

    useEffect(() => {
        getCountry();
    }, []);

    const handlerfunc = (mapcor) => {
        setmapcor(mapcor);
    };

    return (
        <>
            <Map cor={coordinate} rcor={handlerfunc} />
            <MainCard title="Create Hub">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
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
                                            onClick={(event) => {
                                                handleMenu(event, item.id, item.country_id);
                                                formik.setFieldValue('statename', '');
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
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>State</InputLabel>
                                <Select
                                    id="statename"
                                    name="statename"
                                    defaultValue="Select State"
                                    // value={formik.values.statename || 'Select State'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.state_id}
                                            onClick={(event) => handleMenu1(event, item.id, item.state_id)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.statename && <FormHelperText error>{formik.errors.statename}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                                            onClick={(event) => handlemapvalue(event, item.location.coordinates)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.city && <FormHelperText error>{formik.errors.city}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack>
                                <InputLabel required>Hub Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="HubName"
                                    name="HubName"
                                    value={formik.values.HubName}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.HubName && Boolean(formik.errors.HubName)}
                                    helperText={formik.touched.HubName && formik.errors.HubName}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Hub Name"
                                />
                            </Stack>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Hub
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateHub;
