// material-ui
import {
    Button,
    FormHelperText,
    Grid,
    Stack,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Chip,
    FormControl,
    Autocomplete,
    Box,
    IconButton
} from '@mui/material';
import '@mui/lab';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addMinutes, isBefore, set } from 'date-fns';

// project imports
// import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

// // third-party
import * as yup from 'yup';
import { Formik, useFormik } from 'formik';

import axios from 'utils/axios';
import { useDispatch } from 'store';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { values } from 'lodash';
import { Category } from '@mui/icons-material';
import { getCustomers } from 'store/slices/customer';
// import { getProducts } from 'store/slices/product';

// yup validation-schema
const validationSchema = yup.object({
    customer: yup.string().required('Customer is required'),

    document_type: yup.string().required('Document Type is required'),

    invoice_no: yup.string().required('Invoice Number is required'),
    creation_date: yup.string().required('Creation Date is required'),
    expected_time: yup.string().required('Expected Time is required')
    // product_qty: yup.mixed().of(
    //     yup.object().shape({
    //         product: yup.string().required(),
    //         qty: yup
    //             .number()
    //             .typeError('Quantity must be a number')
    //             .positive('Quantity must be a positive number')
    //             .required('Quantity is required')
    //     })
    // )
});
// ==============================|| CREATE INVOICE ||============================== //

