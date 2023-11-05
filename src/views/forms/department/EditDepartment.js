// material-ui
import { useState, React } from 'react';
import { gridSpacing } from 'store/constant';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, FormHelperText, TextField } from '@mui/material';

// // third-party
import * as yup from 'yup';

// project imports
import { useDispatch, useSelector } from 'store';
import axios from 'utils/axios';
import { useFormik } from 'formik';

// assets
import { openSnackbar } from 'store/slices/snackbar';
import { getDepartment } from 'store/slices/department';
// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function EditRole({ data, onEmit }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [editOpen, setEditOpen] = useState(true);
    const [getAll, setGetAll] = useState(true);

    const handleEditClose = () => {
        setEditOpen(false);
        onEmit(false);
    };

    const validationSchema = yup.object({
        department: yup.string().min(3).max(30).required('Field is Required')
    });

    const makeQuery = () => {
        const str = '';
        // if (getAll) str += `?client=${data?.client}&all=${getAll}`;
        return str;
    };

    const formik = useFormik({
        initialValues: {
            department: data?.department || ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (values) {
                try {
                    await axios.put(`/departments/${data.id}`, formik.values);
                    resetForm();
                    dispatch(getDepartment(makeQuery()));
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Department Updated successfully !',
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
                        <DialogTitle id="form-dialog-title">Department</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1} style={{ width: '460px' }}>
                                        <TextField
                                            fullWidth
                                            id="department"
                                            name="department"
                                            value={formik.values.department}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            placeholder="Enter Department Name..."
                                        />
                                    </Stack>
                                    {formik.errors.department && <FormHelperText error>{formik.errors.department}</FormHelperText>}
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
