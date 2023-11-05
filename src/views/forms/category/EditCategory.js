// material-ui
import { useState, React } from 'react';
import { gridSpacing } from 'store/constant';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Switch,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    FormHelperText,
    TextField
} from '@mui/material';
// // third-party
import * as yup from 'yup';
// project imports
import Loadable from 'ui-component/Loadable';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getCategory } from 'store/slices/category';
import axios from 'utils/axios';
import { useFormik } from 'formik';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { openSnackbar } from 'store/slices/snackbar';
// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function EditCategory({ data, onEmit }) {
    console.log('data', data);
    const theme = useTheme();

    const dispatch = useDispatch();
    const [editOpen, setEditOpen] = useState(true);
    // const [open, setOpen] = useState(false);
    const [getAll, setGetAll] = useState(true);
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleEditClose = () => {
        setEditOpen(false);
        onEmit(false);
    };
    const validationSchema = yup.object({
        category: yup.string().min(3).max(30).required('Field is Required')
    });
    const makeQuery = () => {
        let str = '';
        if (getAll) str += `?client=${data?.client}&all=${getAll}`;
        return str;
    };
    const formik = useFormik({
        initialValues: {
            category: data.category
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    // setOpen(true);
                    await axios.put(`/category/${data.id}`, formik.values);
                    resetForm();
                    dispatch(getCategory(makeQuery()));
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Category Updated successfully !',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            transition: 'SlideLeft',
                            close: true
                        })
                    );
                    onEmit(false);
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
    return (
        <div>
            <Dialog open={editOpen} onClose={handleEditClose} aria-labelledby="form-dialog-title">
                <>
                    <form onSubmit={formik.handleSubmit}>
                        <DialogTitle id="form-dialog-title">Category</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1} style={{ width: '460px' }}>
                                        <TextField
                                            fullWidth
                                            id="category"
                                            name="category"
                                            value={formik.values.category}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            placeholder="Enter Category Name..."
                                        />
                                    </Stack>
                                    {formik.errors.category && <FormHelperText error>{formik.errors.category}</FormHelperText>}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button sx={{ color: theme.palette.error.dark }} onClick={handleEditClose} color="secondary">
                                Cancel
                            </Button>
                            <Button variant="contained" size="small" type="submit">
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </>
            </Dialog>
        </div>
    );
}
