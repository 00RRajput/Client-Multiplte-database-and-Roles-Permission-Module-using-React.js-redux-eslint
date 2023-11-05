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
    Button
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getLanes } from 'store/slices/lane';
import axios from 'utils/axios';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { openSnackbar } from 'store/slices/snackbar';

const CreateLane = Loadable(lazy(() => import('views/forms/lane/CreateLane')));
const EditLane = Loadable(lazy(() => import('views/forms/lane/EditLane')));
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
        label: 'from',
        align: 'left'
    },
    {
        id: 'dest',
        numeric: true,
        label: 'to',
        align: 'left'
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

const LaneMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    // const { user } = useAuth();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [getAll, setGetAll] = useState(true);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const { lanes } = useSelector((state) => state.lane);
    const [loadCreateLane, setLoadCreateLane] = useState(false);
    const [loadEditLane, setLoadEditLane] = useState(false);
    const [actionData, setActionData] = useState({});
    const [key, setKey] = useState(0);

    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    useEffect(() => {
        dispatch(getLanes(makeQuery()));
    }, [dispatch]);
    useEffect(() => {
        setRows(lanes);
    }, [lanes]);
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
            setRows(lanes);
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
        setLoadCreateLane(true);
        setLoadEditLane(false);
        dispatch(getLanes(makeQuery()));
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
        dispatch(getLanes(makeQuery()));
    };

    const handleEdit = () => {
        setLoadEditLane(!loadEditLane);
        dispatch(getLanes(makeQuery()));
    };

    const handleAction = (action, data) => {
        switch (action) {
            case 'edit':
                setLoadEditLane(true);
                setLoadCreateLane(false);
                setActionData(data);
                break;
            default:
                setLoadEditLane(false);
                setLoadCreateLane(false);
                break;
        }
    };

    const handleActive = async (id, isActive) => {
        await axios.put(`/routes/${id}`, { isActive: !isActive });
        dispatch(
            openSnackbar({
                open: true,
                message: `Lane ${isActive ? 'disabled' : 'enabled'} successfully !`,
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                transition: 'SlideLeft',
                close: true
            })
        );
        dispatch(getLanes(makeQuery()));
    };
    const handleBack = () => {
        setLoadCreateLane(false);
        setLoadEditLane(false);
    };
    return (
        <MainCard
            title="Lanes"
            content={false}
            secondary={
                <Grid container spacing={2} justify="space-between">
                    <Grid item>
                        {!loadCreateLane && !loadEditLane ? (
                            // <Box display="flex" justifyContent="center">
                            <Button variant="contained" onClick={handleLoad} style={{ whiteSpace: 'nowrap' }}>
                                ADD LANE
                            </Button>
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
            {!loadCreateLane && !loadEditLane ? (
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
                                placeholder="Search Lane"
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
            {loadCreateLane && !loadEditLane ? <CreateLane create={handleCreate} /> : null}
            {loadEditLane && !loadCreateLane ? <EditLane edit={handleEdit} data={actionData} /> : null}
            {!loadCreateLane && !loadEditLane ? (
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
                                            <TableCell align="left">{row.from}</TableCell>
                                            <TableCell align="left">{row.to}</TableCell>

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
                                                    onClick={() => handleAction('edit', row)}
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
export default LaneMaster;