function CreateCustomer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [country, setCountry] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [products, setProducts] = useState([]);

    const { customers } = useSelector((state) => state.customer);
    // const { products } = useSelector((state) => state.product);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [fields, setFields] = useState([{ id: 1, name: '' }]);
    const [fields1, setFields1] = useState([{ id: 1, product: '', qty: '' }]);
    const [total, setTotal] = useState(0);
    const [validate, setValidate] = useState([{ id: 1, status: false, message: 'Document No. is Required' }]);
    const [validateProduct, setValidateProduct] = useState([{ id: 1, status: false, message: 'Product is Required' }]);
    const [validateQty, setValidateQty] = useState([{ id: 1, status: false, message: 'Quantity is Required' }]);

    useEffect(() => {
        dispatch(getCustomers());
    }, []);

    const handleAddField = () => {
        const newFields = [...fields, { id: fields[fields.length - 1].id + 1, name: '' }];

        setValidate([...validate, { id: fields[fields.length - 1].id + 1, status: false, message: 'Document No. is Required' }]);
        setFields(newFields);
    };

    const handleRemoveField = (id) => {
        let updatedFields = [...fields];
        updatedFields = updatedFields.filter((item) => item.id !== id);
        // updatedFields.splice(id, 1);
        setFields(updatedFields);
    };

    const handleAddField1 = () => {
        const newFields = [...fields1, { id: fields1[fields1.length - 1].id + 1, product: '', qty: '' }];
        setValidateProduct([...validateProduct, { id: fields1[fields1.length - 1].id + 1, status: false, message: 'Product is Required' }]);
        setValidateQty([...validateQty, { id: fields1[fields1.length - 1].id + 1, status: false, message: 'Quantity is Required' }]);
        setFields1(newFields);
    };

    const handleRemoveField1 = (id) => {
        let updatedFields = [...fields1];
        // updatedFields.splice(updatedFields.length - 1, 1);
        updatedFields = updatedFields.filter((item) => item.id !== id);
        setFields1(updatedFields);
    };
    const getProducts = async (customerId) => {
        const response = await axios.get(`/customer/product?customerId=${customerId}`);
        if (!response.data.data.data.length) {
            setProducts([]);
            setFields1([{ id: 1, product: '', qty: '' }]);
        } else {
            setProducts(response.data.data.data[0].product);
            setFields1([{ id: 1, product: '', qty: '' }]);
            // setValidateProduct({ id: 1, status: false, message: 'Product is Required' });
            // setValidateQty({ id: 1, status: false, message: 'Quantity is Required' });
        }
        // setSelectedProducts(response.data.data.data[0].product);
    };
    useEffect(() => {
        const ids = [];
        const ids1 = [];
        fields1.map((item) => {
            if (!item.product) ids.push(item.id);
            return item;
        });
        fields1.map((item) => {
            if (!item.qty) ids1.push(item.id);
            return item;
        });
        setValidateProduct(
            validateProduct.map((validation) => {
                if (ids.includes(validation.id)) return { ...validation, status: false };
                return { ...validation, status: true };
            })
        );
        setValidateQty(
            validateQty.map((validation) => {
                if (ids1.includes(validation.id)) return { ...validation, status: false };
                return { ...validation, status: true };
            })
        );
        // setTotal(0);
    }, [fields1]);
    const formik = useFormik({
        initialValues: {
            // appointment_no: '',
            customer: '',
            // customer_name: '',
            document_type: '',
            document_no: [],
            product_qty: [
                { product: '', qty: 0 }
                // Add more objects as needed
            ],
            creation_date: '',
            expected_time: '',
            invoice_no: '',
            total_qty: ''
            // category: []
        },
        // validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    // setOpen(true);
                    formik.values.product_qty = formik.values.product_qty.map((item) => ({ ...item, product: item.product.id }));
                    console.log('val', formik.values);

                    await axios.post('/inbound', formik.values);
                    resetForm();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Inbound  Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    navigate('/inbound');
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
    const handleFieldChange = (id, name, value = '') => {
        let updatedFields;
        let updatedFields1 = [];
        if (name === 'product') {
            updatedFields1 = fields1.map((field) => {
                if (field.id === id) {
                    return { ...field, [name]: value };
                }
                return { ...field, [name]: field[name] || '' };
            });
            setFields1(updatedFields1);
            const ids = [];
            updatedFields1.map((item) => {
                if (!item.product) ids.push(item.id);
                return item;
            });
            setValidateProduct(
                validateProduct.map((validation) => {
                    if (ids.includes(validation.id)) return { ...validation, status: false };
                    return { ...validation, status: true };
                })
            );
        }
        // }
        if (name === 'qty') {
            updatedFields1 = fields1.map((field) => {
                if (field.id === id) {
                    // setTotal(total + parseInt(value, 10));
                    return { ...field, [name]: value };
                }
                return { ...field, [name]: field[name] || '' };
            });
            const newTotal = updatedFields1.reduce((acc, field) => acc + (field.qty ? parseInt(field.qty, 10) : 0), 0);

            setTotal(newTotal);
            setFields1(updatedFields1);
            const ids = [];
            updatedFields1.map((item) => {
                if (!item.qty) ids.push(item.id);
                return item;
            });
            setValidateQty(
                validateQty.map((validation) => {
                    if (ids.includes(validation.id)) return { ...validation, status: false };
                    return { ...validation, status: true };
                })
            );
        }
        if (name === 'name') {
            updatedFields = fields.map((field) => {
                if (field.id === id) {
                    return { ...field, [name]: value };
                }
                return { ...field, [name]: field[name] || '' };
            });
            setFields(updatedFields);

            const ids = [];
            updatedFields.map((item) => {
                if (!item.name.trim()) ids.push(item.id);
                return item;
            });
            setValidate(
                validate.map((validation) => {
                    if (ids.includes(validation.id)) return { ...validation, status: false };
                    return { ...validation, status: true };
                })
            );
        }

        formik.setValues({
            // appointment_no: formik.values.appointment_no,
            customer: formik.values.customer,
            customer_name: formik.values.customer_name,
            document_type: formik.values.document_type,
            invoice_no: formik.values.invoice_no,
            creation_date: formik.values.creation_date,
            expected_time: formik.values.expected_time,
            total_qty: total,
            document_no: updatedFields,
            product_qty: fields1
        });
    };

    const checkClick = (id) => {
        const check = fields1.filter((item) => item.id === id);
        if (check.length) return 'none';
        return 'all';
    };
    return (
        <>
            <MainCard
                title="Create Inbound"
                secondary={
                    <Grid item>
                        <Button
                            sm={3}
                            variant="contained"
                            onClick={() => {
                                navigate('/inbound');
                            }}
                        >
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    </Grid>
                }
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                options={customers}
                                getOptionLabel={(option) => option.customer_name}
                                size="large"
                                onBlur={() => formik.setFieldTouched('customer', formik.touched.customer)}
                                onChange={(event, newValue) => {
                                    if (newValue?.id) {
                                        formik.setFieldValue('customer', newValue.id);
                                        // formik.setFieldValue('customer_name', newValue.customer_name);
                                        getProducts(newValue.id);
                                    } else {
                                        formik.setFieldValue('customer', '');
                                        setProducts([]);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select a Customer"
                                        error={formik.touched.customer && Boolean(formik.errors.customer)}
                                        helperText={formik.touched.customer && formik.errors.customer}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.customer_name}
                                    </Box>
                                )}
                            />
                        </Grid>
                        {/* {formik.values.country && ( */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small" variant="outlined">
                                <InputLabel id="Select-Service-Type">Select Document Type</InputLabel>
                                <Select
                                    labeId="Select-Service-Type"
                                    id="document_type"
                                    name="document_type"
                                    label="Select Document Type"
                                    size="large"
                                    placeholder="Select Document Type"
                                    // defaultValue="Select Service Type"
                                    value={formik.values.document_type}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="PO">PO</MenuItem>
                                    <MenuItem value="ASN">ASN</MenuItem>
                                    <MenuItem value="STN">STN</MenuItem>
                                    <MenuItem value="CHALLAN">Challan Number</MenuItem>
                                </Select>
                                {formik.errors.document_type && <FormHelperText error>{formik.errors.document_type}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <br />
                        {formik.values.document_type && (
                            <>
                                <Grid item xs={12} sm={4}>
                                    {/* <Stack> */}
                                    <FormControl fullWidth>
                                        <TextField
                                            fullWidth
                                            label="Invoice Number"
                                            id="invoice_no"
                                            name="invoice_no"
                                            autoComplete="new-password"
                                            value={formik.values.invoice_no}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            placeholder="Enter Invoice Number..."
                                        />
                                        {/* </Stack> */}
                                        {formik.errors.invoice_no && <FormHelperText error>{formik.errors.invoice_no}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField size="small" fullWidth {...props} helperText="" />}
                                            label="Creation Date"
                                            value={formik.values.creation_date}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('creation_date', newValue);
                                            }}
                                            inputFormat="dd/MM/yyyy hh:mm a"
                                            minDate={addMinutes(new Date(), 1)}
                                            // disableTimeValidation={() => disableTimeValidation(new Date())}
                                        />
                                    </LocalizationProvider>
                                    {formik.errors.creation_date && <FormHelperText error>{formik.errors.creation_date}</FormHelperText>}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField size="small" fullWidth {...props} helperText="" />}
                                            label="Expected Time"
                                            value={formik.values.expected_time}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('expected_time', newValue);
                                            }}
                                            inputFormat="dd/MM/yyyy hh:mm a"
                                            minDate={addMinutes(new Date(), 1)}
                                        />
                                    </LocalizationProvider>
                                    {formik.errors.expected_time && <FormHelperText error>{formik.errors.expected_time}</FormHelperText>}
                                </Grid>
                            </>
                        )}
                        <br />
                        {/* <Grid container spacing={gridSpacing}> */}

                        {fields1.map((field) => (
                            <Grid container item xs={12} spacing={gridSpacing} key={field.id}>
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        disablePortal
                                        id={`product_qty-${field.id}`}
                                        name={`product_qty-${field.id}`}
                                        // options={products.filter(
                                        //     (product) => !selectedProducts.some((selected) => selected.id === product.id)
                                        // )}
                                        value={field.product || null}
                                        options={products}
                                        getOptionLabel={(option) => option.product_name}
                                        size="large"
                                        onBlur={() => formik.setFieldTouched(`product_qty-${field.id}`, formik.touched.product)}
                                        onChange={(event, newValue) => {
                                            const check = fields1.filter((item) => item?.product?.id === newValue?.id);
                                            if (check.length) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: 'Product  Already Selected !',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        transition: 'SlideLeft',
                                                        close: true
                                                    })
                                                );
                                            } else handleFieldChange(field.id, 'product', newValue || null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select a Product"
                                                error={
                                                    !validateProduct[field.id - 1].status && validateProduct[field.id - 1].id === field.id
                                                }
                                                helperText={
                                                    !validateProduct[field.id - 1].status && validateProduct[field.id - 1].id === field.id
                                                }
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                {option.product_name}
                                            </Box>
                                        )}
                                    />
                                    {!validateProduct[field.id - 1].status && validateProduct[field.id - 1].id === field.id && (
                                        <FormHelperText error>{validateProduct[field.id - 1].message}</FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            fullWidth
                                            id={`product_qty-${field.id}`}
                                            name={`product_qty-${field.id}`}
                                            autoComplete={`product_qty-${field.id}`}
                                            value={field.qty}
                                            label="Quantity"
                                            placeholder="Enter Quantity"
                                            onChange={(e) => handleFieldChange(field.id, 'qty', e.target.value)}
                                            style={{ marginBottom: '16px' }}
                                            error={!validateQty[field.id - 1].status && validateQty[field.id - 1].id === field.id}
                                            InputProps={{
                                                endAdornment: (
                                                    // index === 0 ? (
                                                    <>
                                                        <IconButton onClick={handleAddField1}>
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                        {fields1.length > 1 && (
                                                            <IconButton onClick={() => handleRemoveField1(field.id)}>
                                                                <RemoveCircleIcon />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                    {!validateQty[field.id - 1].status && validateQty[field.id - 1].id === field.id && (
                                        <FormHelperText error>{validateQty[field.id - 1].message}</FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={8}>
                            {/* <Stack> */}
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label="Total Expected Quantity"
                                    id="total_qty"
                                    name="total_qty"
                                    autoComplete="new-password"
                                    value={total}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    disabled
                                />
                                {/* </Stack> */}
                                {formik.errors.total_qty && <FormHelperText error>{formik.errors.total_qty}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        {fields.map((field) => (
                            <Grid item xs={12} md={8} key={field.id}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        label="Enter Document Number"
                                        id={`document-${field.id}`}
                                        name={`document-${field.id}`}
                                        autoComplete={`document-${field.id}`}
                                        value={field.name}
                                        placeholder="Enter Document Number"
                                        error={!validate[field.id - 1].status && validate[field.id - 1].id === field.id}
                                        onInput={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                // index === 0 ? (
                                                <>
                                                    <IconButton onClick={handleAddField}>
                                                        <AddCircleIcon />
                                                    </IconButton>
                                                    {fields.length > 1 && (
                                                        <IconButton onClick={() => handleRemoveField(field.id)}>
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </>
                                            )
                                        }}
                                    />
                                </FormControl>
                                {!validate[field.id - 1].status && validate[field.id - 1].id === field.id && (
                                    <FormHelperText error>{validate[field.id - 1].message}</FormHelperText>
                                )}

                                {/* {!validate.status && <FormHelperText error>{validate.message}</FormHelperText>} */}
                            </Grid>
                        ))}
                        {/* </Grid> */}

                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Inbound
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </>
    );
}

export default CreateCustomer;
