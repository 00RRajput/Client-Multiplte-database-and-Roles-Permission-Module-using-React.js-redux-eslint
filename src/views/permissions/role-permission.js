import React, { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
// material-ui
import { Button, Checkbox, Divider, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import '@mui/lab';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// // third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

import axios from '../../utils/axios';
import { getRoles } from 'store/slices/role';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// yup validation-schema
// const validationSchema = yup.object({
//     country: yup.string().required('Country Name is Required'),
//     state: yup.string().required('State Name is Required'),
//     cityfrom: yup.string().required('City Name is Required'),
//     state1: yup.string().required('State Name is Required'),
//     cityto: yup.string().required('City Name is Required')
// });
// ==============================|| CREATE LANE ||============================== //

function RolePermission() {
    const dispatch = useDispatch();
    const [role, setRole] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState('');
    const [getAll, setGetAll] = useState(true);
    const [permissions, sePermissions] = useState([]);
    // const { roles } = useSelector((state) => state.role);
    const { user } = useAuth();

    const params = useParams();

    const formik = useFormik({
        initialValues: {
            role_id: '',
            selectAll: false,
            permission: {}
        },
        // validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                let url = '/permissions/store';
                if (params.client_id) url = `${url}?client_id=${params.client_id}`;

                await axios.post(url, formik.values);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Permissions Updated Successfully!',
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

    const changeCheckBoxValue = async (array, status, selectAll = false) => {
        let allStatus = true;
        array.forEach((permission, index) => {
            let parentStatus = true;
            permission.childData.forEach((item, ind) => {
                if (!item?.status) parentStatus = false;
                formik.setFieldValue(`permission.${item.title}`, item?.status || status);
            });
            formik.setFieldValue(`permission.${permission.childData[0].parent}`, parentStatus);
            if (!parentStatus) allStatus = false;
        });
        formik.setFieldValue('selectAll', allStatus);
        if (selectAll) {
            array.forEach((permission, index) => {
                formik.setFieldValue(`permission.${permission.childData[0].parent}`, true);
            });
        }
    };

    const showError = (selectAll) => {
        if (selectAll) formik.setFieldValue('selectAll', false);
        dispatch(
            openSnackbar({
                open: true,
                message: 'Select Role!',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
    };

    const getRoles = async () => {
        try {
            let url = '/roles';
            if (params.client_id) url = `${url}?client=${params.client_id}`;
            const response = await axios.get(url);
            setRoles(response.data.data.roles);
        } catch (error) {
            console.log(error);
            setRoles([]);
        }
    };

    const getPermissions = async () => {
        let url = '/permissions';
        if (params.client_id) url = `${url}?client_id=${params.client_id}`;
        const response = await axios.get(url);
        sePermissions(response.data.data.data);
        changeCheckBoxValue(response.data.data.data, false);
    };
    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    useEffect(() => {
        // dispatch(getRoles(makeQuery()));
        getRoles();
        getPermissions();
    }, []);

    // useEffect(() => {
    //     setRole(roles);
    // }, [roles]);

    const handleRole = async (event, newValue) => {
        setRoleId(newValue.props.value);
        formik.setFieldValue('role_id', newValue.props.value);
        const params = `?role_id=${newValue.props.value}`;
        const response = await axios.get(`/permissions/role-permission${params}`);

        if (response.data.data.data.length) await changeCheckBoxValue(response.data.data.data, false);
        else await changeCheckBoxValue(permissions, false);
    };

    const handleCheckP = async (event, newValue, permission, parent) => {
        if (roleId) {
            let status = true;
            if (formik.values.permission[parent]) status = false;

            permission.childData.forEach((item, ind) => {
                formik.setFieldValue(`permission.${item.title}`, status);
            });
            formik.values.permission[parent] = status;
            formik.setFieldValue('selectAll', false);
        } else showError(false);
    };

    const handleSelectAll = async (event, newValue) => {
        if (roleId) {
            if (newValue) {
                await changeCheckBoxValue(permissions, true, newValue);

                formik.setFieldValue('selectAll', true);
            } else {
                await changeCheckBoxValue(permissions, false, newValue);
                formik.setFieldValue('selectAll', false);
            }
        } else showError(true);
    };

    return (
        <>
            <MainCard title="Role Permissions">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select Role</InputLabel>
                                <Select
                                    id="country"
                                    name="country"
                                    defaultValue="Select Role"
                                    onChange={(event, newValue) => handleRole(event, newValue)}
                                >
                                    <MenuItem value="Select Role" selected disabled>
                                        Select Role
                                    </MenuItem>
                                    {roles.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
            <MainCard title="Select Permissions" style={{ marginTop: '20px' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={12}>
                            <Stack sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                                <InputLabel sx={{ marginTop: '5px' }}>
                                    <Checkbox
                                        color="secondary"
                                        name="saveAddress1"
                                        onChange={(event, newValue) => handleSelectAll(event, newValue)}
                                        checked={formik.values.selectAll}
                                    />
                                    Select All
                                </InputLabel>
                                {/* {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>} */}
                            </Stack>
                        </Grid>
                        <Divider />
                        {permissions.map((permission, ind) => (
                            <Grid key={Math.random() * 1000000000} item xs={12} md={12}>
                                <Grid item xs={12} md={12}>
                                    <Stack sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <InputLabel sx={{ marginTop: '5px' }}>
                                            <Checkbox
                                                color="secondary"
                                                name="saveAddress1"
                                                onChange={(event, newValue) =>
                                                    handleCheckP(event, newValue, permission, permission.childData[0].parent)
                                                }
                                                checked={formik.values.permission[permission.childData[0].parent]}
                                            />
                                            {permission.childData[0].parent_name}
                                        </InputLabel>
                                        {/* {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>} */}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12} sx={{ display: 'inline-flex', width: '100%' }}>
                                    {permission.childData.map((data) => (
                                        <Grid key={Math.random() * 100000000000} item xs={12} md={3}>
                                            <Stack sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Typography variant="caption" color="inherit" sx={{ marginTop: '5px' }}>
                                                    <Checkbox
                                                        color="secondary"
                                                        name="saveAddress1"
                                                        onChange={(event, newValue) => {
                                                            if (roleId) {
                                                                formik.setFieldValue(`permission.${data.title}`, newValue);
                                                                if (newValue) {
                                                                    const titleA = permission.childData.map((v) => v.title);
                                                                    const bool = titleA.map((title) =>
                                                                        data.title !== title ? formik.values.permission[title] : ''
                                                                    );
                                                                    if (!bool.includes(false))
                                                                        formik.setFieldValue(
                                                                            `permission.${permission.childData[0].parent}`,
                                                                            true
                                                                        );
                                                                } else {
                                                                    formik.setFieldValue(
                                                                        `permission.${permission.childData[0].parent}`,
                                                                        false
                                                                    );
                                                                    formik.setFieldValue('selectAll', false);
                                                                }
                                                            } else showError(false);
                                                        }}
                                                        checked={formik.values.permission[data.title]}
                                                    />
                                                    {data.display_name}
                                                </Typography>
                                                {/* {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>} */}
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
                        <Divider />
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <PermissionGuard access="create_permission">
                                {roleId ? (
                                    <Button variant="contained" type="submit">
                                        Update Permissions
                                    </Button>
                                ) : (
                                    ''
                                )}
                            </PermissionGuard>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default RolePermission;
