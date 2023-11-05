import React, { useEffect, useState } from 'react';
// material-ui
import { Button, FormHelperText, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import '@mui/lab';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
// import ProductsPage from './ProductsPage';
// import TotalCard from './TotalCard';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import { getHub } from 'store/slices/hub';

// yup validation-schema
const validationSchema = yup.object({
    name: yup.string().min(3).max(30).required('User Name is Required'),
    email: yup.string().email('Enter a valid email'),
    // password: yup.string().min(6).max(20),
    // eslint-disable-next-line no-undef
    // confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords does not match'),
    roles: yup.string().required('User Role is Required'),
    phone: yup
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
});
// ==============================|| CREATE INVOICE ||============================== //

function UpdateUser({ edit, data }) {
    console.log('data', data);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [clients, setClients] = useState([]);
    const { hub } = useSelector((state) => state.hub);

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            password: '',
            confirm_password: '',
            client: data?.client_id || '',
            roles: data?.role[0] || '',
            phone: data?.phone || ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    setOpen(true);
                    await axios.put(`/users/${data?.id}`, formik.values);
                    resetForm();
                    edit();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'user updated successfully !',
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
                            message: 'unable to update user, please try again !',
                            variant: 'alert',
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                }
            }
        }
    });

    const getRoles = async (query) => {
        const res = await axios.get(`/roles${query}`);
        setRoles(res.data.data.roles);
        // eslint-disable-next-line no-underscore-dangle
        // const role = res.data.data.roles.filter((item) => item.id === data?.role?.id);
        // console.log('role', res.data.data.roles);
        // formik.setValues({ ...formik.values, role: role[0]?.id });
    };

    const getClients = async (queryString = '') => {
        const res = await axios.get(`/configuration/menu-list${queryString}`);
        console.log('clie', res.data.data);
        setClients(res.data.data.data);
    };

    useEffect(() => {
        getRoles(`?client=${data.client_id}`);
        getClients();
        dispatch(getHub());
    }, []);

    return (
        <>
            <MainCard title="Update User">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter User Full Name..."
                                />
                            </Stack>
                            {formik.errors.name && <FormHelperText error>{formik.errors.name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Email</InputLabel>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Your Email..."
                                    autoComplete="new-email"
                                />
                            </Stack>
                            {formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Phone</InputLabel>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="User phone number"
                                />
                            </Stack>
                            {formik.errors.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Password</InputLabel>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Password..."
                                />
                            </Stack>
                            {formik.errors.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}
                        </Grid>
                        {/* <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Select Client</InputLabel>
                                <Select
                                    id="cost_center"
                                    name="cost_center"
                                    label="Select Cost Center"
                                    defaultValue="Select Cost Center"
                                    value={formik.values.client || 'Select Cost Center'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" selected disabled>
                                        Select Client
                                    </MenuItem>
                                    {clients.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.client_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.client && <FormHelperText error>{formik.errors.client}</FormHelperText>}
                            </Stack>
                        </Grid> */}
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Select Client</InputLabel>
                                <Select
                                    id="client"
                                    name="client"
                                    label="Select client"
                                    defaultValue="Select client"
                                    value={formik.values.client || 'Select client'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select client
                                    </MenuItem>
                                    {clients.map((item) =>
                                        item.id.toString() === data.client_id.toString() ? (
                                            <MenuItem value={item.id} selected={item.id === data.client_id}>
                                                {item.client_name}
                                            </MenuItem>
                                        ) : null
                                    )}
                                </Select>
                                {formik.errors.client && <FormHelperText error>{formik.errors.client}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Role</InputLabel>
                                <Select
                                    id="role"
                                    name="role"
                                    label="Select Role"
                                    defaultValue="Select Role"
                                    value={formik.values.roles || 'Select Role'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        Select Role
                                    </MenuItem>
                                    {roles.map((item) =>
                                        item.role === 'ADMIN' ? (
                                            <MenuItem value={item.id} selected={item.id === formik.values.roles}>
                                                {item.role}
                                            </MenuItem>
                                        ) : null
                                    )}
                                </Select>
                                {formik.errors.roles && <FormHelperText error>{formik.errors.roles}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Confirm Password</InputLabel>
                                <TextField
                                    fullWidth
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    value={formik.values.confirm_password}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Confirm password"
                                />
                            </Stack>
                            {formik.errors.confirm_password && <FormHelperText error>{formik.errors.confirm_password}</FormHelperText>}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Update User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default UpdateUser;
