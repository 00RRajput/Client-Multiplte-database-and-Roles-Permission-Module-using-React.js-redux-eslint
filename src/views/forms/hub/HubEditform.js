import React, { useEffect, useState } from 'react';

// material-ui
import { Button, FormHelperText, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
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

import Editgmaps from '../../gmaps/Editgmaps';
import axios from 'utils/axios';

// yup validation-schema
const validationSchema = yup.object({
    HubName: yup.string().min(3).max(20).required('HubName is required'),
    country: yup.string().required('Country is Required'),
    statename: yup.string().required('State is Required'),
    city: yup.string().required('City is required')
});

// ==============================|| CREATE INVOICE ||============================== //

function HubEditForm(props) {
    const dispatch = useDispatch();
    const [country, setcountry] = useState([]);
    const [states, setstate] = useState([]);
    const [city, setcity] = useState([]);
    const [coordinate, setcoordinates] = useState([]);
    const [mapcor, setmapcor] = useState([]);
    const [idkeys, setidkeys] = useState({ country: '', state: '', city: '' });
    const [open, setOpen] = useState(false);
    const { data, disabling } = props;

    let corarray = data.hub_loc.coordinates;
    if (coordinate.length !== 0) {
        corarray = coordinate;
    }
    console.log('data', data);
    const formik = useFormik({
        initialValues: {
            HubName: data.hubName,
            country: data.countryID || '',
            statename: data.stateID || '',
            city: data.cityID || ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    console.log(formik.values);
                    setOpen(true);
                    const hubName = values.HubName || '';
                    const stateId = idkeys.state || data.stateId || '';
                    // const cityId = idkeys.city;
                    const countryId = idkeys.country || data.countryId || '';
                    const stateID = values.statename || '';
                    const countryID = values.country || '';
                    const cityID = values.city || '';
                    const lat = mapcor.lat || '';
                    const lang = mapcor.lng || '';
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
                    await axios.put(`/hubs/${data.id}`, { hubName, lat, lang, stateId, countryId, stateID, countryID, cityID });
                    resetForm();
                    disabling(false);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Hub Updated successfully !',
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
                            message: 'unable to update hub, please try again !',
                            variant: 'alert',
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                }
            }
        }
    });
    const handleMenu = async (event, key) => {
        const cid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/state?country_id=${cid}`);
        // formik.setValues({ ...formik.values, statename: '', city: '' });
        setstate(res.data.data.state);
        formik.setFieldValue('statename', '');
        formik.setFieldError('statename', 'State is Required');
        formik.setFieldValue('city', '');
        formik.setFieldError('city', 'City is Required');
        setcity([]);
        setidkeys((prevState) => ({ ...prevState, country: key }));
    };

    const handleMenu1 = async (event, key) => {
        const cityid = event.target.getAttribute('data-value');
        const res = await axios.get(`/location/city?state_id=${cityid}`);
        setcity(res.data.data.city);
        formik.setFieldValue('city', '');
        setidkeys((prevState) => ({ ...prevState, state: key }));
    };

    const handlemapvalue = async (event, key, cordinatesmap) => {
        setcoordinates(cordinatesmap);
        setmapcor(cordinatesmap);
        setidkeys((prevState) => ({ ...prevState, city: key }));
    };

    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setcountry(res.data.data.country);
    };
    const getStates = async () => {
        const conId = data.countryID;
        const res = await axios.get(`/location/state?country_id=${conId}`);
        setstate(res.data.data.state);
    };
    const getCity = async () => {
        const stateId = data.stateID;
        const res = await axios.get(`/location/city?state_id=${stateId}`);
        setcity(res.data.data.city);
    };
    useEffect(() => {
        getCountry();
        getStates();
        getCity();
    }, []);
    const handlerfunc = (mapcor) => {
        setmapcor(mapcor);
    };

    return (
        <>
            <Editgmaps cor={corarray} rcor={handlerfunc} />
            <MainCard title="Update Hub">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Country</InputLabel>
                                <Select id="country" name="country" value={formik.values.country || ''} onChange={formik.handleChange}>
                                    <MenuItem value="" disabled>
                                        Select Country
                                    </MenuItem>
                                    {country.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.country_id}
                                            onClick={(event) => {
                                                handleMenu(event, item.id);
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
                                    value={formik.values.statename || ''}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem key={item.id} value={item.state_id} onClick={(event) => handleMenu1(event, item.id)}>
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
                                <Select id="city" name="city" value={formik.values.city || ''} onChange={formik.handleChange}>
                                    <MenuItem value="" disabled>
                                        Select City
                                    </MenuItem>
                                    {city.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                            onClick={(event) => handlemapvalue(event, item.id, item.location.coordinates)}
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
                                    value={formik.values.HubName || ''}
                                    data-cor={mapcor}
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
                                Update Hub
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default HubEditForm;
