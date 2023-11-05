import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// material-ui
import {
    Button,
    Grid,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Chip,
    Divider,
    Link,
    TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import '@mui/lab';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';
import SubCard from 'ui-component/cards/SubCard';
import Avatar3 from 'assets/images/users/avatar-3.png';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Avatar from 'ui-component/extended/Avatar';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';

import axios from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';

// ==============================|| Transporter Profile ||============================== //

function ApproveTransporterFinance({ data }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const params = useParams();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [transporter, setTransporter] = useState({});
    const [disableAccept, setDisableAccept] = useState(false);

    const { vendors } = useSelector((state) => state.vendor);

    const handleStatusChange = async (status) => {
        try {
            setOpen(true);
            const response = await axios.patch(`/vendors/approve/${params?.id}`, { status: status === 'accept', reason });
            console.log(' rd ', response.data);
            const message = response.data.message || 'transporter updated successfully !';
            dispatch(
                openSnackbar({
                    open: true,
                    message,
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
                    message: error.message,
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
        }
    };
    const setSelectedTransporter = async () => {
        try {
            const transporter = await axios.get(`vendors/${params.id}`);
            if (transporter.data.data.length) setTransporter({ ...transporter.data.data[0] });
        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: error?.message || 'unable to find the transporter !',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    transition: 'SlideLeft',
                    close: true
                })
            );
        }
    };
    const setAccept = () => {
        switch (user?.role?.role) {
            case 'ADMIN':
                setDisableAccept(transporter.legal_validation && transporter.finance_validation);
                break;
            case 'DEVELOPER':
                setDisableAccept(transporter.legal_validation && transporter.finance_validation);
                break;
            case 'FINANCE':
                setDisableAccept(transporter.finance_validation);
                break;
            default:
                setDisableAccept(transporter.legal_validation);
                break;
        }
    };

    const handleInput = (e) => {
        setReason(e.target.value);
    };

    const openDoc = (click) => {
        let link = '';
        switch (click) {
            case 'aadhar':
                link = transporter?.aadhar;
                break;
            case 'pan':
                link = transporter?.pan;
                break;
            case 'license':
                link = transporter?.license;
                break;
            default:
                link = transporter?.check;
                break;
        }
        window.open(link, '_blank', 'noopener noreferrer');
    };

    useEffect(() => {
        setSelectedTransporter();
        setAccept();
    }, [vendors]);

    // useEffect(() => {
    //     dispatch(getVehicles());
    // }, [vehicles]);

    // useEffect(() => {
    //     dispatch(getLanes());
    // }, [lanes]);

    return (
        <>
            <MainCard title="Transporters">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12} sm={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item lg={4} xs={12}>
                                <SubCard
                                    title={
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Avatar alt="User 1" src={Avatar3} />
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <Typography align="left" variant="subtitle1">
                                                    {transporter.first_name} {transporter.last_name}
                                                </Typography>
                                                <Typography align="left" variant="subtitle2">
                                                    Transporter
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Chip size="small" label="Pro" color="primary" />
                                            </Grid>
                                        </Grid>
                                    }
                                >
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Typography variant="subtitle2" align="right">
                                                    {transporter?.email || ''}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Typography variant="subtitle2" align="right">
                                                    {transporter?.phone || ''}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="subtitle1">Location</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Typography variant="subtitle2" align="right">
                                                    {transporter?.address || ''}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                    </List>
                                    {/* <CardContent>
                                        <Grid container spacing={0}>
                                            <Grid item xs={4}>
                                                <Typography align="center" variant="h3">
                                                    37
                                                </Typography>
                                                <Typography align="center" variant="subtitle2">
                                                    Mails
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography align="center" variant="h3">
                                                    2749
                                                </Typography>
                                                <Typography align="center" variant="subtitle2">
                                                    Followers
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography align="center" variant="h3">
                                                    678
                                                </Typography>
                                                <Typography align="center" variant="subtitle2">
                                                    Following
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent> */}
                                </SubCard>
                            </Grid>
                            <Grid item lg={8} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <SubCard title="About Transporter">
                                            <Grid container spacing={2}>
                                                <Divider sx={{ pt: 1 }} />
                                            </Grid>
                                            <List component="nav" aria-label="main mailbox folders">
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="subtitle1">Vehicles</Typography>} />
                                                    <ListItemSecondaryAction>
                                                        <Typography variant="subtitle2" align="right">
                                                            demo@sample.com
                                                        </Typography>
                                                    </ListItemSecondaryAction>
                                                </ListItemButton>
                                                <Divider />
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                                                    <ListItemSecondaryAction>
                                                        <Typography variant="subtitle2" align="right">
                                                            (+99) 9999 999 999
                                                        </Typography>
                                                    </ListItemSecondaryAction>
                                                </ListItemButton>
                                                <Divider />
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="subtitle1">Location</Typography>} />
                                                    <ListItemSecondaryAction>
                                                        <Typography variant="subtitle2" align="right">
                                                            Melbourne
                                                        </Typography>
                                                    </ListItemSecondaryAction>
                                                </ListItemButton>
                                            </List>
                                        </SubCard>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Documents (click on the buttons to view)</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="secondary">
                                            <Link
                                                href={transporter?.aadhar}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => openDoc('aadhar')}
                                                underline="none"
                                            >
                                                <Typography variant="contained" component="span" color="primary.dark">
                                                    aadhar
                                                </Typography>
                                            </Link>
                                        </Button>
                                        <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }}>
                                            <Link
                                                href={transporter?.aadhar}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                underline="none"
                                                onClick={() => openDoc('pan')}
                                            >
                                                <Typography variant="contained" component="span" color="primary.dark">
                                                    pan
                                                </Typography>
                                            </Link>
                                        </Button>
                                        <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }}>
                                            <Link
                                                href={transporter?.aadhar}
                                                target="_blank"
                                                underline="none"
                                                rel="noopener noreferrer"
                                                onClick={() => openDoc('license')}
                                            >
                                                <Typography variant="contained" component="span" color="primary.dark">
                                                    license
                                                </Typography>
                                            </Link>
                                        </Button>
                                        <Button variant="contained" color="secondary" sx={{ marginLeft: 3 }}>
                                            <Link
                                                href={transporter?.aadhar}
                                                target="_blank"
                                                underline="none"
                                                rel="noopener noreferrer"
                                                onClick={() => openDoc('check')}
                                            >
                                                <Typography variant="contained" component="span" color="primary.dark">
                                                    cheque
                                                </Typography>
                                            </Link>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-textarea"
                                            label="Reason"
                                            placeholder="please write status change reason..."
                                            defaultValue={reason}
                                            value={reason}
                                            sx={{
                                                width: '100%'
                                            }}
                                            onInput={handleInput}
                                            multiline
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                        <AnimateButton
                            scale={{
                                hover: 1.1,
                                tap: 0.9
                            }}
                        >
                            <Button
                                variant="contained"
                                color="error"
                                sx={{
                                    boxShadow: theme.customShadows.error,
                                    ':hover': {
                                        boxShadow: 'none'
                                    },
                                    marginLeft: 4
                                }}
                                onClick={() => handleStatusChange('reject')}
                            >
                                Reject
                            </Button>
                        </AnimateButton>
                        <AnimateButton
                            scale={{
                                hover: 1.1,
                                tap: 0.9
                            }}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                    boxShadow: theme.customShadows.secondary,
                                    ':hover': {
                                        boxShadow: 'none'
                                    },
                                    marginLeft: 4
                                }}
                                onClick={() => handleStatusChange('accept')}
                                disabled={disableAccept}
                            >
                                Accept
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
}

export default ApproveTransporterFinance;
