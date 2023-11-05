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
    MenuItem
} from '@mui/material';

import InputLabel from 'ui-component/extended/Form/InputLabel';
import { visuallyHidden } from '@mui/utils';

// // third-party
import * as yup from 'yup';

// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getRoles } from 'store/slices/role';
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
import { width } from '@mui/system';
import useAuth from 'hooks/useAuth';
import { getDepartment } from 'store/slices/department';

const CreateRole = Loadable(lazy(() => import('views/forms/role/CreateRole')));
const EditRole = Loadable(lazy(() => import('views/forms/role/EditRole')));
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
    console.log('array', array);
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
        label: 'Role',
        align: 'left'
    },
    {
        id: 'dest',
        numeric: true,
        label: 'Department',
        align: 'center'
    }
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'fromCoordinates',
    //     align: 'left'
    // },
    // {
    //     id: 'latto',
    //     numeric: true,
    //     label: 'toCoordinates',
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

const RoleMaster = () => {
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
    const { roles } = useSelector((state) => state.role);
    const { departments } = useSelector((state) => state.department);
    const [loadCreateLane, setLoadCreateLane] = useState(false);
    const [editRoleForm, setEditRole] = useState(false);
    const [actionData, setActionData] = useState({});
    const [key, setKey] = useState(0);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?&all=${getAll}`;
        return str;
    };

    useEffect(() => {
        dispatch(getRoles(makeQuery()));
        dispatch(getDepartment(makeQuery()));
    }, [dispatch]);
    useEffect(() => {
        setRows(roles);
    }, [roles]);
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
            setRows(roles);
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
        dispatch(getRoles(makeQuery()));
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleFileSelect = async (event) => {
        try {
            const file = event.target.files[0];
            console.log('file', file);
            const formData = new FormData();
            formData.append('file', file);
            // formData.append('id', userid); // no need for user id as auth id is already present in backend inside req.auth object
            await axios.post('/routes/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error uploading Excel file:', error);
        }
        setKey((prevKey) => prevKey + 1);
    };
    const handleDownload = async () => {
        try {
            const response = await axios.get('/routes/excel', {
                responseType: 'blob'
            });

            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'lanefile.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreate = () => {
        setLoadCreateLane(!loadCreateLane);
        dispatch(getRoles(makeQuery()));
    };

    const handleEdit = () => {
        setEditRole(!editRoleForm);
        dispatch(getRoles(makeQuery()));
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

    const handleActive = async (id, isActive, roleName) => {
        await axios.put(`/roles/${id}`, { isActive: !isActive, role: roleName });
        dispatch(
            openSnackbar({
                open: true,
                message: `Role ${isActive ? 'disabled' : 'enabled'} successfully !`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getRoles(makeQuery()));
    };
    const handleBack = () => {
        setLoadCreateLane(false);
        setEditRole(false);
    };
    const validationSchema = yup.object({
        role: yup.string().min(3).max(30).required('Field is Required')
    });

    const formik = useFormik({
        initialValues: {
            role: '',
            department: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    setOpen(true);
                    await axios.post('/roles', formik.values);
                    resetForm();
                    handleLoad();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Role Created successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    handleClose();
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

    const handleChildData = (data) => {
        setEditRole(data);
    };

    return (
        <MainCard
            title="Role List"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        <PermissionGuard access="create_role">
                            <Button variant="contained" onClick={handleClickOpen} style={{ whiteSpace: 'nowrap' }}>
                                ADD ROLE
                            </Button>
                        </PermissionGuard>
                    </Grid>
                    {/* <Grid item sm={4}>
                        <Box display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                component="label"
                                style={{ backgroundColor: '#4caf50', color: '#ffffff', whiteSpace: 'nowrap' }}
                            >
                                Excel Upload
                                <input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    key={key}
                                />
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item sm={4}>
                        <Box display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#4caf50', color: '#ffffff', whiteSpace: 'nowrap' }}
                                onClick={handleDownload}
                            >
                                Excel Download
                            </Button>
                        </Box>
                    </Grid> */}
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
                            placeholder="Search Role"
                            value={search}
                            size="small"
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Copy">
                            <IconButton size="large">
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton size="large">
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid> */}
                </Grid>
            </CardContent>
            <Dialog create={handleCreate} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <form onSubmit={formik.handleSubmit}>
                            <DialogTitle id="form-dialog-title">Role</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1} style={{ width: '460px' }}>
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="role"
                                                value={formik.values.role}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                placeholder="Enter Role Name..."
                                            />
                                        </Stack>
                                        {formik.errors.role && <FormHelperText error>{formik.errors.role}</FormHelperText>}
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogTitle id="form-dialog-title">Department</DialogTitle>
                            <DialogContent>
                                <Grid item xs={12} md={4}>
                                    <Stack>
                                        {/* <InputLabel required>Country</InputLabel> */}
                                        <Select
                                            id="department"
                                            name="department"
                                            defaultValue="Select department"
                                            // value={formik.values.country || 'Select Country'}
                                            onChange={formik.handleChange}
                                            // onClick={countrydata}
                                        >
                                            <MenuItem value="" disabled>
                                                Select Department
                                            </MenuItem>
                                            {departments.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.department}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.errors.department && <FormHelperText error>{formik.errors.department}</FormHelperText>}
                                    </Stack>
                                </Grid>
                            </DialogContent>
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
            {editRoleForm && <EditRole data={actionData} departments={departments} onEmit={handleChildData} />}
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
                                        style={{
                                            transition: theme.transitions.create(['opacity']),
                                            opacity: row.isActive ? 1 : theme.palette.action.disabledOpacity
                                        }}
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
                                        <TableCell align="left">{row.role}</TableCell>
                                        <TableCell align="center">{row.department[0]?.department ?? '-'}</TableCell>

                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <PermissionGuard access="delete_role">
                                                <Switch
                                                    checked={row.isActive}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                                        '& .Mui-checked+.MuiSwitch-track': {
                                                            bgcolor: `${theme.palette.success.main} !important`
                                                        }
                                                    }}
                                                    title={!row.isActive ? 'disabled' : 'enabled'}
                                                    onClick={() => handleActive(row.id, row.isActive, row.role)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </PermissionGuard>
                                            <PermissionGuard access="edit_role">
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="edit"
                                                    onClick={() => handleAction('edit', row)}
                                                >
                                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
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
export default RoleMaster;
