import { useEffect, useState } from 'react';
// material-ui
import { Button, FormHelperText, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import '@mui/lab';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import ordinalNumbers from './numberstring.json';

// ==============================|| CREATE INVOICE ||============================== //

function Create({ create, editData }) {
    const dispatch = useDispatch();
    const [locations, setLocations] = useState([]);
    const [locationCustomer, setCustomer] = useState([]);
    const [checklist, setChecklist] = useState([{ id: 1, name: '', ph: 'Enter checklist name...', status: false }]);

    const filterCheckListData = (data) => {
        const result = data
            .map((item) => {
                delete item.id;
                delete item.ph;
                return item;
            })
            .filter((item) => item.name);
        return result;
    };

    // yup validation-schema

    const validationSchema = yup.object({
        location: yup.string().required(),
        customer: yup.string().required(),
        form_name: yup.string().min(1).max(50).required('form name is required'),
        checklists: yup.array().min(1).required()
    });

    const formik = useFormik({
        initialValues: {
            id: editData.id || '',
            location: editData?.location || '',
            customer: editData?.customer || '',
            form_name: editData?.form_name || '',
            checklists: []
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    formik.values.checklists = filterCheckListData(formik.values.checklists);
                    await axios.post('/pre-stages', formik.values);
                    resetForm();
                    create();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Added successfully !',
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

    const handleLocationByCustomer = async (customerId) => {
        formik.setFieldValue('customer', customerId);
        await axios.get(`/location/by-customer/${customerId}`).then((res) => {
            setLocations(res.data.data?.locations);
        });
    };

    const getCustomer = async () => {
        try {
            await axios.get('/customer/prestages').then((res) => {
                setCustomer(res.data.data?.customers);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCustomer();
        if ('id' in editData) {
            handleLocationByCustomer(editData?.customer);
            const newCheckList = editData?.checklists.map((checklist, key) => {
                checklist.id = key + 1;
                checklist.ph = '';
                return checklist;
            });
            setChecklist(newCheckList);
            formik.setFieldValue('checklists', newCheckList);
        }
    }, [editData]);

    const handleChecklist = (id, name, value) => {
        const updatedList = checklist.map((field) => {
            if (field.id === id) {
                return { ...field, [name]: value };
            }
            return { ...field, [name]: field[name] || '' };
        });

        setChecklist(updatedList);
        formik.setFieldValue('checklists', updatedList);
    };

    const handleAddField = () => {
        const newchecklist = [
            ...checklist,
            {
                id: checklist.length + 1,
                name: '',
                ph:
                    checklist.length < ordinalNumbers.length
                        ? `Enter ${ordinalNumbers[checklist.length]} checklist name...`
                        : 'Ktni bnani ds',
                status: false
            }
        ];
        setChecklist(newchecklist);
    };

    const handleRemoveField = (key) => {
        const updatedList = [...checklist];
        updatedList.splice(key, 1);
        setChecklist(updatedList);
        // const data = filterCheckListData(updatedList);
        formik.setFieldValue('checklists', updatedList);
    };
    console.log('locations', locations);
    return (
        <>
            <MainCard title={'id' in editData ? `Edit Pre-Stages` : `Create Pre-Stages`}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Customer</InputLabel>
                                <Select
                                    id="customer"
                                    name="customer"
                                    defaultValue="Select customer"
                                    value={formik.values.customer || 'Select customer'}
                                    // onChange={formik.handleChange}
                                    onChange={(e) => handleLocationByCustomer(e.target.value)}
                                >
                                    <MenuItem value="Select customer" selected disabled>
                                        Select Customer
                                    </MenuItem>
                                    {locationCustomer.map((item) =>
                                        item.is_active ? (
                                            <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.customer}>
                                                {item.customer_name}
                                            </MenuItem>
                                        ) : (
                                            ''
                                        )
                                    )}
                                </Select>
                                {formik.errors.customer && <FormHelperText error>{formik.errors.customer}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Location</InputLabel>
                                <Select
                                    id="location"
                                    name="location"
                                    defaultValue="Select location"
                                    value={formik.values.location || 'Select location'}
                                    onChange={formik.handleChange}
                                    // onChange={(e) => handleLocationByCustomer(e.target.value)}
                                >
                                    <MenuItem value="Select location" selected disabled>
                                        Select location
                                    </MenuItem>
                                    {locations.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.location_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Form Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="form_name"
                                    name="form_name"
                                    autoComplete="form_name"
                                    value={formik.values.form_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder="Enter form name..."
                                />
                            </Stack>
                            {formik.errors.form_name && <FormHelperText error>{formik.errors.form_name}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack>
                                <InputLabel required>Adding the Checklist+</InputLabel>
                                {formik.errors.checklists && <FormHelperText error>{formik.errors.checklists}</FormHelperText>}
                                <Grid container spacing={gridSpacing}>
                                    {checklist.map((clist, ind) => (
                                        <Grid item xs={12} md={4}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs={12} md={10}>
                                                    <Stack>
                                                        <TextField
                                                            fullWidth
                                                            id={`formname${clist.id}`}
                                                            name={`formname${clist.id}`}
                                                            autoComplete={`formname${clist.id}`}
                                                            value={clist.name}
                                                            // onBlur={formik.handleBlur}
                                                            onInput={(e) => handleChecklist(clist.id, 'name', e.target.value)}
                                                            placeholder={clist.ph}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    <Stack>
                                                        {checklist.length > 1 ? (
                                                            <RemoveCircleIcon
                                                                style={{ cursor: 'pointer', marginTop: '10px' }}
                                                                onClick={() => handleRemoveField(ind)}
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack>
                                        <AddCircleIcon style={{ cursor: 'pointer', marginTop: '17px' }} onClick={handleAddField} />
                                    </Stack>
                                </Grid>
                            </Stack>
                            {/* {formik.errors.form_name && <FormHelperText error>{formik.errors.form_name}</FormHelperText>} */}
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                {'id' in editData ? 'Update' : 'Add'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default Create;
