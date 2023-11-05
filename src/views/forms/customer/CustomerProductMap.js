import PropTypes from 'prop-types';
import { useState, useEffect, lazy, React } from 'react';

import { gridSpacing } from 'store/constant';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Switch,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    FormHelperText,
    Select,
    MenuItem,
    FormControl,
    Chip,
    FormControlLabel,
    Checkbox
} from '@mui/material';

import InputLabel from 'ui-component/extended/Form/InputLabel';
import { visuallyHidden } from '@mui/utils';

// // third-party
import * as yup from 'yup';

// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import customer, { getCustomers } from 'store/slices/customer';
import product, { getProducts } from 'store/slices/product';
import { getCustomerProduct } from 'store/slices/customer.product';
import axios from 'utils/axios';
import { useFormik } from 'formik';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { openSnackbar } from 'store/slices/snackbar';
// import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import useAuth from 'hooks/useAuth';

const CreateRole = Loadable(lazy(() => import('views/forms/role/CreateRole')));
// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    // console.log('array', array);
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header options
const headCells = [
    {
        id: 'dest',
        numeric: true,
        label: 'Customer',
        align: 'left'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'Product',
        align: 'left'
    }
    // {
    //     id: 'latto',
    //     numeric: true,
    //     label: 'Action',
    //     align: 'left'
    // }
];
// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell> */}
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={6}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {/* {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="right" sx={{ pr: 3 }}>
                        Action
                    </TableCell>
                )} */}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| State LIST ||============================== //

