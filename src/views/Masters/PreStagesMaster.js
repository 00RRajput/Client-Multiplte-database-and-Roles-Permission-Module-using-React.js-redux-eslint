import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
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
    Switch
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';

import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useState, useEffect } from 'react';

import ViewChecklist from '../forms/pre-stages/view_checklist';
import CreatePreStagess from '../forms/pre-stages/create';
import axios from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';

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
        id: 'customer',
        numeric: true,
        label: 'Customer',
        align: 'left'
    },
    {
        id: 'location',
        numeric: true,
        label: 'Location',
        align: 'left'
    },
    {
        id: 'form_name',
        numeric: true,
        label: 'Form Name',
        align: 'left'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ order, orderBy, numSelected, onRequestSort, selected }) {
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
                    <TableCell sortDirection={false} align="left" sx={{ pr: 3 }}>
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
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
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

const UserMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [get, setGet] = useState('all');
    const [recordCount, setRecordCount] = useState(0);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const [data, setData] = useState([]);
    const [component, setComponent] = useState(false);
    const [editComponent, setEditComponent] = useState(false);
    const [actionData, setActionData] = useState({});
    const [filter, setFilter] = useState(false);
    const [viewChecklistPopup, setViewChecklistPopup] = useState(false);
    const [editData, setEditData] = useState({});

    async function getTableData() {
        const response = await axios.get(`/pre-stages`);
        setData(response.data.data.data);
        setRecordCount(response.data.count);
    }

    useEffect(() => {
        getTableData();
    }, [component, editComponent, page, rowsPerPage, order, orderBy, get]);
    useEffect(() => {
        setRows(data);
    }, [data]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                console.log(row);
                let matches = true;

                const properties = [
                    'customers.customer_name',
                    'locations.address',
                    'locations.city_name',
                    'locations.state_name',
                    'locations.country_name',
                    'locations.pin',
                    'form_name'
                ];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (property.includes('.')) {
                        const newProperty = property.split('.');
                        if (row[newProperty[0]][newProperty[1]].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                            containsQuery = true;
                        }
                    } else if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
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
            setRows(data);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleLoad = () => {
        setComponent(!component);
        setEditData({});
    };
    const handleBack = () => {
        setComponent(false);
        setEditComponent(false);
        getTableData();
    };

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                setComponent(!component);
                setEditData(data);
                break;
            case 'view':
                setViewChecklistPopup(true);
                setActionData(data);
                break;
            default:
                setComponent(false);
                setEditComponent(false);
                break;
        }
    };
    const handleCreate = () => {
        setComponent(!component);
    };

    const handleActive = async (id, isActive, client) => {
        try {
            await axios.put(`/pre-stages/${id}`, { isActive: !isActive });
            dispatch(
                openSnackbar({
                    open: true,
                    message: `${isActive ? 'disabled' : 'enabled'} successfully !`,
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
                    message: 'unable to update user !',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
        } finally {
            getTableData();
        }
    };
    const handleFilter = async () => {
        setFilter(!filter);
    };

    const handleChildData = (data) => {
        setViewChecklistPopup(data);
    };
    return (
        <MainCard
            title="Pre-Stages"
            content={false}
            secondary={
                <Grid item sm={3} justifycontent="space-between">
                    {!component && !editComponent ? (
                        <PermissionGuard access="create_prestages">
                            <Button sm={3} variant="contained" onClick={handleLoad}>
                                ADD
                            </Button>
                        </PermissionGuard>
                    ) : (
                        <Button sm={3} variant="contained" onClick={handleBack}>
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    )}
                </Grid>
            }
        >
            {!component && !editComponent ? (
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={handleSearch}
                                placeholder="Search User"
                                value={search}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{ textAlign: 'right' }}>
                            <Tooltip title="Filter">
                                <IconButton size="large">
                                    <FilterListIcon onClick={handleFilter} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            ) : null}
            {!component && !editComponent ? (
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
                            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                const isItemSelected = isSelected(row.id);
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
                                            opacity: row.is_deleted ? theme.palette.action.disabledOpacity : 1
                                        }}
                                    >
                                        <TableCell align="left">{row.customers.customer_name}</TableCell>
                                        <TableCell onClick={(event) => handleClick(event, row.id)} align="left" id={row.id}>
                                            {`${row.locations?.address}, ${row.locations?.city_name}, ${row.locations?.state_name}, ${row.locations?.country_name}, ${row.locations?.pin}`}
                                        </TableCell>
                                        <TableCell align="left">{row.form_name}</TableCell>
                                        <TableCell align="left" sx={{ pr: 3 }}>
                                            <PermissionGuard access="delete_prestages">
                                                <Switch
                                                    checked={row.isActive}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                                        '& .Mui-checked+.MuiSwitch-track': {
                                                            bgcolor: `${theme.palette.success.main} !important`
                                                        }
                                                    }}
                                                    title={row.isActive ? 'enabled' : 'disabled'}
                                                    onClick={() => handleActive(row.id, row.isActive)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </PermissionGuard>
                                            <PermissionGuard access="edit_prestages">
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="edit"
                                                    data-id={row.id}
                                                    onClick={() => handleAction('view', row)}
                                                    // data-value={row.hub_loc.coordinates}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: '1.5rem' }} />
                                                </IconButton>
                                            </PermissionGuard>
                                            <PermissionGuard access="edit_prestages">
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 40, 80, 100]}
                        component="div"
                        count={recordCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            ) : null}
            {component && !editComponent && !viewChecklistPopup ? <CreatePreStagess create={handleCreate} editData={editData} /> : null}
            {viewChecklistPopup && !editComponent && !component ? <ViewChecklist data={actionData} onEmit={handleChildData} /> : null}
        </MainCard>
    );
};

export default UserMaster;
