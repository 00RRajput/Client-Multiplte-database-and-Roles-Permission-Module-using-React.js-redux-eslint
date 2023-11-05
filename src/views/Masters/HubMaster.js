import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
// material-ui
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Select,
    MenuItem,
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
// import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getHub } from 'store/slices/hub';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListIcon from '@mui/icons-material/FilterList';

// import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import CreateHub from '../forms/hub/CreateHub';
import HubEditForm from '../forms/hub/HubEditform';

import axios from '../../utils/axios';
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
        id: 'current',
        numeric: true,
        label: 'Hubname',
        align: 'left'
    },
    {
        id: 'dest',
        numeric: true,
        label: 'HubLocation Latitude',
        align: 'left'
    },
    {
        id: 'dest1',
        numeric: true,
        label: 'HubLocation Longitude',
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
                {numSelected <= 0 && <TableCell align="left">Action</TableCell>}
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

const HubMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [edit, setEdit] = React.useState(false);
    const [currentId, setCurrentId] = React.useState('');
    const [get, setGet] = useState('all');
    const [mapcor, setmapcor] = React.useState([]);
    const { hub } = useSelector((state) => state.hub);
    const [component, setComponent] = React.useState(false);
    const [hubname, sethubName] = React.useState('');
    const [data, setData] = React.useState({});
    const [selectedActiveValue, setSelectedActiveValue] = useState('');
    const [filter, setFilter] = useState(false);
    const [hubFilter, setHubFilter] = useState('');
    let str = '?';
    function getQueryString() {
        if (get) str += `get=${get}&`;
        if (orderBy) str += `order_by=${orderBy}&`;
        if (order) str += `sort=${order}&`;
        if (rowsPerPage) str += `offset=${rowsPerPage}&`;
        if (page) str += `page=${page}&`;
        if (hubFilter) str += `hubName=${hubFilter}&`;
        return str;
    }

    React.useEffect(() => {
        getQueryString();
    }, [hubFilter, get]);

    React.useEffect(() => {
        dispatch(getHub(str));
    }, [dispatch, hubFilter, get]);

    React.useEffect(() => {
        setRows(hub);
    }, [hub]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                console.log(row);
                let matches = true;

                const properties = ['hubName', 'hub_loc'];
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
            setRows(hub);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const formclick = () => {
        setComponent(true);
        console.log('component', component);
    };
    const handlefunc = (component) => {
        setComponent(component);
        setEdit(component);
        dispatch(getHub());
    };
    const handleEdit = (data) => {
        setData(data);

        setEdit(true);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const [isActive, setIsActive] = useState(false);
    const handleActive = async (id, isActive) => {
        console.log(id, isActive);
        await axios.put(`/hubs/${id}`, { isActive: !isActive }).then((response) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Hub ${isActive ? 'disabled' : 'enabled'} successfully !`,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
            dispatch(getHub(''));
        });
    };
    const handleBack = () => {
        setEdit(false);
        setComponent(false);
        dispatch(getHub(''));
    };
    const themes = createTheme({
        palette: {
            primary: {
                main: '#2196f3' // Set your primary color
            }
        }
    });
    const handleDisable = (event) => {
        setSelectedActiveValue(event.target.value);
        axios.post('/');
    };
    const handleFilter = async () => {
        setFilter(!filter);
    };
    const handleInput = (event) => {
        setHubFilter(event.target.value);
        if (event.target.value >= 4) {
            axios.post('/', event.target.value);
        }
    };
    // console.log('mapcor->', mapcor);
    return (
        <MainCard
            title="Hub"
            content={false}
            secondary={
                <Grid item>
                    {!edit && !component ? (
                        <Button variant="contained" onClick={formclick}>
                            ADD HUB
                        </Button>
                    ) : (
                        <Button sm={3} variant="contained" onClick={handleBack}>
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    )}
                </Grid>
            }
        >
            {!edit && !component ? (
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
                                placeholder="Search Hub"
                                value={search}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                            <Tooltip title="Filter">
                                <IconButton size="large">
                                    <FilterListIcon onClick={handleFilter} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            ) : null}
            {component ? <CreateHub disabling={handlefunc} /> : null}
            {!component && edit ? <HubEditForm data={data} disabling={handlefunc} /> : null}
            {!component && !edit ? (
                <TableContainer sx={{ maxHeight: 440 }}>
                    {filter ? (
                        <ThemeProvider theme={themes}>
                            <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
                                {/* <FormControl component="fieldset"> */}
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item xs={12} sm={5.9}>
                                        <TextField
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {!hubFilter ? (
                                                            <FilterAltOffIcon fontSize="small" />
                                                        ) : (
                                                            <FilterAltIcon fontSize="small" />
                                                        )}
                                                    </InputAdornment>
                                                )
                                            }}
                                            label="HubName"
                                            name="hub"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={hubFilter}
                                            onInput={(event) => setHubFilter(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5.9}>
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel>Active</InputLabel>
                                            <Select
                                                value={selectedActiveValue}
                                                onChange={handleDisable}
                                                label="Active"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start" />
                                                }}
                                            >
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
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
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
                                                opacity: row.isActive ? 1 : theme.palette.action.disabledOpacity
                                            }}
                                        >
                                            {/* <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.id)}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell> */}
                                            <TableCell align="left" id={row.id}>
                                                {row.hubName}
                                            </TableCell>
                                            <TableCell align="left">{row.hub_loc.coordinates[0]}</TableCell>
                                            <TableCell align="left">{row.hub_loc.coordinates[1]}</TableCell>

                                            <TableCell align="left" sx={{ pr: 3 }}>
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
                                                    onClick={() => handleActive(row.id, row.isActive)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="edit"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
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
            ) : null}
        </MainCard>
    );
};

export default HubMaster;