const CustomerProductMap = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    // const { user } = useAuth();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [getAll, setGetAll] = useState(true);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const { customers } = useSelector((state) => state.customer);
    const { products } = useSelector((state) => state.product);
    const { customerproduct } = useSelector((state) => state.customerproduct);

    const [loadCreateLane, setLoadCreateLane] = useState(false);
    const [editRoleForm, setEditRole] = useState(false);
    const [actionData, setActionData] = useState({});
    const [key, setKey] = useState(0);
    const [open, setOpen] = useState(false);
    const [isVOpen, setIsVOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const { user } = useAuth();
    const customerproductFiltered = customerproduct.filter((customer) => customer.product.length > 0);

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?&all=${getAll}`;
        return str;
    };

    useEffect(() => {
        dispatch(getCustomers(makeQuery()));
        dispatch(getProducts());
        dispatch(getCustomerProduct());
    }, [dispatch]);
    useEffect(() => {
        setRows(customerproductFiltered);
    }, [customerproductFiltered]);
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['role'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            setRows(customerproductFiltered);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.Vehicle_type);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleLoad = () => {
        setLoadCreateLane(false);
        setEditRole(false);
        // dispatch(getRoles(makeQuery()));
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        setLoadCreateLane(!loadCreateLane);
        // dispatch(getRoles(makeQuery()));
    };

    const handleEdit = () => {
        setEditRole(!editRoleForm);
        // dispatch(getRoles(makeQuery()));
    };

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                setEditRole(true);
                // setLoadCreateLane(false);
                // setEditOpen(true);
                setActionData(data);
                break;
            default:
                setEditRole(false);
                setLoadCreateLane(false);
                break;
        }
    };
    const validationSchema = yup.object({
        customer: yup.string().min(3).max(30).required('Field is Required'),
        product: yup.array().min(1).required('Product is required')
    });
    const handleOK = () => {
        setIsVOpen(false);
    };
    // console.log('product', customerproduct);

    const productIdsInFirstArray = customerproductFiltered.flatMap((item) => item.product.map((product) => product.id));

    // Filter the second array to remove items that exist in the first array
    const filteredSecondArray = products.filter((item) => !productIdsInFirstArray.includes(item.id));

    const formik = useFormik({
        initialValues: {
            customer: '',
            customer_name: '',
            product: [],
            product_name: []
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    formik.values.product = formik.values.product.map((vehicle) => vehicle.id);
                    console.log('Fomik', formik.values);
                    setOpen(true);
                    await axios.post('/customer/product', formik.values);
                    resetForm();
                    handleLoad();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Mapped successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    handleClose();
                    dispatch(getCustomerProduct());
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

    const handleDelete = async (item, row) => {
        // console.info('You clicked the delete icon.', item, row);
        // console.log(item, row);
        await axios.put(`/customer/product/${item.id}`, { id: row.id });
        dispatch(
            openSnackbar({
                open: true,
                message: 'Mapping Removed Successfully !',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getCustomerProduct());
    };
    return (
        <MainCard
            title="Mapping List"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        <PermissionGuard access="create_customer_product">
                            <Button variant="contained" onClick={handleClickOpen} style={{ whiteSpace: 'nowrap' }}>
                                Add Mapping
                            </Button>
                        </PermissionGuard>
                    </Grid>
                </Grid>
            }
        >
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder="Search Mapping"
                            value={search}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Dialog create={handleCreate} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} md={6} style={{ width: '520px', padding: '10px' }}>
                                <DialogTitle id="form-dialog-title" sx={{ marginLeft: 'auto' }}>
                                    Customer
                                </DialogTitle>
                                <DialogContent id="form-dialog-title">
                                    {/* <Stack spacing={1} style={{ width: '460px' }}> */}
                                    <FormControl fullWidth size="large" variant="outlined" sx={{ mt: 1 }}>
                                        <InputLabel id="customer">Select Customer</InputLabel>
                                        <Select
                                            id="customer"
                                            name="customer"
                                            fullWidth
                                            label="Select Customer"
                                            labelId="customer"
                                            placeholder="Select Customer"
                                            // value={formik.values.country || 'Select Country'}
                                            onChange={(event, newValue) => {
                                                // console.log(newValue.props.value);
                                                formik.setFieldValue('customer_name', newValue.props.value.customer_name);
                                                formik.setFieldValue('customer', newValue.props.value.id);
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select Customer
                                            </MenuItem>
                                            {customers.map((item) => (
                                                <MenuItem key={item.id} value={item}>
                                                    {item.customer_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {formik.errors.customer && <FormHelperText error>{formik.errors.customer}</FormHelperText>}
                                    {/* </Stack> */}
                                </DialogContent>
                                {/* </Grid> */}
                                {/* <Grid item xs={12} md={4} style={{ width: '520px', padding: '10px' }}> */}
                                <DialogTitle id="form-dialog-title">Product</DialogTitle>
                                <DialogContent>
                                    <FormControl fullWidth size="large" variant="outlined" sx={{ mt: 1 }}>
                                        <InputLabel id="product">Select Products</InputLabel>
                                        <Select
                                            labelId="product"
                                            id="product"
                                            name="product"
                                            fullWidth
                                            value={formik.values.product || []}
                                            // value={Array.isArray(formik.values.product) ? formik.values.product : []}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            error={formik.touched.product && Boolean(formik.errors.product)}
                                            label="Select Product"
                                            multiple
                                            renderValue={(selected) => {
                                                if (selected.includes('on')) formik.setFieldValue('product', '');
                                                if (selected.length === 0) {
                                                    // formik.setFieldValue('product', '');
                                                    return null;
                                                }

                                                const selectedOptions = selected.map((value) => {
                                                    if (value && value.id) {
                                                        return (
                                                            <Chip
                                                                key={`${value.id}-${value.vehicle_type}`}
                                                                label={value.product_name}
                                                                onClick={() => {
                                                                    const index = formik.values.vehicletype.findIndex(
                                                                        (item) => item.id === value.id
                                                                    );
                                                                    if (index > -1) {
                                                                        const updatedValues = [...formik.values.product];
                                                                        updatedValues.splice(index, 1);
                                                                        formik.handleChange({
                                                                            target: { name: 'product', value: updatedValues }
                                                                        });
                                                                        if (!updatedValues) {
                                                                            formik.setFieldError('product', 'Product is Required');
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    mb: '2px',
                                                                    mr: '2px'
                                                                }}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                });

                                                return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{selectedOptions}</div>;
                                            }}
                                            open={isVOpen}
                                            onClose={() => setIsVOpen(false)}
                                            onOpen={() => setIsVOpen(true)}
                                        >
                                            {formik.errors.product && formik.touched.product && <div>{formik.errors.product}</div>}
                                            {filteredSecondArray.map((vehicle) => (
                                                <MenuItem key={vehicle.id} value={vehicle}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                // key={vehicle.id}
                                                                checked={formik.values.product.includes(vehicle)}
                                                                onChange={(event) => {
                                                                    if (!formik.values.product.length) {
                                                                        formik.setFieldError('product', 'Product is Required');
                                                                    }
                                                                    formik.handleChange(event);
                                                                }}
                                                                value={vehicle}
                                                                name="product"
                                                                style={{ pointerEvents: 'none' }}
                                                            />
                                                        }
                                                        label={vehicle.product_name}
                                                    />
                                                </MenuItem>
                                            ))}
                                            {isVOpen && (
                                                <Button variant="contained" color="primary" onClick={handleOK} fullWidth>
                                                    OK
                                                </Button>
                                            )}
                                        </Select>
                                        {formik.errors.product && <FormHelperText error>{formik.errors.product}</FormHelperText>}
                                    </FormControl>
                                </DialogContent>
                            </Grid>
                            <DialogActions sx={{ pr: 2.5 }}>
                                <Button sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button variant="contained" size="small" type="submit">
                                    Add
                                </Button>
                            </DialogActions>
                        </form>
                    </>
                )}
            </Dialog>
            {/* {editRoleForm && <EditRole data={actionData} onEmit={handleChildData} />} */}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table sx={{ minWidth: 750 }} stickyHeader aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        theme={theme}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        selected={selected}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                // const isItemSelected = isSelected(row.from);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        // aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        // selected={isItemSelected}
                                        // style={{
                                        //     transition: theme.transitions.create(['opacity']),
                                        //     opacity: row.isActive ? 1 : theme.palette.action.disabledOpacity
                                        // }}
                                    >
                                        {/* <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.from)}>
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell> */}
                                        <TableCell align="left">{row.customer[0].customer_name}</TableCell>
                                        <TableCell align="left">
                                            {row.product.map((item, index) => (
                                                // <Grid item>
                                                <Tooltip title="Remove Mapping" arrow>
                                                    <Chip
                                                        label={item.product_name}
                                                        onDelete={() => {
                                                            handleDelete(item, row);
                                                        }}
                                                        variant="outlined"
                                                        Tooltip="Remove Mapping"
                                                        sx={{ mr: '4px', ml: '4px' }}
                                                    />
                                                </Tooltip>
                                                // </Grid>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </MainCard>
    );
};
export default CustomerProductMap;
