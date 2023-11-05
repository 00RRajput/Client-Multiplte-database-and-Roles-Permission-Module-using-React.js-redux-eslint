// material-ui
import { Button, FormHelperText, Grid, Stack, TextField } from '@mui/material';
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

// yup validation-schema
const validationSchema = yup.object({
    vehicle_type: yup.string().min(3).max(30).required('Vehicle Name is Required'),
    l_feet: yup
        .string()
        .min(2, 'L-feet must be at least 2 characters')
        .max(7, 'L-feet must be at most 7 characters')
        .matches(/^\d*\.?\d+$/, 'L-feet must be a valid number')
        .required('L-feet is required'),

    b_feet: yup
        .string()
        .min(2, 'B-feet must be at least 2 characters')
        .max(7, 'B-feet must be at most 7 characters')
        .matches(/^\d*\.?\d+$/, 'B-feet must be a valid number')
        .required('B-feet is required'),

    h_feet: yup
        .string()
        .min(2, 'H-feet must be at least 2 characters')
        .max(7, 'H-feet must be at most 7 characters')
        .matches(/^\d*\.?\d+$/, 'H-feet must be a valid number')
        .required('H-feet is required'),

    capacity_kgs: yup
        .string()
        .min(3, 'Capacity must be at least 3 characters')
        .max(10, 'Capacity must be at most 10 characters')
        .matches(/^\d*\.?\d+$/, 'Capacity must be a valid number')
        .required('Capacity is required'),

    cft: yup
        .string()
        .min(2, 'CFT must be at least 2 characters')
        .max(7, 'CFT must be at most 7 characters')
        .matches(/^\d*\.?\d+$/, 'CFT must be a valid number')
        .required('CFT is required'),

    cbm: yup
        .string()
        .min(2, 'CBM must be at least 2 characters')
        .max(7, 'CBM must be at most 7 characters')
        .matches(/^\d*\.?\d+$/, 'CBM must be a valid number')
        .required('CBM is required')
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateVehicle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            vehicle_type: '',
            l_feet: '',
            b_feet: '',
            h_feet: '',
            capacity_kgs: '',
            cft: '',
            cbm: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    // setOpen(true);
                    await axios.post('/vehicles', formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Vehicle Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/vehicle');
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
                title="Create Vehicle"
                secondary={
                    <Grid item>
                        <Button sm={3} variant="contained" component={Link} to="/vehicle">
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
                                <InputLabel required>Vehicle Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="vehicle_type"
                                    name="vehicle_type"
                                    autoComplete="new-password"
                                    value={formik.values.vehicle_type}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Vehicle Name..."
                                />
                            </Stack>
                            {formik.errors.vehicle_type && <FormHelperText error>{formik.errors.vehicle_type}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>L-Feet</InputLabel>
                                <TextField
                                    fullWidth
                                    id="l_feet"
                                    name="l_feet"
                                    autoComplete="new-password"
                                    value={formik.values.l_feet}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter L-Feet..."
                                />
                            </Stack>
                            {formik.errors.l_feet && <FormHelperText error>{formik.errors.l_feet}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>B-Feet</InputLabel>
                                <TextField
                                    fullWidth
                                    id="b_feet"
                                    name="b_feet"
                                    autoComplete="new-password"
                                    value={formik.values.b_feet}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter B-Feet..."
                                />
                            </Stack>
                            {formik.errors.b_feet && <FormHelperText error>{formik.errors.b_feet}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>H-Feet</InputLabel>
                                <TextField
                                    fullWidth
                                    id="h_feet"
                                    name="h_feet"
                                    autoComplete="new-password"
                                    value={formik.values.h_feet}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter H-Feet..."
                                />
                            </Stack>
                            {formik.errors.h_feet && <FormHelperText error>{formik.errors.h_feet}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Capacity Kgs</InputLabel>
                                <TextField
                                    fullWidth
                                    id="capacity_kgs"
                                    name="capacity_kgs"
                                    autoComplete="new-password"
                                    value={formik.values.capacity_kgs}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Capacity ..."
                                />
                            </Stack>
                            {formik.errors.capacity_kgs && <FormHelperText error>{formik.errors.capacity_kgs}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>CFT</InputLabel>
                                <TextField
                                    fullWidth
                                    id="cft"
                                    name="cft"
                                    autoComplete="new-password"
                                    value={formik.values.cft}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter CFT ..."
                                />
                            </Stack>
                            {formik.errors.cft && <FormHelperText error>{formik.errors.cft}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>CBM</InputLabel>
                                <TextField
                                    fullWidth
                                    id="cbm"
                                    name="cbm"
                                    autoComplete="new-password"
                                    value={formik.values.cbm}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter CBM ..."
                                />
                            </Stack>
                            {formik.errors.cbm && <FormHelperText error>{formik.errors.cbm}</FormHelperText>}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Vehicle
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateVehicle;
