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
import { getProducts } from 'store/slices/product';
import { openSnackbar } from 'store/slices/snackbar';
import axios from 'utils/axios';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

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
        id: 'product_name',
        numeric: true,
        label: 'Product Name',
        align: 'left'
    },
    {
        id: 'product_desc',
        numeric: true,
        label: 'Product Description',
        align: 'left'
    },
    {
        id: 'product_type',
        numeric: true,
        label: 'Product Category',
        align: 'left'
    },
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

const ProductMaster = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('');
    const [getAll, setGetAll] = React.useState(true);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const { products } = useSelector((state) => state.product);
    const [disable, setDisable] = React.useState([]);
    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?all=${getAll}`;
        return str;
    };

    React.useEffect(() => {
        dispatch(getProducts(makeQuery()));
    }, [dispatch]);
    React.useEffect(() => {
        setRows(products);
    }, [products]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        console.log(newString);
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;
                const properties = ['product_name', 'product_type', 'product_desc', 'product_dimensions'];
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
            setRows(products);
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
        const response = await axios.put(`/product/${id}`, { isActive: !isActive });
        console.log('res', response);
        if (response.data.data.updated) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Product ${isActive ? 'disabled' : 'enabled'} successfully !`,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
            dispatch(getProducts(makeQuery()));
        }
    };
    const formclick = () => {
        navigate('/addproduct');
    };
    const handleAction = (id) => {
        navigate(`/editproduct/${id}`);
    };
    return (
        <MainCard
            title="Product List"
            content={false}
            secondary={
                <Grid item sm={3} justifycontent="space-between">
                    <PermissionGuard access="create_product">
                        <Button sm={3} variant="contained" onClick={formclick}>
                            ADD Products
                        </Button>
                    </PermissionGuard>
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
                            placeholder="Search Products"
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
                                        <TableCell>{row.product_name}</TableCell>
                                        <TableCell align="left">{row.product_desc}</TableCell>
                                        <TableCell align="left">{row.category[0].category}</TableCell>
                                        <TableCell align="left" sx={{ pr: 3 }}>
                                            <TableCell align="left" sx={{ pr: 3 }}>
                                                <PermissionGuard access="delete_product">
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
                                                </PermissionGuard>
                                                <PermissionGuard access="edit_product">
                                                    <IconButton
                                                        color="secondary"
                                                        size="large"
                                                        aria-label="edit"
                                                        data-id={row.id}
                                                        onClick={() => handleAction(row.id)}
                                                        // data-value={row.hub_loc.coordinates}
                                                    >
                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </PermissionGuard>
                                            </TableCell>
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

export default ProductMaster;
