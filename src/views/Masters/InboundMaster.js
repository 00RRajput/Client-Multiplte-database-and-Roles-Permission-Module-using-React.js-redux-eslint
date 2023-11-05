import PropTypes from 'prop-types';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Switch,
    Collapse
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useDispatch } from 'store';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useState, useEffect } from 'react';

import axios from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import Chip from 'ui-component/extended/Chip';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getInboundASN } from 'store/slices/inboundasn';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
        id: 'coll',
        numeric: true,
        label: '',
        align: 'left'
    },
    {
        id: 'app_no',
        numeric: true,
        label: 'Appointment Number',
        align: 'left'
    },
    {
        id: 'customer',
        numeric: true,
        label: 'Customer Name',
        align: 'left'
    },
    {
        id: 'creation_date',
        numeric: true,
        label: 'Creation Date',
        align: 'left'
    },
    {
        id: 'expected_time',
        numeric: true,
        label: 'Expected Date',
        align: 'left'
    },
    {
        id: 'doc_type',
        numeric: true,
        label: 'Document Type',
        align: 'left'
    },
    // {
    //     id: 'docs',
    //     numeric: true,
    //     label: 'Document No',
    //     align: 'left'
    // },
    {
        id: 'invoice',
        numeric: true,
        label: 'Invoice No',
        align: 'left'
    },
    // {
    //     id: 'products',
    //     numeric: true,
    //     label: 'Products',
    //     align: 'left'
    // },
    {
        id: 'total_qty',
        numeric: true,
        label: 'Total Product Quantity',
        align: 'left'
    },
    {
        id: 'Action',
        numeric: true,
        label: 'Action',
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
                {/* {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="left" sx={{ pr: 3 }}>
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

function Row({ row }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [openCollapse, setOpenCollapse] = useState(false);
    const navigate = useNavigate();
    const convertToReadableDate = (date) =>
        new Date(date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

    const handleActive = async (id, isActive) => {
        console.log(id, isActive);
        await axios.put(`/inbound/${id}`, { isActive: !isActive }).then((response) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Inbound ${isActive ? 'disabled' : 'enabled'} successfully !`,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
            dispatch(getInboundASN());
        });
    };

    return (
        <>
            <TableRow
                hover
                role="checkbox"
                // aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                // selected={isItemSelected}
                style={{
                    transition: theme.transitions.create(['opacity']),
                    opacity: row.is_deleted ? theme.palette.action.disabledOpacity : 1
                }}
            >
                <TableCell sx={{ pl: 3 }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpenCollapse(!openCollapse)}>
                        {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.appointment_no}</TableCell>
                <TableCell align="left">{row.customer.customer_name}</TableCell>
                <TableCell align="left">{convertToReadableDate(row.creation_date)}</TableCell>
                <TableCell align="left">{convertToReadableDate(row.expected_time)}</TableCell>
                <TableCell align="left">{row.document_type}</TableCell>
                <TableCell align="left">{row.invoice_no}</TableCell>

                <TableCell align="left">{row.total_qty}</TableCell>

                <TableCell align="left" sx={{ pr: 3 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <PermissionGuard access="delete_inbound">
                                <Switch
                                    checked={!row.is_deleted}
                                    size="small"
                                    sx={{
                                        color: theme.palette.error.main,
                                        '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                        '& .Mui-checked+.MuiSwitch-track': {
                                            bgcolor: `${theme.palette.success.main} !important`
                                        },
                                        mt: 0.5
                                    }}
                                    title={row.is_deleted ? 'disabled' : 'enabled'}
                                    onClick={() => handleActive(row.id, row.is_deleted)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </PermissionGuard>
                        </Grid>
                        <Grid item xs={6}>
                            <PermissionGuard access="edit_inbound">
                                <IconButton
                                    color="secondary"
                                    size="small"
                                    aria-label="edit"
                                    data-id={row.id}
                                    onClick={() => navigate(`/admin/asn/edit/${row.id}`)}
                                >
                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </IconButton>
                            </PermissionGuard>
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
            <TableRow key={row.id}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        {openCollapse && (
                            <Box sx={{ margin: 1 }}>
                                <TableContainer>
                                    <SubCard
                                        sx={{
                                            bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50',
                                            mb: 2
                                        }}
                                        title="Inbound Details"
                                        content={false}
                                    >
                                        <Table size="small" aria-label="vendor-details">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Document No.</TableCell>
                                                    <TableCell>Products</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow hover key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Grid container spacing={1}>
                                                            {row.document_no.map((item) => (
                                                                <Grid item key={item.id}>
                                                                    <Chip
                                                                        label={item.name}
                                                                        style={{ backgroundColor: '#46b653', color: 'white' }}
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Grid container spacing={1}>
                                                            {row.product.map((item) => (
                                                                <Grid item key={item.id}>
                                                                    <Chip
                                                                        label={`${item.productInfo.product_name}-Quantity(${item.qty})`}
                                                                        style={{ backgroundColor: '#2f5080', color: 'white' }}
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </SubCard>
                                </TableContainer>
                            </Box>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
// ==============================|| State LIST ||============================== //

const InboundMaster = () => {
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
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedActiveValue, setSelectedActiveValue] = useState('');
    const [roles, setRoles] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [disableFilter, setDisableFilter] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const { asn } = useSelector((state) => state.asn);

    function getQueryString() {
        let str = `?client=${user?.client}&`;

        if (get) str += `get=${get}&`;
        if (orderBy) str += `order_by=${orderBy}&`;
        if (order) str += `sort=${order}&`;
        if (rowsPerPage) str += `offset=${rowsPerPage}&`;
        if (page) str += `page=${page}&`;
        if (roleFilter) str += `role_id=${roleFilter}&`;
        if (nameFilter) {
            str += `name=${nameFilter}&`;
        }
        if (emailFilter) str += `email=${emailFilter}&`;
        if (phoneFilter) str += `phone=${phoneFilter}&`;
        if (disableFilter) str += `disable=${disableFilter}&`;
        console.log('str', str);
        return str;
    }

    // async function getUsers() {
    //     const response = await axios.get(`/users${getQueryString()}`);
    //     setData(response.data.data.data);
    //     setRecordCount(response.data.count);
    // }

    useEffect(() => {
        // getUsers();
    }, [component, editComponent, page, rowsPerPage, order, orderBy, roleFilter, nameFilter, emailFilter, phoneFilter, disableFilter, get]);
    useEffect(() => {
        setRows(asn);
    }, [asn]);

    useEffect(() => {
        console.log('in');
        dispatch(getInboundASN());
    }, []);
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                console.log(row);
                let matches = true;

                const properties = ['customer_name', 'document_type', 'invoice_no'];
                let containsQuery = false;

                properties.forEach((property) => {
                    console.log(row[property]);
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
        navigate('/admin/asn');
    };
    const handleBack = () => {
        setComponent(false);
        setEditComponent(false);
        // getUsers();
    };

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                setEditComponent(true);
                setComponent(false);
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

    const handleEdit = () => {
        setEditComponent(!editComponent);
        // getUsers();
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleDisable = async (event) => {
        setSelectedActiveValue(event.target.value);
        await axios.post('/');
    };

    const themes = createTheme({
        palette: {
            primary: {
                main: '#2196f3' // Set your primary color
            }
        }
    });

    return (
        <MainCard
            title="Inbound Appointment"
            content={false}
            secondary={
                <Grid item sm={3} justifycontent="space-between">
                    <PermissionGuard access="create_inbound">
                        <Button sm={3} variant="contained" onClick={() => navigate('/admin/asn')}>
                            Add Appointment
                        </Button>
                    </PermissionGuard>
                </Grid>
            }
        >
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
                            placeholder="Search Inbound"
                            value={search}
                            size="small"
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={8} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon onClick={handleFilter} />
                            </IconButton>
                        </Tooltip>
                    </Grid> */}
                </Grid>
            </CardContent>
            <TableContainer sx={{ maxHeight: 440 }}>
                {filter ? (
                    <ThemeProvider theme={themes}>
                        <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px', mb: 1 }}>
                            {/* <FormControl component="fieldset"> */}
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs={12} sm={2.5}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {!nameFilter ? (
                                                        <FilterAltOffIcon fontSize="small" />
                                                    ) : (
                                                        <FilterAltIcon fontSize="small" />
                                                    )}
                                                </InputAdornment>
                                            )
                                        }}
                                        label="Name"
                                        name="username"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={nameFilter}
                                        onInput={(event) => setNameFilter(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2.5}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {!emailFilter ? (
                                                        <FilterAltOffIcon fontSize="small" />
                                                    ) : (
                                                        <FilterAltIcon fontSize="small" />
                                                    )}
                                                </InputAdornment>
                                            )
                                        }}
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={emailFilter}
                                        onInput={(event) => setEmailFilter(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2.5}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {!phoneFilter ? (
                                                        <FilterAltOffIcon fontSize="small" />
                                                    ) : (
                                                        <FilterAltIcon fontSize="small" />
                                                    )}
                                                </InputAdornment>
                                            )
                                        }}
                                        label="Phone No"
                                        name="phone"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={phoneFilter}
                                        onInput={(event) => setPhoneFilter(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select value={selectedValue} onChange={handleChange} label="Role">
                                            <MenuItem value="Select role" disabled>
                                                Select Role
                                            </MenuItem>
                                            {roles.map((item) => (
                                                <MenuItem key={item.id} value={item.id} onClick={() => setRoleFilter(item.id)}>
                                                    {item.role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <InputLabel>Active</InputLabel>
                                        <Select value={selectedActiveValue} onChange={handleDisable} label="Active">
                                            <MenuItem value="All" key="0" onClick={() => setGet('all')}>
                                                All
                                            </MenuItem>
                                            <MenuItem value="Enabled" key="1" onClick={() => setGet('active')}>
                                                Enabled
                                            </MenuItem>
                                            <MenuItem value="Disabled" key="2" onClick={() => setGet('deleted')}>
                                                Disable
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {/* </FormControl> */}
                        </Box>
                    </ThemeProvider>
                ) : null}
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
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                            <Row row={row} key={index} />
                        ))}
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
        </MainCard>
    );
};

export default InboundMaster;
