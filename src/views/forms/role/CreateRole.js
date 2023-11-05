import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    FormHelperText,
    Typography
} from '@mui/material';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialog() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            role: '',
            status: ''
        }
        // validationSchema,
        // onSubmit: async (values, { resetForm }) => {
        //     if (values) {
        //         try {
        //             setOpen(true);
        //             await axios.post('/auth/register', formik.values);
        //             resetForm();
        //             create();
        //             dispatch(
        //                 openSnackbar({
        //                     open: true,
        //                     message: 'User Created successfully !',
        //                     variant: 'alert',
        //                     alert: {
        //                         color: 'success'
        //                     },
        //                     transition: 'SlideLeft',
        //                     close: true
        //                 })
        //             );
        //         } catch (error) {
        //             console.log('error', error);
        //             dispatch(
        //                 openSnackbar({
        //                     open: true,
        //                     message: error.response.data.message,
        //                     variant: 'alert',
        //                     alert: {
        //                         color: 'error'
        //                     },
        //                     transition: 'SlideLeft',
        //                     close: true
        //                 })
        //             );
        //         }
        //     }
        // }
    });

    return (
        <div>
            {/* <Button variant="contained" onClick={handleLoad} style={{ whiteSpace: 'nowrap' }}> */}
            <Button variant="contained" onClick={handleClickOpen} style={{ whiteSpace: 'nowrap' }}>
                ADD ROLE
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <DialogTitle id="form-dialog-title">Role</DialogTitle>
                        <DialogContent>
                            <InputLabel required>Role Name</InputLabel>
                            <TextField
                                fullWidth
                                id="role"
                                name="role_name"
                                type="text"
                                value={formik.values.role}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Enter Role Name..."
                                autoComplete="new-email"
                            />
                            {formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button variant="contained" size="small" onClick={handleClose}>
                                Subscribe
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
