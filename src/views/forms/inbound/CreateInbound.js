import { useEffect, useState } from 'react';
// material-ui
import {
    createFilterOptions,
    Button,
    Chip,
    Box,
    Typography,
    Autocomplete,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField
} from '@mui/material';
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
import Close from '@mui/icons-material/Close';
import useAuth from 'hooks/useAuth';
import { getUserConfigFields } from 'store/slices/configuration';
import { getDepartment } from 'store/slices/department';
import { getRoles } from 'store/slices/role';

const filter = createFilterOptions();
const filterSkills = createFilterOptions();

// ==============================|| CREATE INVOICE ||============================== //

function CreateInbound({ create }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    // const [roles, setRoles] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [fields, setFileds] = useState([]);
    const [multiRoles, setMultiRoles] = useState([]);
    const [getAll, setGetAll] = useState(true);
    const [departs, setDepartments] = useState([]);
    const { departments } = useSelector((state) => state.department);
    const { roles } = useSelector((state) => state.role);
    const { hub } = useSelector((state) => state.hub);
    const { userConfigFild } = useSelector((state) => state.configuration);
    const { user } = useAuth();

    // yup validation-schema

    const validationSchema = yup.object({
        name: yup.string().min(3).max(30).required('First Name is Required'),
        email: yup.string().required().email('Enter a valid email').max(64),
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
            .required('Phone Number is required'),
        password: yup.string().min(6).max(20).required(),
        // eslint-disable-next-line no-undef
        confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords does not match'),
        roles: yup
            .array()
            .of(yup.string())
            .test('userRoleVal', 'Select must contain at least one role', (value) => {
                if (value.length) return value;
                if (!fields.visibility.role) {
                    return true;
                }
                return false;
            }),
        // roles: yup.string().required('User Name is Required'),
        user_name: yup.string().test('userNameVal', 'User name is required', (value) => {
            if (value) return value;
            if (!fields.visibility.user_name) {
                return true;
            }
            return false;
        }),
        department: yup.string().test('userDepVal', 'Department is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.department) {
                return true;
            }
            return false;
        }),
        reporting_manager: yup.string().test('userRMVal', 'Reporting Manger is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.reporting_manger) {
                return true;
            }
            return false;
        }),
        cost_center: yup.string().test('userCCVal', 'Cost Center is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.cost_center) {
                return true;
            }
            return false;
        }),
        home_center: yup.string().test('userHCVal', 'Home Center is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.home_center) {
                return true;
            }
            return false;
        }),
        address_1: yup.string().test('userAddVal', 'Address is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.address) {
                return true;
            }
            return false;
        }),
        city: yup.string().test('userCityVal', 'City is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.city) {
                return true;
            }
            return false;
        }),
        state: yup.string().test('userStateVal', 'State is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.state) {
                return true;
            }
            return false;
        }),
        country: yup.string().test('userCountryVal', 'Country is Required', (value) => {
            if (value) return value;
            if (!fields.visibility.country) {
                return true;
            }
            return false;
        }),
        pin_code: yup
            .string()
            .test('userPCVal', 'Pincode is Required', (value) => {
                if (value) return value;
                if (!fields.visibility.pincode) {
                    return true;
                }
                return false;
            })
            .test('positiveIntegerTest', 'Pincode should be a valid positive integer alphabets are not allowed !', (value) => {
                if (!value) return true;
                let parsedValue;
                try {
                    parsedValue = parseInt(value, 6);
                } catch (error) {
                    return true;
                }
                return !Number.isNaN(parsedValue) && parsedValue > 0;
            }),
        emergency_contact: yup
            .string()
            .test('userECVal', 'Emergency Contact is Required', (value) => {
                if (value) return value;
                if (!fields.visibility.emergency_contact) {
                    return true;
                }
                return false;
            })
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

    const formik = useFormik({
        initialValues: {
            name: '',
            client: user?.client_id || '',
            email: '',
            phone: '',
            user_name: '',
            department: '',
            reporting_manager: '',
            cost_center: '',
            home_center: '',
            roles: [],
            address_1: '',
            address_2: '',
            city: '',
            state: '',
            country: '',
            pin_code: '',
            emergency_contact: '',
            relation_contact: '',
            password: '',
            confirm_password: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                console.log('formik.values', formik.values);
                try {
                    setOpen(true);
                    await axios.post('/auth/register', formik.values);
                    resetForm();
                    create();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'User Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                } catch (error) {
                    console.log('error', error);
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

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        },
        chip: {
            margin: 2
        }
    };
    // const getRoles = async () => {
    //     const res = await axios.get('/roles');
    //     const results = [];
    //     res.data.data.roles.forEach((role, index) => {
    //         results.push(role.role);
    //     });
    //     setMultiRoles(results);
    //     setRoles(res.data.data.roles);
    // };
    const getClients = async (queryString = '') => {
        const res = await axios.get(`/configuration/menu-list${queryString}`);
        setClients(res.data.data.data);
    };

    const handleClientChange = (event) => {
        console.log(event);
    };

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?client=${user?.client_id}&all=${getAll}`;
        return str;
    };

    useEffect(() => {
        getClients();
        dispatch(getDepartment(makeQuery()));
        dispatch(getUserConfigFields('default'));
        dispatch(getRoles(makeQuery()));
        // dispatch(getHub());
    }, []);
    useEffect(() => {
        const results = [];

        if (!fields?.visibility?.department) {
            // roles.forEach((role, index) => {
            //     results.push(role.role);
            // });
            setMultiRoles(roles);
        } else setMultiRoles(results);
    }, [roles, fields]);
    useEffect(() => {
        setFileds(userConfigFild);
        setDepartments(departments);
    }, [userConfigFild, departments]);
    const skills = ['Java', 'HTML', 'Bootstrap', 'JavaScript', 'NodeJS', 'React', 'Angular', 'CI'];

    let TagsError = false;
    if (formik.touched.skills && formik.errors.skills) {
        if (formik.touched.skills && typeof formik.errors.skills === 'string') {
            TagsError = formik.errors.skills;
        } else if (formik.errors.skills && typeof formik.errors.skills !== 'string') {
            formik.errors.skills.map((item) => {
                if (typeof item === 'object') TagsError = item.label;
                return item;
            });
        }
    }

    const handleChangeDepartment = (val) => {
        formik.setFieldValue('department', val.props.value);

        const res = roles.filter((role) => {
            if (role.department.length) {
                if (role.department[role.department.length - 1].department === val.props.children) return role;
            } else return role;
            return undefined;
        });

        setMultiRoles(res);
    };

    return (
        <>
            <MainCard title="Create User">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        {user?.role?.role.includes('DEVELOPER') ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Select Client</InputLabel>
                                    <Select
                                        id="client"
                                        name="client"
                                        label="Select client"
                                        defaultValue="Select client"
                                        value="Select client"
                                        onChange={(event, newValue) => {
                                            setSelectedClients(event.target.value);
                                            dispatch(getUserConfigFields(event.target.value));
                                        }}
                                    >
                                        <MenuItem value="" selected disabled>
                                            Select client
                                        </MenuItem>
                                        {clients.map((item) => (
                                            <MenuItem value={item.id}>{item.client_name}</MenuItem>
                                        ))}
                                    </Select>
                                    {formik.errors.client && <FormHelperText error>{formik.errors.client}</FormHelperText>}
                                </Stack>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.full_name ? (
                            <Grid item xs={12} md={3}>
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
                                        placeholder="Enter User First Name..."
                                    />
                                </Stack>
                                {formik.errors.name && <FormHelperText error>{formik.errors.name}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {/* <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel>Last Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    autoComplete="last_name"
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter User First Name..."
                                />
                            </Stack>
                            {formik.errors.last_name && <FormHelperText error>{formik.errors.last_name}</FormHelperText>}
                        </Grid> */}
                        {fields?.visibility?.email ? (
                            <Grid item xs={12} md={3}>
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
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.phone ? (
                            <Grid item xs={12} md={3}>
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
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.user_name ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>User Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="user_name"
                                        name="user_name"
                                        autoComplete="user_name"
                                        value={formik.values.user_name}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="Enter User First Name..."
                                    />
                                </Stack>
                                {formik.errors.user_name && <FormHelperText error>{formik.errors.user_name}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.department ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Select Department</InputLabel>
                                    <Select
                                        id="department"
                                        name="department"
                                        label="Select department"
                                        defaultValue="Select department"
                                        value={formik.values.department || 'Select department'}
                                        // onChange={formik.handleChange}
                                        onChange={(event, newValue) => handleChangeDepartment(newValue)}
                                    >
                                        <MenuItem value="Select department" selected disabled>
                                            Select department
                                        </MenuItem>
                                        {departs.map((item) => (
                                            <MenuItem value={item.id} selected={formik.values.department === item.id}>
                                                {item.department}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.errors.department && <FormHelperText error>{formik.errors.department}</FormHelperText>}
                                </Stack>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.role ? (
                            <Grid item xs={12} md={3}>
                                <InputLabel required>Select Role</InputLabel>
                                <Autocomplete
                                    id="role"
                                    multiple
                                    disablePortal
                                    options={multiRoles}
                                    onBlur={formik.handleBlur}
                                    getOptionLabel={(option) => option.role}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            newValue = newValue.map((value) => value.id);
                                            formik.setFieldValue('roles', newValue);
                                        } else {
                                            formik.setFieldValue('roles', '');
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select roles" />}
                                    // isOptionEqualToValue={(option, value) => option.city_id === value.city_id}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.role}
                                        </Box>
                                    )}
                                />
                                {formik.errors.roles && <FormHelperText error>{formik.errors.roles}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.reporting_manger ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Reporting Manager</InputLabel>
                                    <Select
                                        id="reporting_manager"
                                        name="reporting_manager"
                                        label="Select Reporting Manager"
                                        defaultValue="Select Reporting Manager"
                                        value={formik.values.reporting_manager || 'Select Reporting Manager'}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="Select reporting_maneger" selected disabled>
                                            Select Reporting Manager
                                        </MenuItem>
                                        <MenuItem value="abc">ABC</MenuItem>
                                    </Select>
                                    {formik.errors.reporting_manager && (
                                        <FormHelperText error>{formik.errors.reporting_manager}</FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.cost_center ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Cost Center</InputLabel>
                                    <Select
                                        id="cost_center"
                                        name="cost_center"
                                        label="Select ost Center"
                                        defaultValue="Select Cost Center"
                                        value={formik.values.cost_center || 'Select Cost Center'}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="" selected disabled>
                                            Select Cost Center
                                        </MenuItem>
                                        <MenuItem value="abc">ABC</MenuItem>
                                    </Select>
                                    {formik.errors.cost_center && <FormHelperText error>{formik.errors.cost_center}</FormHelperText>}
                                </Stack>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {/* <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Select Role</InputLabel>
                                <Select
                                    id="user_role"
                                    name="role"
                                    label="Select role"
                                    defaultValue="Select role"
                                    value={formik.values.role || 'Select role'}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Select role" selected disabled>
                                        Select Role
                                    </MenuItem>
                                    {roles
                                        .filter((item) => item.role !== 'VENDOR')
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.role}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {formik.errors.role && <FormHelperText error>{formik.errors.role}</FormHelperText>}
                            </Stack>
                        </Grid> */}
                        {fields?.visibility?.home_center ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel>Home Center</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="home_center"
                                        name="home_center"
                                        autoComplete="home_center"
                                        value={formik.values.home_center}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="Enter User Home Center..."
                                    />
                                </Stack>
                                {formik.errors.home_center && <FormHelperText error>{formik.errors.home_center}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.address ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Address </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-flexible"
                                        label="Address..."
                                        multiline
                                        rows={2}
                                        value={formik.values.address_1}
                                        name="address_1"
                                        autoComplete="address_1"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                </Stack>
                                {formik.errors.address_1 && <FormHelperText error>{formik.errors.address_1}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.address_2 ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel>Address 2</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-flexible"
                                        label="Address..."
                                        multiline
                                        rows={2}
                                        value={formik.values.address_2}
                                        name="address_2"
                                        autoComplete="address_2"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                </Stack>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.city ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>City</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="city"
                                        name="city"
                                        autoComplete="city"
                                        value={formik.values.city}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="Enter City..."
                                    />
                                </Stack>
                                {formik.errors.city && <FormHelperText error>{formik.errors.city}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.state ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>State</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="state"
                                        name="state"
                                        autoComplete="state"
                                        value={formik.values.state}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="Enter State..."
                                    />
                                </Stack>
                                {formik.errors.state && <FormHelperText error>{formik.errors.state}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.country ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Country</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        value={formik.values.country}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="Enter Country..."
                                    />
                                </Stack>
                                {formik.errors.country && <FormHelperText error>{formik.errors.country}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.pincode ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Pincode</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="pin_code"
                                        name="pin_code"
                                        value={formik.values.pin_code}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="User Pincode Number..."
                                    />
                                </Stack>
                                {formik.errors.pin_code && <FormHelperText error>{formik.errors.pin_code}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.emergency_contact ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Emergency Contact</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="emergency_contact"
                                        name="emergency_contact"
                                        value={formik.values.emergency_contact}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="User Emergency Contact..."
                                    />
                                </Stack>
                                {formik.errors.emergency_contact && (
                                    <FormHelperText error>{formik.errors.emergency_contact}</FormHelperText>
                                )}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.relation ? (
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel>Relation</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="relation_contact"
                                        name="relation_contact"
                                        value={formik.values.relation_contact}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder="User Relation..."
                                    />
                                </Stack>
                                {formik.errors.relation_contact && <FormHelperText error>{formik.errors.relation_contact}</FormHelperText>}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.password ? (
                            <Grid item xs={12} md={3}>
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
                        ) : (
                            ''
                        )}
                        {fields?.visibility?.confirm_password ? (
                            <Grid item xs={12} md={3}>
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
                        ) : (
                            ''
                        )}
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add ASN
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateInbound;
