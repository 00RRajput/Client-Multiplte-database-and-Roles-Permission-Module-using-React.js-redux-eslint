import { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';
// import { Document, Page, pdfjs } from 'react-pdf';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Stack,
    MenuItem,
    Select,
    Chip,
    Radio,
    RadioGroup,
    Autocomplete,
    Divider
    // CheckIcon
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import * as libphonenumber from 'google-libphonenumber';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from '../../../../utils/axios';
import { height } from '@mui/system';
// import { height } from '@mui/system';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const SeaRegister = () => {
    const a = 10;
    return (
        <Grid>
            <Typography variant="subtitle1" fontSize="2rem">
                Sea Routes:
            </Typography>
        </Grid>
    );
};

export default SeaRegister;
