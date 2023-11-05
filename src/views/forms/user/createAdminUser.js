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

const filter = createFilterOptions();
const filterSkills = createFilterOptions();

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
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords does not match'),
    roles: yup
        .array()
        .of(yup.string())
        .test('userRoleVal', 'Select must contain at least one role', (value) => {
            if (value.length) return value;
            return false;
        }),
    client: yup.string().required('Client is Required')
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateUser({ create }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [clients, setClients] = useState([]);
    const [multiRoles, setMultiRoles] = useState([]);
    const { hub } = useSelector((state) => state.hub);

    const formik = useFormik({
        initialValues: {
            client: '',
            name: '',
            email: '',
            phone: '',
            user_name: 'Admin',
            department: '',
            reporting_manager: '-',
            cost_center: '-',
            home_center: '-',
            roles: [],
            address_1: '-',
            address_2: '-',
            city: '-',
            state: '-',
            country: '-',
            pin_code: '0',
            emergency_contact: '8219393501',
            relation_contact: '8219393501',
            password: '',
            confirm_password: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log('formik.values', formik.values);
            if (values) {
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
    const getRoles = async (query = '') => {
        const res = await axios.get(`/roles${query}`);
        const results = [];
        res.data.data.roles.forEach((role, index) => {
            results.push(role.role);
        });
        setMultiRoles(results);
        setRoles(res.data.data.roles);
    };

    const getClients = async (queryString = '') => {
        const res = await axios.get(`/configuration/menu-list${queryString}`);
        setClients(res.data.data.data);
    };

    useEffect(() => {
        getRoles();
        getClients();
        dispatch(getHub());
    }, []);
    console.log(roles);
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

    return (
        <>
            <MainCard title="Create User">
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
                                    onChange={(e) => {
                                        formik.setFieldValue('client', e.target.value);
                                        getRoles(`?client=${e.target.value}`);
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
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Role</InputLabel>
                                <Select
                                    id="role"
                                    name="role"
                                    label="Select Role"
                                    defaultValue="Select Role"
                                    value={formik.values.roles || 'Select Role'}
                                    onChange={(e, val) => {
                                        formik.setFieldValue('roles', [val.props.value]);
                                    }}
                                >
                                    <MenuItem value="" selected disabled>
                                        Select Role
                                    </MenuItem>
                                    {roles.map((item) => (item.role === 'ADMIN' ? <MenuItem value={item.id}>{item.role}</MenuItem> : null))}
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
                                Add User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateUser;
