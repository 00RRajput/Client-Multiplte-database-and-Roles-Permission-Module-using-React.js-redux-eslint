import { useEffect, useState } from 'react';
// material-ui
import { Button, FormHelperText, Grid, Stack, TextField, Select, MenuItem, Box, Autocomplete } from '@mui/material';
import '@mui/lab';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';
import { getCustomers } from 'store/slices/customer';
import { getProducts } from 'store/slices/product';

// // third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import useAuth from 'hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
// ==============================|| CREATE INVOICE ||============================== //

function EditYard({ create }) {
    const dispatch = useDispatch();
    const [fields, setFields] = useState([{ id: 1, name: '', capacity: '', product: '' }]);
    const [sectionVal, setSectionVal] = useState([
        {
            id: 1,
            name: {
                status: false,
                message: 'Section Name is required'
            },
            capacity: {
                status: false,
                message: 'Capacity is required & must be a number'
            },
            product: {
                status: false,
                message: 'Product is required'
            }
        }
    ]);
    const [locations, setLocations] = useState([]);
    const [customerProduct, setCustomerProduct] = useState([]);
    const [yard, setYard] = useState({});
    const { user } = useAuth();
    const { customers } = useSelector((state) => state.customer);
    const [getAll, setGetAll] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

    const validationSchema = yup.object({
        customer: yup.string().required(),
        location: yup.string().required(),
        sections: yup.array()
    });

    const toggleStatus = (ind, key) => {
        setSectionVal((prevSectionVal) => {
            const newState = [...prevSectionVal];
            newState[ind][key].status = !newState[ind][key].status;
            return newState;
        });
    };

    const SectionValidation = (values) => {
        const errors = {};

        fields.forEach((field, ind) => {
            Object.keys(field).forEach((key) => {
                // if (field[key] === '' || (typeof field[key] === 'object' && !field[key].length)) {
                if (field[key] === '') {
                    toggleStatus(ind, key);
                    setTimeout(() => {
                        toggleStatus(ind, key);
                    }, 3000);
                    errors.validation = true;
                } else if (key === 'capacity' && field[key] !== '') {
                    const parsedValue = parseInt(field[key], 10);
                    if (Number.isNaN(parsedValue)) {
                        toggleStatus(ind, key);
                        errors.numberValidation = true;
                    }
                }
            });
        });

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            location: '',
            customer: '',
            sections: []
        },
        validationSchema,
        validate: SectionValidation,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    await axios.put(`/yard/${yard.id}`, formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Yard Updated successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/admin/yards');
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

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    const handleCustomerChange = async (customerId) => {
        formik.setValues({
            location: formik.values.location,
            customer: customerId
        });
        await axios.get(`/customer/product/by-customer/${customerId}`).then((res) => {
            if (res.data.data?.data?.products) setCustomerProduct(res.data.data?.data?.products);
            else setCustomerProduct([]);
        });
    };

    const getLocations = async () => {
        try {
            const res = await axios.get(`/location/admin`);
            setLocations(res.data.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddField = (flag = true) => {
        setSectionVal((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                name: {
                    status: false,
                    message: 'Section Name is required'
                },
                capacity: {
                    status: false,
                    message: 'Capacity is required & must be a number'
                },
                product: {
                    status: false,
                    message: 'Product is required'
                }
            }
        ]);

        if (flag) {
            setFields([...fields, { id: fields.length + 1, name: '', capacity: '', product: '' }]);
        }
    };

    const getYard = async (yardId) => {
        await axios.get(`/yard/${yardId}`).then((response) => {
            setYard(response.data.data?.yard);
            handleCustomerChange(response.data.data?.yard.customer);

            const yardSection = response.data.data?.yard.yardsection;
            formik.setValues({
                customer: response.data.data.yard.customer,
                location: response.data.data.yard.location,
                sections: yardSection
            });

            setFields(yardSection);

            for (let i = 2; i <= yardSection.length; i += 1) {
                handleAddField(false);
            }
        });
    };
    useEffect(() => {
        getYard(params.id);
    }, [params.id]);

    useEffect(() => {
        getLocations();
        dispatch(getCustomers(makeQuery()));
        dispatch(getProducts(makeQuery()));
        // for (let i = 2; i <= fields.length; i += 1) {
        //     handleAddField(false);
        // }
    }, [yard, fields]);

    const handleRemoveField = (key) => {
        const updatedFields = [...fields];
        updatedFields.splice(key, 1);
        setFields(updatedFields);
        formik.setFieldValue('sections', updatedFields);
        const updatedSectionVal = [...sectionVal];
        updatedSectionVal.splice(key, 1);
        setSectionVal(updatedSectionVal);
    };

    const handleFieldChange = (id, name, value = '') => {
        const updatedFields = fields.map((field) => {
            if (field.id === id) {
                return { ...field, [name]: value };
            }
            return { ...field, [name]: field[name] || '' };
        });
        setFields(updatedFields);
        formik.setValues({
            customer: formik.values.customer,
            location: formik.values.location,
            sections: updatedFields
        });
    };

    const handleLoad = () => {
        navigate('/admin/yards');
    };

    return (
        <>
            <MainCard
                title="Edit Section"
                secondary={
                    <Grid item sm={3} justifycontent="space-between">
                        <Button sm={3} variant="contained" onClick={handleLoad}>
                            Back
                        </Button>
                    </Grid>
                }
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Location</InputLabel>
                                <Select
                                    id="location"
                                    name="location"
                                    defaultValue="Select Location"
                                    value={formik.values.location || 'Select Location'}
                                    onChange={formik.handleChange}
                                    // onClick={countrydata}
                                >
                                    <MenuItem value="Select Location" disabled>
                                        Select Location
                                    </MenuItem>
                                    {locations.map((item) => (
                                        <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.location} disabled>
                                            {item.location_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.location && <FormHelperText error>{formik.errors.location}</FormHelperText>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Customer</InputLabel>
                                <Select
                                    id="customer"
                                    name="customer"
                                    label="Select customer"
                                    defaultValue="Select customer"
                                    value={formik.values.customer || 'Select Customer'}
                                    // onChange={formik.handleChange}
                                    onChange={(e) => {
                                        handleCustomerChange(e.target.value);
                                    }}
                                >
                                    <MenuItem value="Select customer" disabled>
                                        Select Customer
                                    </MenuItem>
                                    {customers.map((item) =>
                                        item.is_active ? (
                                            <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.customer} disabled>
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
                        <Grid item xs={12} md={10}>
                            <Stack>
                                <InputLabel required>Yard Sections</InputLabel>
                                {fields.map((field, key) => (
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Section Name</InputLabel>
                                                <TextField
                                                    key={field.id}
                                                    fullWidth
                                                    id={`section-${field.id}`}
                                                    name={`section-${field.id}`}
                                                    autoComplete={`section-${field.id}`}
                                                    value={field.name}
                                                    placeholder="Enter Section Name"
                                                    onInput={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                                />
                                                {sectionVal[key]?.name.status && (
                                                    <FormHelperText error>{sectionVal[key]?.name.message}</FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Capacity</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id={`size-${field.id}`}
                                                    name={`size-${field.id}`}
                                                    autoComplete={`size-${field.id}`}
                                                    value={field.capacity}
                                                    placeholder="Enter Section Size"
                                                    onInput={(e) => handleFieldChange(field.id, 'capacity', e.target.value)}
                                                    style={{ marginBottom: '16px' }}
                                                />
                                                {sectionVal[key]?.capacity.status && (
                                                    <FormHelperText error>{sectionVal[key]?.capacity.message}</FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack sx={{ padding: '5px' }}>
                                                <InputLabel required>Product</InputLabel>
                                                <Select
                                                    id={`product-${field.id}`}
                                                    name={`product-${field.id}`}
                                                    label="Select product"
                                                    value={field.product}
                                                    onChange={(e) => {
                                                        handleFieldChange(field.id, 'product', e.target.value);
                                                    }}
                                                >
                                                    <MenuItem value="" selected disabled>
                                                        Select Product
                                                    </MenuItem>
                                                    {customerProduct.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.product_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {sectionVal[key]?.product.status && (
                                                    <FormHelperText error>{sectionVal[key]?.product.message}</FormHelperText>
                                                )}
                                                {/* {formik.errors.product && <FormHelperText error>{formik.errors.product}</FormHelperText>} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            {fields.length > 1 ? (
                                                <RemoveCircleIcon
                                                    style={{ cursor: 'pointer', marginTop: '47px' }}
                                                    onClick={(e) => handleRemoveField(key)}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </Grid>
                                    </Grid>
                                ))}
                            </Stack>
                            <AddCircleIcon style={{ cursor: 'pointer' }} onClick={handleAddField} />
                            {/* {fields.length > 1 ? <RemoveCircleIcon style={{ cursor: 'pointer' }} onClick={handleRemoveField} /> : ''} */}
                        </Grid>

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Update Yard
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}
export default EditYard;
