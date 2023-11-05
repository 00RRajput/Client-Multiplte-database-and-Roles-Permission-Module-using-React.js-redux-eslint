import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material-ui
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    Checkbox,
    Grid,
    Typography,
    InputAdornment,
    Stack,
    TextField
} from '@mui/material';
// project imports
import axios from 'utils/axios';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useFormik } from 'formik';
import { openSnackbar } from 'store/slices/snackbar';
// import { getUserConfigFields } from 'store/slices/configuration';

function UserConfigurationForm({ configFilds, clientId }) {
    UserConfigurationForm.propTypes = {
        configFilds: PropTypes.any.isRequired,
        clientId: PropTypes.any.isRequired
    };
    const dispatch = useDispatch();
    // const { userConfigFild } = useSelector((state) => state.configuration);
    // const [configFilds, setConfigField] = useState({});

    // async function getUserConfigFields(clientId = '') {
    //     try {
    //         const response = await axios.get(`/configuration/user-field/${clientId}`);
    //         console.log('response', response);
    //         setConfigField(response.data.data);
    //     } catch (error) {
    //         console.log('error', error);
    //     }
    // }

    // useEffect(() => {
    // getUserConfigFields(clientId);
    // }, [clientId]);
    // useEffect(() => {
    //     setConfigField(userConfigFild);
    // }, [userConfigFild]);
    console.log('configFilds///', configFilds);
    console.log('configFilds2', clientId);
    const formik = useFormik({
        initialValues: {
            id: {
                visibility: configFilds?.visibility?.id,
                integration: configFilds?.integration?.id
            },
            fullname: {
                visibility: configFilds?.visibility?.full_name,
                integration: configFilds?.integration?.full_name
            },
            email: {
                visibility: configFilds?.visibility?.email,
                integration: configFilds?.integration?.email
            },
            phone: {
                visibility: configFilds?.visibility?.phone,
                integration: configFilds?.integration?.phone
            },
            user_name: {
                visibility: configFilds?.visibility?.user_name,
                integration: configFilds?.integration?.user_name
            },
            department: {
                visibility: configFilds?.visibility?.department,
                integration: configFilds?.integration?.department
            },
            reporting_manager: {
                visibility: configFilds?.visibility?.reporting_manger,
                integration: configFilds?.integration?.reporting_manger
            },
            cost_center: {
                visibility: configFilds?.visibility?.cost_center,
                integration: configFilds?.integration?.cost_center
            },
            home_center: {
                visibility: configFilds?.visibility?.home_center,
                integration: configFilds?.integration?.home_center
            },
            role: {
                visibility: configFilds?.visibility?.role,
                integration: configFilds?.integration?.role
            },
            address: {
                visibility: configFilds?.visibility?.address,
                integration: configFilds?.integration?.address
            },
            address_2: {
                visibility: configFilds?.visibility?.address_2,
                integration: configFilds?.integration?.address_2
            },
            city: {
                visibility: configFilds?.visibility?.city,
                integration: configFilds?.integration?.city
            },
            state: {
                visibility: configFilds?.visibility?.state,
                integration: configFilds?.integration?.state
            },
            country: {
                visibility: configFilds?.visibility?.country,
                integration: configFilds?.integration?.country
            },
            pincode: {
                visibility: configFilds?.visibility?.pincode,
                integration: configFilds?.integration?.pincode
            },
            emergency_contact: {
                visibility: configFilds?.visibility?.emergency_contact,
                integration: configFilds?.integration?.emergency_contact
            },
            relation: {
                visibility: configFilds?.visibility?.relation,
                integration: configFilds?.integration?.relation
            }
        },
        // validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(formik.values);
            //     // if (values) {
            //     //     setOpen(true);
            //     // }
            try {
                await axios.put(`/configuration/user-config/${clientId}`, formik.values);
                // resetForm();
                // create();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Configuration updated !',
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

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={6} sm={6}>
                                <Typography variant="subtitle1" color="inherit">
                                    Fields
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <Typography variant="subtitle1" color="inherit">
                                    Visiblity
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="subtitle1" color="inherit">
                                    Integration
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Full Name
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="saveAddress1"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('fullname.visibility', newValue);
                                    }}
                                    checked={formik.values.fullname.visibility}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="saveAddress"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('fullname.integration', newValue);
                                    }}
                                    checked={formik.values.fullname.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    User Name
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="user_name"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('user_name.visibility', newValue);
                                    }}
                                    checked={formik.values.user_name.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="user_name"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('user_name.integration', newValue);
                                    }}
                                    checked={formik.values.user_name.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Email
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="saveAddress1"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('email.visibility', newValue);
                                    }}
                                    checked={formik.values.email.visibility}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="saveAddress"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('email.integration', newValue);
                                    }}
                                    checked={formik.values.email.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="phone"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('phone.visibility', newValue);
                                    }}
                                    checked={formik.values.phone.visibility}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="phone"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('phone.integration', newValue);
                                    }}
                                    checked={formik.values.phone.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Department
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="department"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('department.visibility', newValue);
                                    }}
                                    checked={formik.values.department.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="department"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('department.integration', newValue);
                                    }}
                                    checked={formik.values.department.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Role
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="role"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('role.visibility', newValue);
                                    }}
                                    checked={formik.values.role.visibility}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="role"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('role.integration', newValue);
                                    }}
                                    checked={formik.values.role.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Reporting Manager
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="reporting_manager"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('reporting_manager.visibility', newValue);
                                    }}
                                    checked={formik.values.reporting_manager.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="reporting_manager"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('reporting_manager.integration', newValue);
                                    }}
                                    checked={formik.values.reporting_manager.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Cost Center
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="cost_center"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('cost_center.visibility', newValue);
                                    }}
                                    checked={formik.values.cost_center.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="cost_center"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('cost_center.integration', newValue);
                                    }}
                                    checked={formik.values.cost_center.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Home Center
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="home_center"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('home_center.visibility', newValue);
                                    }}
                                    checked={formik.values.home_center.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="home_center"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('home_center.integration', newValue);
                                    }}
                                    checked={formik.values.home_center.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Address
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="address"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('address.visibility', newValue);
                                    }}
                                    checked={formik.values.address.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="address"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('address.integration', newValue);
                                    }}
                                    checked={formik.values.address.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Address 2
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="address_2"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('address_2.visibility', newValue);
                                    }}
                                    checked={formik.values.address_2.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="address_2"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('address_2.integration', newValue);
                                    }}
                                    checked={formik.values.address_2.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    City
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="city"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('city.visibility', newValue);
                                    }}
                                    checked={formik.values.city.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="city"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('city.integration', newValue);
                                    }}
                                    checked={formik.values.city.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    State
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="state"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('state.visibility', newValue);
                                    }}
                                    checked={formik.values.state.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="state"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('state.integration', newValue);
                                    }}
                                    checked={formik.values.state.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Country
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="country"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('country.visibility', newValue);
                                    }}
                                    checked={formik.values.country.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="country"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('country.integration', newValue);
                                    }}
                                    checked={formik.values.country.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Pincode
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="pincode"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('pincode.visibility', newValue);
                                    }}
                                    checked={formik.values.pincode.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="pincode"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('pincode.integration', newValue);
                                    }}
                                    checked={formik.values.pincode.integration}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Emergency Contact
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="emergency_contact"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('emergency_contact.visibility', newValue);
                                    }}
                                    checked={formik.values.emergency_contact.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="emergency_contact"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('emergency_contact.integration', newValue);
                                    }}
                                    checked={formik.values.emergency_contact.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Relation
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="relation"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('relation.visibility', newValue);
                                    }}
                                    checked={formik.values.relation.visibility}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="relation"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('relation.integration', newValue);
                                    }}
                                    checked={formik.values.relation.integration}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Password
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="password"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('password.visibility', newValue);
                                    }}
                                    checked
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="password"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('password.integration', newValue);
                                    }}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={1} />
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="inherit">
                                    Confirm Password
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Checkbox
                                    color="secondary"
                                    name="confirm_password"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('confirm_password.visibility', newValue);
                                    }}
                                    checked
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Checkbox
                                    color="secondary"
                                    name="confirm_password"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('confirm_password.integration', newValue);
                                    }}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid item xs={12} lg={6}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Button type="submit" variant="contained" color="secondary">
                                    Submit
                                </Button>
                            </Grid>
                            {/* <Grid item>
                                <Button variant="contained">Clear</Button>
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </>
    );
}

export default UserConfigurationForm;
