import PropTypes from 'prop-types';
import { useState, useEffect, lazy } from 'react';

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
    Collapse
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getClients } from 'store/slices/client';
import { getConfigurationMenu } from 'store/slices/configuration';
import axios from 'utils/axios';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SubCard from 'ui-component/cards/SubCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';

const CreateClient = Loadable(lazy(() => import('views/forms/client/CreateClient')));
const EditClient = Loadable(lazy(() => import('views/forms/client/EditClient')));
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

function getFilteredDate(date) {
    const newDate = new Date(date);
    return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
}

// table header options
const headCells = [
    {
        id: '',
        numeric: true,
        label: '',
        align: 'center'
    },
    {
        id: 'current',
        numeric: true,
        label: 'Client',
        align: 'center'
    },
    {
        id: 'dest',
        numeric: true,
        label: 'User Name',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'Client Code',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'MSME No',
        align: 'center'
    },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Registration No',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'License No',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'License Issue Date',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'License Expiry Date',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'POC',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'POC Mobile',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'POC Other Phone',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Email',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Industry',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Year Incorporated',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Business Presence',
    //     align: 'center'
    // },

    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'Website',
    //     align: 'center'
    // },
    // {
    //     id: 'latcur',
    //     numeric: true,
    //     label: 'No of Yard',
    //     align: 'center'
    // },
    {
        id: 'latcur',
        numeric: true,
        label: 'Resgister Address',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'City',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'State',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'Country',
        align: 'center'
    },
    {
        id: 'latcur',
        numeric: true,
        label: 'Pincode',
        align: 'center'
    }

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
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
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

const Client = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { user } = useAuth();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [getAll, setGetAll] = useState(true);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const { clients } = useSelector((state) => state.client);
    const [loadCreateClient, setLoadCreateClient] = useState(false);
    const [loadEditClient, setLoadEditClient] = useState(false);
    const [actionData, setActionData] = useState({});
    const [key, setKey] = useState(0);
    const [openCollapse, setOpenCollapse] = useState(false);

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    useEffect(() => {
        dispatch(getClients(makeQuery()));
    }, [dispatch]);
    useEffect(() => {
        setRows(clients);
    }, [clients]);
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['from', 'to'];
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
            setRows(clients);
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
        setLoadCreateClient(true);
        setLoadEditClient(false);
        dispatch(getClients(makeQuery()));
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
        setLoadCreateClient(!loadCreateClient);
        dispatch(getClients(makeQuery()));
    };

    const handleEdit = () => {
        setLoadEditClient(!loadEditClient);
        dispatch(getClients(makeQuery()));
    };

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                setLoadEditClient(true);
                setLoadCreateClient(false);
                setActionData(data);
                break;
            default:
                setLoadEditClient(false);
                setLoadCreateClient(false);
                break;
        }
    };

    const handleActive = async (id, isActive) => {
        await axios.put(`/client/${id}`, { isActive: !isActive });
        dispatch(
            openSnackbar({
                open: true,
                message: `Client ${isActive ? 'disabled' : 'enabled'} successfully !`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getClients(makeQuery()));
        dispatch(getConfigurationMenu());
    };
    const handleBack = () => {
        setLoadCreateClient(false);
        setLoadEditClient(false);
    };
    const handleLocations = (id) => {
        console.log('id', id);

        navigate(`/admin/location/${id}`);
    };
    function Row({ row }) {
        console.log('rowwwww', row);
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
                    <TableCell align="center">{row.client_name}</TableCell>
                    <TableCell align="center">{row.client_user_name}</TableCell>
                    <TableCell align="center">{row.client_code}</TableCell>
                    <TableCell align="center">{row.msme_no}</TableCell>
                    {/* <TableCell align="center">{row.registration_no}</TableCell>
                    <TableCell align="center">{row.license_no}</TableCell>
                    <TableCell align="center">{getFilteredDate(row.license_issue_date)}</TableCell>
                    <TableCell align="center">{getFilteredDate(row.license_expiry_date)}</TableCell>
                    <TableCell align="center">{row.contact_person_poc}</TableCell>
                    <TableCell align="center">{row.poc_mobile}</TableCell>
                    <TableCell align="center">{row.poc_other_phone}</TableCell>
                    <TableCell align="center">{row.client_official_mail}</TableCell>
                    <TableCell align="center">{row.industry}</TableCell>
                    <TableCell align="center">{row.year_incorporated}</TableCell>
                    <TableCell align="center">{row.business_presence}</TableCell>
                    <TableCell align="center">{row.website}</TableCell> */}
                    <TableCell align="center">{row.resgister_address}</TableCell>
                    <TableCell align="center">{row.city}</TableCell>
                    <TableCell align="center">{row.state}</TableCell>
                    <TableCell align="center">{row.country}</TableCell>
                    <TableCell align="center">{row.pincode}</TableCell>

                    <TableCell align="center" sx={{ pr: 2 }}>
                        <PermissionGuard access="delete_client">
                            <Switch
                                size="small"
                                checked={row.isActive}
                                sx={{
                                    color: theme.palette.error.main,
                                    '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                    '& .Mui-checked+.MuiSwitch-track': {
                                        bgcolor: `${theme.palette.success.main} !important`
                                    }
                                }}
                                title={!row.isActive ? 'disabled' : 'enabled'}
                                onClick={() => handleActive(row.id, row.isActive)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </PermissionGuard>
                        <PermissionGuard access="edit_client">
                            <IconButton color="secondary" size="small" aria-label="edit" onClick={() => handleAction('edit', row)}>
                                <EditTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                            </IconButton>
                            <IconButton
                                color="primary"
                                size="small"
                                aria-label="view"
                                onClick={() => {
                                    handleLocations(row.id);
                                }}
                                sx={{ marginRight: '2px' }}
                            >
                                <LocationOnIcon sx={{ fontSize: '1.1rem' }} />
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
                                            title="Client Deatils"
                                            content={false}
                                        >
                                            <Table size="small" aria-label="vendor-details">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Website</TableCell>
                                                        <TableCell>Business Presence</TableCell>
                                                        <TableCell>Year Incorporated</TableCell>
                                                        <TableCell>Industry</TableCell>
                                                        <TableCell>Email</TableCell>
                                                        <TableCell>No. of Yards</TableCell>
                                                        <TableCell>POC Other Phone</TableCell>
                                                        <TableCell>POC Mobile</TableCell>
                                                        <TableCell>POC</TableCell>
                                                        <TableCell>License Expiry Date</TableCell>
                                                        <TableCell>License Issue Date</TableCell>
                                                        <TableCell>License No</TableCell>
                                                        <TableCell>Registration No</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.website}</TableCell>
                                                        <TableCell>{row.business_presence}</TableCell>
                                                        <TableCell>{row.year_incorporated}</TableCell>
                                                        <TableCell>{row.industry}</TableCell>
                                                        <TableCell>{row.client_official_mail}</TableCell>
                                                        <TableCell>{row.yard_limitation}</TableCell>
                                                        <TableCell>{row.poc_other_phone}</TableCell>
                                                        <TableCell>{row.poc_mobile}</TableCell>
                                                        <TableCell>{row.contact_person_poc}</TableCell>
                                                        <TableCell>{row.license_expiry_date}</TableCell>
                                                        <TableCell>{row.license_issue_date}</TableCell>
                                                        <TableCell>{row.license_no}</TableCell>
                                                        <TableCell>{row.registration_no}</TableCell>
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
    return (
        <MainCard
            title="Our Client"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        {!loadCreateClient && !loadEditClient ? (
                            // <Box display="flex" justifyContent="center">
                            <PermissionGuard access="create_client">
                                <Button variant="contained" onClick={handleLoad} style={{ whiteSpace: 'nowrap' }}>
                                    ADD Client
                                </Button>
                            </PermissionGuard>
                        ) : (
                            // </Box>
                            <Button sm={3} variant="contained" onClick={handleBack}>
                                <ChevronLeftIcon />
                                Back
                            </Button>
                        )}
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
            {!loadCreateClient && !loadEditClient ? (
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
                                placeholder="Search Client"
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
            ) : null}
            {/* table */}
            {loadCreateClient && !loadEditClient ? <CreateClient create={handleCreate} /> : null}
            {loadEditClient && !loadCreateClient ? <EditClient edit={handleEdit} data={actionData} /> : null}
            {!loadCreateClient && !loadEditClient ? (
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
                                .map(
                                    (row, index) => (
                                        <Row row={row} key={index} />
                                    )
                                    /** Make sure no display bugs if row isn't an OrderData object */
                                    // if (typeof row === 'number') return null;
                                    // const isItemSelected = isSelected(row.from);
                                    // const labelId = `enhanced-table-checkbox-${index}`;

                                    // return (
                                    //     <>
                                    //         <TableRow
                                    //             hover
                                    // role="checkbox"
                                    //             aria-checked={isItemSelected}
                                    //             tabIndex={-1}
                                    //             key={index}
                                    //             selected={isItemSelected}
                                    //             style={{
                                    //                 transition: theme.transitions.create(['opacity']),
                                    //                 opacity: row.isActive ? 1 : theme.palette.action.disabledOpacity
                                    //             }}
                                    //         >
                                    //             {/* <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.from)}>
                                    //             <Checkbox
                                    //                 color="primary"
                                    //                 checked={isItemSelected}
                                    //                 inputProps={{
                                    //                     'aria-labelledby': labelId
                                    //                 }}
                                    //             />
                                    //         </TableCell> */}
                                    //             <TableCell sx={{ pl: 3 }}>
                                    //                 <IconButton
                                    //                     aria-label="expand row"
                                    //                     size="small"
                                    //                     onClick={() => setOpenCollapse(!openCollapse)}
                                    //                 >
                                    //                     {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    //                 </IconButton>
                                    //             </TableCell>
                                    //             <TableCell align="center">{row.client_name}</TableCell>
                                    //             <TableCell align="center">{row.client_user_name}</TableCell>
                                    //             <TableCell align="center">{row.client_code}</TableCell>
                                    //             <TableCell align="center">{row.msme_no}</TableCell>
                                    //             <TableCell align="center">{row.registration_no}</TableCell>
                                    //             <TableCell align="center">{row.license_no}</TableCell>
                                    //             <TableCell align="center">{getFilteredDate(row.license_issue_date)}</TableCell>
                                    //             <TableCell align="center">{getFilteredDate(row.license_expiry_date)}</TableCell>
                                    //             <TableCell align="center">{row.contact_person_poc}</TableCell>
                                    //             <TableCell align="center">{row.poc_mobile}</TableCell>
                                    //             <TableCell align="center">{row.poc_other_phone}</TableCell>
                                    //             <TableCell align="center">{row.client_official_mail}</TableCell>
                                    //             <TableCell align="center">{row.industry}</TableCell>
                                    //             <TableCell align="center">{row.year_incorporated}</TableCell>
                                    //             <TableCell align="center">{row.business_presence}</TableCell>
                                    //             <TableCell align="center">{row.website}</TableCell>
                                    //             <TableCell align="center">{row.resgister_address}</TableCell>
                                    //             <TableCell align="center">{row.city}</TableCell>
                                    //             <TableCell align="center">{row.state}</TableCell>
                                    //             <TableCell align="center">{row.country}</TableCell>
                                    //             <TableCell align="center">{row.pincode}</TableCell>

                                    //             <TableCell align="center" sx={{ pr: 3 }}>
                                    //                 <PermissionGuard access="delete_client">
                                    //                     <Switch
                                    //                         checked={row.isActive}
                                    //                         sx={{
                                    //                             color: theme.palette.error.main,
                                    //                             '& .Mui-checked': { color: `${theme.palette.success.dark} !important` },
                                    //                             '& .Mui-checked+.MuiSwitch-track': {
                                    //                                 bgcolor: `${theme.palette.success.main} !important`
                                    //                             }
                                    //                         }}
                                    //                         title={!row.isActive ? 'disabled' : 'enabled'}
                                    //                         onClick={() => handleActive(row.id, row.isActive)}
                                    //                         inputProps={{ 'aria-label': 'controlled' }}
                                    //                     />
                                    //                 </PermissionGuard>
                                    //                 <PermissionGuard access="edit_client">
                                    //                     <IconButton
                                    //                         color="secondary"
                                    //                         size="large"
                                    //                         aria-label="edit"
                                    //                         onClick={() => handleAction('edit', row)}
                                    //                     >
                                    //                         <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    //                     </IconButton>
                                    //                     <IconButton
                                    //                         color="primary"
                                    //                         size="large"
                                    //                         aria-label="view"
                                    //                         onClick={() => {
                                    //                             handleLocations(row.id);
                                    //                         }}
                                    //                         sx={{ marginRight: '4px' }}
                                    //                     >
                                    //                         <LocationOnIcon sx={{ fontSize: '1.3rem' }} />
                                    //                     </IconButton>
                                    //                 </PermissionGuard>
                                    //             </TableCell>
                                    //         </TableRow>
                                    //         <TableRow key={row.id}>
                                    //             <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    //                 <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                                    //                     {openCollapse && (
                                    //                         <Box sx={{ margin: 1 }}>
                                    //                             <TableContainer>
                                    //                                 <SubCard
                                    //                                     sx={{
                                    //                                         bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50',
                                    //                                         mb: 2
                                    //                                     }}
                                    //                                     title="Vendor Deatils"
                                    //                                     content={false}
                                    //                                 >
                                    //                                     <Table size="small" aria-label="vendor-details">
                                    //                                         <TableHead>
                                    //                                             <TableRow>
                                    //                                                 <TableCell>Vendor ID</TableCell>
                                    //                                                 <TableCell>Bank Name</TableCell>
                                    //                                                 <TableCell>Account Holder</TableCell>
                                    //                                                 <TableCell>
                                    //                                                     {/* {row.country === 101 ? 'IFSC' : 'Swift Code'} */}
                                    //                                                 </TableCell>
                                    //                                                 <TableCell>Account Number</TableCell>
                                    //                                             </TableRow>
                                    //                                         </TableHead>
                                    //                                         {/* <TableBody>
                                    //                                             <TableRow hover key={row.account_number}>
                                    //                                                 <TableCell>{row.id}</TableCell>
                                    //                                                 <TableCell component="th" scope="row">
                                    //                                                     {row.bank_name}
                                    //                                                 </TableCell>
                                    //                                                 <TableCell>{row.account_holder}</TableCell>
                                    //                                                 <TableCell>
                                    //                                                     {row.country === 101
                                    //                                                         ? row.ifsc_code
                                    //                                                         : row.swift_code}
                                    //                                                 </TableCell>
                                    //                                                 <TableCell>{row.account_number}</TableCell>
                                    //                                             </TableRow>
                                    //                                         </TableBody> */}
                                    //                                     </Table>
                                    //                                 </SubCard>
                                    //                             </TableContainer>
                                    //                         </Box>
                                    //                     )}
                                    //                 </Collapse>
                                    //             </TableCell>
                                    //         </TableRow>
                                    //     </>
                                    // );
                                )}
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
            ) : null}
        </MainCard>
    );
};
export default Client;
