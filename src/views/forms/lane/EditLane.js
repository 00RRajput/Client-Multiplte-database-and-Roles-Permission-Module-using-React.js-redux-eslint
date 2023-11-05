import React, { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
// material-ui
import { Button, FormHelperText, Grid, MenuItem, Select, Stack } from '@mui/material';
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
import { useFormik } from 'formik';
import axios from '../../../utils/axios';
import { values } from 'lodash';

// yup validation-schema
const validationSchema = yup.object({
    country: yup.string().required('country is required'),
    fromState: yup.string().required('from state is required'),
    fromCity: yup.string().required('from city is required'),
    toState: yup.string().required('to state is required'),
    toCity: yup.string().required('to city is required')
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateLane({ edit, data }) {
    console.log('data=>', data);
    const [open, setOpen] = useState(false);
    const [fromCities, setFromCities] = useState([]);
    const [toCities, setToCities] = useState([]);
    const [states, setStates] = useState([]);
    const [country, setCountry] = useState([]);

    console.log(data);

    const dispatch = useDispatch();
    const getCityData = (type, id) => {
        if (type === 'from') {
            return fromCities.filter((item) => item.city_id === id);
        }
        return toCities.filter((item) => item.city_id === id);
    };
    const formik = useFormik({
        initialValues: {
            country: data?.country || '',
            fromState: data?.from_state_id || '',
            toState: data?.to_state_id || '',
            fromCity: data?.from_city_id || '',
            toCity: data?.to_city_id || ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const fromCity = getCityData('from', values.fromCity);
                const toCity = getCityData('to', values.toCity);

                await axios.put(`/routes/${data?.id}`, {
                    country: values.country,
                    from_lat_lng: fromCity[0].location.coordinates,
                    to_lat_lng: toCity[0].location.coordinates,
                    from_city: fromCity[0].name,
                    to_city: toCity[0].name,
                    from_city_id: values.fromCity,
                    to_city_id: values.toCity,
                    from_state_id: values.fromState,
                    to_state_id: values.toState
                });
                resetForm();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'lane updated successfully !',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        transition: 'SlideLeft',
                        close: true
                    })
                );
                edit();
                if (values) {
                    setOpen(true);
                }
            } catch (error) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: error?.message || 'unable to update lane, please try again !',
                        variant: 'alert',
                        transition: 'SlideLeft',
                        close: true
                    })
                );
            }
        }
    });

    const handleCountry = async (id) => {
        console.log('hi', id);
        const res = await axios.get(`/location/state?country_id=${id}`);
        setStates(res.data.data.state);
    };

    const getStates = async () => {
        // const CountryId = 101;
        console.log('call');
        console.log('valu', values.country);
        const res = await axios.get(`/location/state?country_id=${data?.country}`);
        setStates(res.data.data.state);
    };
    const getCountry = async () => {
        const res = await axios.get('/location/country');
        setCountry(res.data.data.country);
    };

    useEffect(() => {
        getCountry();
        getStates();
    }, []);

    const getCities = async (type, key) => {
        const res = await axios.get(`/location/city?state_id=${key}`);
        if (type === 'from') {
            formik.setValues({ ...formik.values });
            // formik.setFieldValue('fromCity', '');
            return setFromCities(res.data.data.city);
        }
        formik.setValues({ ...formik.values });
        // formik.setFieldValue('toCity', '');
        return setToCities(res.data.data.city);
    };

    useEffect(() => {
        getCities('from', formik.values.fromState);
    }, [formik.values.fromState]);
    useEffect(() => {
        getCities('to', formik.values.toState);
    }, [formik.values.toState]);

    return (
        <>
            <MainCard title="Update Lane">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select Country</InputLabel>
                                <Select
                                    id="country"
                                    name="country"
                                    value={formik.values.country || data?.country || ''}
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
                                                formik.setFieldValue('fromState', '');
                                                formik.setFieldValue('toState', '');
                                                formik.setFieldValue('fromCity', '');
                                                formik.setFieldValue('toCity', '');
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
                                    id="fromState"
                                    name="fromState"
                                    // defaultValue="Select From Location State"
                                    value={formik.values.fromState || data?.from_state_id || ''}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select From Location State" disabled>
                                        Select From Location State
                                    </MenuItem>
                                    {states.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.state_id}
                                            onClick={() => {
                                                formik.setFieldValue('fromCity', '');
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.fromState && <FormHelperText error>{formik.errors.fromState}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select To State</InputLabel>
                                <Select
                                    id="toState"
                                    name="toState"
                                    // defaultValue="Select To Location State"
                                    value={formik.values.toState || data?.to_state_id || ''}
                                    onChange={formik.handleChange}
                                >
                                    {states.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.state_id}
                                            onClick={() => {
                                                formik.setFieldValue('toCity', '');
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.toState && <FormHelperText error>{formik.errors.toState}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select From City</InputLabel>
                                <Select
                                    id="fromCity"
                                    name="fromCity"
                                    // defaultValue=""
                                    value={formik.values.fromCity || data?.from_city_id || ''}
                                    onChange={formik.handleChange}
                                >
                                    {fromCities.map((item) => (
                                        <MenuItem key={item.id} value={item.city_id} selected>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.fromCity && <FormHelperText error>{formik.errors.fromCity}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select To City</InputLabel>
                                <Select
                                    id="toCity"
                                    name="toCity"
                                    // defaultValue="Select To Location City"
                                    value={formik.values.toCity || data?.to_city_id || ''}
                                    onChange={formik.handleChange}
                                >
                                    {toCities.map((item) => (
                                        <MenuItem key={item.id} value={item.city_id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.toCity && <FormHelperText error>{formik.errors.toCity}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Update Lane
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateLane;
