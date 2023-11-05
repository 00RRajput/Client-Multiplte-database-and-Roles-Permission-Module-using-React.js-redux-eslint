import PropTypes from 'prop-types';
import * as React from 'react';
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
    Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getLocation } from 'store/slices/location';
import { openSnackbar } from 'store/slices/snackbar';
import axios from 'utils/axios';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useNavigate, useParams } from 'react-router-dom';
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
        id: 'location_name',
        numeric: true,
        label: 'Location Name',
        align: 'left'
    },
    {
        id: 'address',
        numeric: true,
        label: 'Address',
        align: 'left'
    },
    {
        id: 'country',
        numeric: true,
        label: 'Country',
        align: 'left'
    },
    {
        id: 'state',
        numeric: true,
        label: 'State',
        align: 'left'
    },
    {
        id: 'city',
        numeric: true,
        label: 'City',
        align: 'left'
    },
    {
        id: 'pin',
        numeric: true,
        label: 'PIN/ZIP Code',
        align: 'left'
    },
    {
        id: 'phone',
        numeric: true,
        label: 'Location Phone No.',
        align: 'left'
    },
    {
        id: 'email',
        numeric: true,
        label: 'Location Email Address',
        align: 'left'
    },
    // {
    //     id: 'client',
    //     numeric: true,
    //     label: 'Client Name',
    //     align: 'left'
    // },
    {
        id: 'action',
        numeric: true,
        label: 'Action',
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
                {/* {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
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

const LocationMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('');
    const [getAll, setGetAll] = React.useState(true);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const { locations } = useSelector((state) => state.location);
    const [disable, setDisable] = React.useState([]);
    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    React.useEffect(() => {
        dispatch(getLocation(params.id));
    }, [dispatch]);
    React.useEffect(() => {
        setRows(locations);
    }, [locations]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        console.log(newString);
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;
                const properties = ['location_name', 'client_name', 'country_name', 'city_name'];
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
            setRows(locations);
        }
    };

    const handleRequestSort = (event, property) => {
        console.log(property);
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            console.log(newSelected);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, name) => {
        // console.log(name);
        // setDisable(name)
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
        console.log('new', newSelected);
        // selectedVal = [...newSelected];
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

    const [isActive, setIsActive] = React.useState(false);

    const handleActive = async (id, isActive) => {
        console.log(id, isActive);
        const response = await axios.put(`/location/${id}`, { isActive: !isActive });
        console.log('res', response);
        if (response.data.data.updated) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Location ${isActive ? 'disabled' : 'enabled'} successfully !`,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
            dispatch(getLocation());
        }
    };
    const formclick = () => {
        navigate(`/addlocation/${params.id}`);
    };
    const handleAction = (id) => {
        navigate(`/editlocation/${id}`);
    };
    return (
        <MainCard
            title="Location List"
            content={false}
            secondary={
                <Grid item>
                    <Button variant="contained" onClick={formclick}>
                        ADD LOCATIONS
                    </Button>
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
                            placeholder="Search Locations"
                            value={search}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </CardContent>

            {/* table */}
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
                                        // disabled={isActive[row.id]}
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

                                        <TableCell align="left">{row.location_name}</TableCell>
                                        <TableCell align="left">{row.address}</TableCell>
                                        <TableCell align="left">{row.country_name}</TableCell>
                                        <TableCell align="left">{row.state_name}</TableCell>
                                        <TableCell align="left">{row.city_name}</TableCell>
                                        <TableCell align="left">{row.pin}</TableCell>
                                        <TableCell align="left">{row.phone}</TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        {/* <TableCell align="left">{row.client_name}</TableCell> */}

                                        <TableCell align="left" sx={{ pr: 10, ml: 10 }}>
                                            <Tooltip title={row.isActive ? 'Disable' : 'Enable'} arrow>
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
                                            </Tooltip>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton
                                                    color="secondary"
                                                    size="large"
                                                    aria-label="edit"
                                                    onClick={() => handleAction(row.id)}
                                                >
                                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
                                            </Tooltip>
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
            </TableContainer>

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};

export default LocationMaster;
