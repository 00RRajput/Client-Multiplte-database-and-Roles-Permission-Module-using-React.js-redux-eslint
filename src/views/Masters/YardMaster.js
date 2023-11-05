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
    Switch,
    Collapse
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import { gridSpacing } from 'store/constant';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SubCard from 'ui-component/cards/SubCard';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import SearchIcon from '@mui/icons-material/Search';

import { useState, useEffect } from 'react';

import axios from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
        id: '',
        numeric: true,
        label: '',
        align: 'center'
    },
    // {
    //     id: 'yardname',
    //     numeric: true,
    //     label: 'Yard Name',
    //     align: 'left'
    // },
    {
        id: 'yardlocation',
        numeric: true,
        label: 'Yard Location',
        align: 'left'
    },
    {
        id: 'customer',
        numeric: true,
        label: 'Customer',
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

const YardMaster = () => {
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
    const { user } = useAuth();
    const navigate = useNavigate();
    const [openCollapse, setOpenCollapse] = useState(false);
    // function getQueryString() {
    //     let str = `?client=${user?.client}&`;

    //     if (get) str += `get=${get}&`;
    //     if (orderBy) str += `order_by=${orderBy}&`;
    //     if (order) str += `sort=${order}&`;
    //     if (rowsPerPage) str += `offset=${rowsPerPage}&`;
    //     if (page) str += `page=${page}&`;
    //     if (roleFilter) str += `role_id=${roleFilter}&`;
    //     if (nameFilter) {
    //         str += `name=${nameFilter}&`;
    //     }
    //     if (emailFilter) str += `email=${emailFilter}&`;
    //     if (phoneFilter) str += `phone=${phoneFilter}&`;
    //     if (disableFilter) str += `disable=${disableFilter}&`;
    //     console.log('str', str);
    //     return str;
    // }
    const getYard = async () => {
        const resp = await axios.get(`/yard?client=${user.client_id}`);
        setRows(resp.data.data.yards);
        setData(resp.data.data.yards);
    };
    useEffect(() => {
        getYard();
    }, [component, editComponent, page, rowsPerPage, order, orderBy, get]);
    useEffect(() => {
        setRows(data);
    }, [data]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = [
                    'customer.customer_name',
                    'location.address',
                    'location.city',
                    'location.state',
                    'location.country',
                    'location.pincode'
                ];
                // const properties = ['location.[address,city,stagte,country,pincode]'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (property.includes('.')) {
                        const newProperty = property.split('.');
                        // let nextProperty = newProperty.map(property=> property.startsWith('[') && property.replace(/\[|\]/g, ''))
                        // newProperty = nextProperty.map((property, ind) => {
                        //     if (property) {
                        //         return property.split(',');
                        //     } else return newProperty[ind];
                        // });

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
        navigate('/add-yard');
        setComponent(!component);
    };
    const handleBack = () => {
        setComponent(false);
        setEditComponent(false);
        // getUsers();
    };

    const deleteRow = async (yardId) => {
        // if (confirm('are you sure ?')) {
        await axios.delete(`/yard/${yardId}`);
        getYard();
        dispatch(
            openSnackbar({
                open: true,
                message: `Yard deleted successfully!`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        // }
    };

    const handleAction = (action, yardId) => {
        switch (action) {
            case 'edit':
                navigate(`/edit-yard/${yardId}`);
                break;
            case 'delete':
                deleteRow(yardId);
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

    // const handleEdit = () => {
    //     setEditComponent(!editComponent);
    //     getUsers();
    // };
    const handleActive = async (id, status) => {
        try {
            await axios.get(`/yard/status/${id}`);
            getYard();
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Yard ${status ? 'disabled' : 'enabled'} successfully !`,
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
            // getUsers();
        }
    };
    const handleFilter = async () => {
        setFilter(!filter);
    };
    const getRoles = async () => {
        const res = await axios.get('/roles');
        setRoles(res.data.data.roles);
    };
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleDisable = (event) => {
        setSelectedActiveValue(event.target.value);
        axios.post('/');
    };
    useEffect(() => {
        getRoles();
    }, []);
    const themes = createTheme({
        palette: {
            primary: {
                main: '#2196f3' // Set your primary color
            }
        }
    });

    const changeRole = (role) => {
        let newRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        newRole = role.replace(/[^\w\s]|_/g, ' ');
        return newRole;
    };

    function Row({ row }) {
        const theme = useTheme();
        const [openCollapse, setOpenCollapse] = useState(false);
        if (typeof row === 'number') return null;
        const isItemSelected = isSelected(row.id);
        const labelId = `enhanced-table-checkbox-${row.index}`;
        return (
            <>
                <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.index}
                    selected={isItemSelected}
                    style={{
                        transition: theme.transitions.create(['opacity']),
                        opacity: row.isActive ? 1 : theme.palette.action.disabledOpacity
                    }}
                >
                    <TableCell sx={{ pl: 3 }}>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpenCollapse(!openCollapse)}>
                            {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell align="left">{`${row.location?.address}, ${row.location?.city}, ${row.location?.state}, ${row.location?.country}, ${row.location?.pincode}`}</TableCell>
                    <TableCell align="left">{row.customer?.customer_name}</TableCell>
                    <TableCell align="left" sx={{ pr: 3 }}>
                        <PermissionGuard access="delete_yard">
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
                        <PermissionGuard access="edit_yard">
                            <IconButton
                                color="secondary"
                                size="large"
                                aria-label="edit"
                                data-id={row.id}
                                onClick={() => handleAction('edit', row.id)}
                                // data-value={row.hub_loc.coordinates}
                            >
                                <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </IconButton>
                        </PermissionGuard>
                        <PermissionGuard access="delete_yard">
                            <IconButton
                                color="secondary"
                                size="large"
                                aria-label="edit"
                                data-id={row.id}
                                onClick={() => handleAction('delete', row.id)}
                                // data-value={row.hub_loc.coordinates}
                            >
                                <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                            </IconButton>
                        </PermissionGuard>
                    </TableCell>
                </TableRow>
                <TableRow key={row.id}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
                        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                            {openCollapse && (
                                <Box sx={{ margin: 1 }}>
                                    <TableContainer>
                                        <SubCard
                                            sx={{
                                                bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50',
                                                mb: 2
                                            }}
                                            title="Section Deatils"
                                            content={false}
                                        >
                                            <Table size="small" aria-label="vendor-details">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Section Name</TableCell>
                                                        <TableCell align="center">Capacity</TableCell>
                                                        <TableCell align="center">Utilized</TableCell>
                                                        <TableCell align="center">Product Name</TableCell>
                                                        <TableCell align="center">Product Type</TableCell>
                                                        <TableCell align="center">Product Description</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {row.yardsection.length ? (
                                                        row.yardsection.map((section) => (
                                                            <TableRow hover>
                                                                <TableCell align="center">{section?.section_name}</TableCell>
                                                                <TableCell align="center">{section?.capacity}</TableCell>
                                                                <TableCell align="center">0</TableCell>
                                                                <TableCell align="center">{section.product_name}</TableCell>
                                                                <TableCell align="center">{section.product_type}</TableCell>
                                                                <TableCell align="center">{section.product_desc}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow align="center" colSpan={3} hover>
                                                            No Section
                                                        </TableRow>
                                                    )}
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

    return (
        <MainCard
            title="Yards"
            content={false}
            secondary={
                <Grid item sm={3} justifycontent="space-between">
                    <PermissionGuard access="create_yard">
                        <Button sm={3} variant="contained" onClick={handleLoad}>
                            ADD Yard
                        </Button>
                    </PermissionGuard>
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
            ) : null}
            {/* {component && !editComponent ? <CreateUser create={handleCreate} /> : null} */}
        </MainCard>
    );
};

export default YardMaster;
