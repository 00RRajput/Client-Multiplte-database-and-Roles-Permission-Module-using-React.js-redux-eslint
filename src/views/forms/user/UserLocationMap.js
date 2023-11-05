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
    Stack,
    FormHelperText,
    Select,
    MenuItem
} from '@mui/material';

import InputLabel from 'ui-component/extended/Form/InputLabel';
import { visuallyHidden } from '@mui/utils';

// // third-party
import * as yup from 'yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import {} from 'store/slices/user';
import axios from 'utils/axios';
import { useFormik } from 'formik';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';
import { getUserLocation } from 'store/slices/user.location';

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
        label: 'User',
        align: 'left'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'Location',
        align: 'left'
    }
];
// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
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
                {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="right" sx={{ pr: 3 }}>
                        Action
                    </TableCell>
                )}
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

const UserLocationMap = () => {
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
    const { customeruser } = useSelector((state) => state.customeruser);
    const { userloaction } = useSelector((state) => state.userloaction);
    const [actionData, setActionData] = useState({});
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [locations, setLocations] = useState([]);
    const { user } = useAuth();

    const customeruserFiltered = customeruser.filter((item1) => item1.customer.length > 0);

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?&all=${getAll}`;
        // str += `?&client=${user.client_id}`;
        return str;
    };
    console.log('actionData', actionData);
    async function getUsers() {
        const response = await axios.get(`/users`);
        setData(response.data.data.data);
    }

    const getLocations = async () => {
        try {
            const res = await axios.get(`/location/admin`);
            setLocations(res.data.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(getUserLocation(makeQuery()));
        getUsers();
        getLocations();
    }, [dispatch]);
    useEffect(() => {
        setRows(userloaction);
    }, [userloaction]);
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
            setRows(customeruserFiltered);
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

    const handleClose = () => {
        setOpen(false);
    };

    const validationSchema = yup.object({
        user_id: yup.string().required('User is Required'),
        location_id: yup.string().required('Location is required')
    });

    const productIdsInFirstArray = customeruserFiltered.flatMap((item) => item.customer.map((product) => product.id));

    // Filter the second array to remove items that exist in the first array
    const filteredSecondArray = customers.filter((item) => !productIdsInFirstArray.includes(item.id));

    const formik = useFormik({
        initialValues: {
            id: '',
            location_id: '',
            user_id: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    setOpen(true);
                    await axios.post('/user/location', formik.values);
                    resetForm();
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
                    dispatch(getUserLocation(makeQuery()));
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

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                formik.setFieldValue('id', data?.id);
                formik.setFieldValue('user_id', data?.user_id);
                formik.setFieldValue('location_id', data?.location_id);
                setOpen(true);
                setActionData(data);
                break;
            default:
                break;
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
        formik.setFieldValue('id', '');
        formik.setFieldValue('user_id', '');
        formik.setFieldValue('location_id', '');
    };

    const handleCreate = () => {
        // // setLoadCreateLane(!loadCreateLane);
        // dispatch(getRoles(makeQuery()));
    };

    const handleDelete = async (id, status, del) => {
        await axios.put(`/user/location/${id}`, { status, del });
        dispatch(
            openSnackbar({
                open: true,
                message: `Mapping ${del ? 'Removed' : 'Updated'} Succeesfully!`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getUserLocation(makeQuery()));
    };

    return (
        <MainCard
            title="User Location Mapping List"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        <PermissionGuard access="create_user_location">
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
                            <Grid container spacing={gridSpacing} style={{ width: '560px', padding: '19px' }}>
                                <Grid item xs={12} md={12}>
                                    <Stack>
                                        <InputLabel required>User</InputLabel>
                                        <Select
                                            id="User"
                                            name="User"
                                            defaultValue="Select User"
                                            value={formik.values.user_id || 'Select User'}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue('user_id', newValue.props.value);
                                            }}
                                        >
                                            <MenuItem value="Select User" selected disabled>
                                                Select User
                                            </MenuItem>
                                            {data.map((item) => (
                                                <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.user_id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.errors.user_id && <FormHelperText error>{formik.errors.user_id}</FormHelperText>}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Stack>
                                        <InputLabel required>Location</InputLabel>
                                        <Select
                                            id="location"
                                            name="location"
                                            defaultValue="Select Location"
                                            value={formik.values.location_id || 'Select Location'}
                                            onChange={(event, newValue) => {
                                                // formik.setFieldValue('location', newValue.props.value);
                                                formik.setFieldValue('location_id', newValue.props.value);
                                            }}
                                        >
                                            <MenuItem value="Select Location" selected disabled>
                                                Select Location
                                            </MenuItem>
                                            {locations.map((item) => (
                                                <MenuItem key={item.id} value={item.id} selected={item.id === formik.values.location_id}>
                                                    {item.location_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.errors.location_id && <FormHelperText error>{formik.errors.location_id}</FormHelperText>}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ pr: 2.5 }}>
                                <Button sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button variant="contained" size="small" type="submit">
                                    {formik.values.id === '' ? 'Add' : 'Update'}
                                </Button>
                            </DialogActions>
                        </form>
                    </>
                )}
            </Dialog>
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
                                const isItemSelected = isSelected(row.from);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell align="left">{row.user.name}</TableCell>
                                        <TableCell align="left">{`${row.locations.address}, ${row.locations.city_name}, ${row.locations.state_name}, ${row.locations.country_name}`}</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <PermissionGuard access="delete_user_location">
                                                <Switch
                                                    checked={row.isActive}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                                        '& .Mui-checked+.MuiSwitch-track': {
                                                            bgcolor: `${theme.palette.success.main} !important`
                                                        }
                                                    }}
                                                    title={row.isActive ? 'disabled' : 'enabled'}
                                                    onClick={() => handleDelete(row.id, row.isActive, false)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </PermissionGuard>
                                            <PermissionGuard access="edit_user_location">
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="edit"
                                                    data-id={row.id}
                                                    onClick={() => handleAction('edit', row)}
                                                    // data-value={row.hub_loc.coordinates}
                                                >
                                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
                                            </PermissionGuard>
                                            <PermissionGuard access="delete_user_location">
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="delete"
                                                    data-id={row.id}
                                                    onClick={() => handleDelete(row.id, row.isActive, true)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </PermissionGuard>
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
export default UserLocationMap;
