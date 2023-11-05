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
    DialogTitle,
    Stack,
    FormHelperText
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

// // third-party
import * as yup from 'yup';

// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getDispatch } from 'store/slices/dispatchtype';
import axios from 'utils/axios';
import { useFormik } from 'formik';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';

const EditDepartment = Loadable(lazy(() => import('views/forms/dispatch/EditDispatch')));
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
        label: 'Dispatch Type',
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

const DispatchMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const { dispatchtype } = useSelector((state) => state.dispatchtype);
    const [loadCreateLane, setLoadCreateLane] = useState(false);
    const [editDepartmentForm, setEditDepartment] = useState(false);
    const [actionData, setActionData] = useState({});
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const makeQuery = () => {
        const str = '';
        // if (getAll) str += `?client=${user?.client}&all=${getAll}`;
        return str;
    };

    useEffect(() => {
        dispatch(getDispatch());
    }, [dispatch]);
    useEffect(() => {
        setRows(dispatchtype);
    }, [dispatchtype]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['department'];
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
            setRows(dispatchtype);
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
        setEditDepartment(false);
        dispatch(getDispatch(makeQuery()));
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        setLoadCreateLane(!loadCreateLane);
        dispatch(getDispatch(makeQuery()));
    };

    const handleAction = (action, data) => {
        console.log('data', data);
        switch (action) {
            case 'edit':
                setEditDepartment(true);
                setActionData(data);
                break;
            default:
                setEditDepartment(false);
                setLoadCreateLane(false);
                break;
        }
    };

    const handleActive = async (id, isActive, deprtmentName) => {
        await axios.put(`/dispatch/${id}`, { client: user?.client, department: deprtmentName, isActive: !isActive });
        dispatch(
            openSnackbar({
                open: true,
                message: `Dispatch Type ${isActive ? 'disabled' : 'enabled'} successfully !`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getDispatch(makeQuery()));
    };
    const handleBack = () => {
        setLoadCreateLane(false);
        setEditDepartment(false);
    };
    const validationSchema = yup.object({
        dispatch: yup.string().min(3).max(30).required('Field is Required')
    });

    const formik = useFormik({
        initialValues: {
            // client: user?.client,
            dispatch: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    setOpen(true);
                    const setValues = { dispatch_type: formik.values.dispatch };
                    await axios.post('/dispatch', setValues);
                    resetForm();
                    handleLoad();
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Dispatch Type Created successfully !',
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
        setEditDepartment(data);
    };

    return (
        <MainCard
            title="Dispatch Type List"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        <PermissionGuard access="create_department">
                            <Button variant="contained" onClick={handleClickOpen} style={{ whiteSpace: 'nowrap' }}>
                                ADD DISPATCH TYPE
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
                            placeholder="Search Dispatch Type"
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
                            <DialogTitle id="form-dialog-title">Dispatch</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1} style={{ width: '460px' }}>
                                            <TextField
                                                fullWidth
                                                id="dispatch"
                                                name="dispatch"
                                                value={formik.values.department}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                placeholder="Enter Dispatch Type..."
                                            />
                                        </Stack>
                                        {formik.errors.dispatch && <FormHelperText error>{formik.errors.dispatch}</FormHelperText>}
                                    </Grid>
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
            {editDepartmentForm ? <EditDepartment data={actionData} onEmit={handleChildData} /> : null}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table sx={{ minWidth: 750 }} stickyHeader aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        theme={theme}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length || 0}
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
                                        <TableCell align="left">{row.dispatch_type}</TableCell>

                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <PermissionGuard access="delete_department">
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
                                                    onClick={() => handleActive(row.id, row.isActive, row.department)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </PermissionGuard>
                                            <PermissionGuard access="edit_department">
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
export default DispatchMaster;
