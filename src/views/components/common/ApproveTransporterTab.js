import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Divider,
    Button,
    Grid,
    Modal,
    IconButton,
    CardContent,
    CardActions,
    TextField,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog
} from '@mui/material';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RoundaboutRightOutlinedIcon from '@mui/icons-material/RoundaboutRightOutlined';
import CloseIcon from '@mui/icons-material/Close';

import AnimateButton from 'ui-component/extended/AnimateButton';
import Chip from 'ui-component/extended/Chip';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import VendorLogTimeline from './VendorLogTimeline';
import { orgType, annualTurnOver } from 'utils/static-data';

// tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// ================================|| Approve Transporter UI TABS - SAMPLE ||================================ //

export default function ApproveTransporterTab() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeDoc, setActiveDoc] = useState('');
    const [activeDocName, setActiveDocName] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [transporter, setTransporter] = useState({});
    const [disableAccept, setDisableAccept] = useState(false);
    const [reason, setReason] = useState('');
    const [country, setCountry] = useState('');
    const [dialog, setDialog] = useState(false);

    const { vendors } = useSelector((state) => state.vendor);

    async function getCountry(id) {
        try {
            const response = await axios.get(`/location/country?country_id=${id}`);
            console.log('response ', response);
            setCountry(response.data.data.country[0].name);
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
    }
    const handleStatusChange = async (status) => {
        try {
            if (status === 'reject') setOpen(true);
            setDisableAccept(true);
            const response = await axios.patch(`/vendors/approve/${params?.id}`, { status: status === 'accept', reason });
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
            navigate(-1);
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
        } finally {
            setOpen(false);
        }
    };
    const setSelectedTransporter = async () => {
        try {
            const transporter = await axios.get(`vendors/${params.id}`);
            if (transporter.data.data.length) setTransporter({ ...transporter.data.data[0] });
            getCountry(transporter.data.data[0].country);

            if (transporter.data.data[0].pan) {
                setActiveDoc(transporter.data.data[0].pan);
                setActiveDocName('PAN Card');
            } else if (transporter.data.data[0].msme_certificate) {
                setActiveDoc(transporter?.msme_certificate);
                setActiveDocName('MSME Certificate');
            } else if (transporter.data.data[0].cancelled_cheque) {
                setActiveDoc(transporter.data.data[0].cancelled_cheque);
                setActiveDocName('Cancelled Cheque');
            } else if (transporter.data.data[0].gst_certificate) {
                setActiveDoc(transporter.data.data[0].gst_certificate);
                setActiveDocName('GST Certificate');
            } else if (transporter.data.data[0].incorporation_certificate) {
                setActiveDoc(transporter?.incorporation_certificate);
                setActiveDocName('Incorporation Certificate');
            }
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
        switch (click) {
            case 'msme_certificate':
                setActiveDoc(transporter?.msme_certificate);
                setActiveDocName('MSME Certificate');
                break;
            case 'pan':
                setActiveDoc(transporter?.pan);
                setActiveDocName('PAN Card');
                break;
            case 'cancelled_cheque':
                setActiveDoc(transporter?.cancelled_cheque);
                setActiveDocName('Cancelled Cheque');
                break;
            case 'gst_certificate':
                setActiveDoc(transporter?.gst_certificate);
                setActiveDocName('GST Certificate');
                break;
            default:
                setActiveDoc(transporter?.incorporation_certificate);
                setActiveDocName('Incorporation Certificate');
                break;
        }
    };

    useEffect(() => {
        setSelectedTransporter();
        setAccept();
    }, [vendors]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClose = () => {
        setDialog(false);
    };

    return (
        <>
            <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                sx={{
                    mb: 3,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.2,
                        color: theme.palette.grey[600],
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& a.Mui-selected': {
                        color: theme.palette.primary.main
                    },
                    '& a > svg': {
                        mb: '0px !important',
                        mr: 1.1
                    }
                }}
            >
                <Tab
                    component={Link}
                    to="#"
                    icon={<PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
                    label="Vendor Details"
                    {...a11yProps(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
                    label="Documents"
                    {...a11yProps(1)}
                />
                <Tab component={Link} to="#" icon={<ReceiptLongIcon sx={{ fontSize: '1.3rem' }} />} label="Logs" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Vendor Entity Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.entity_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Organization Type</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.org_type === 5 ? transporter?.other_org_type : orgType[transporter?.org_type] || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Annual Aggregate Turnover</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {annualTurnOver[transporter?.aggregate_annual_turnover] || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Primary Contact Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.primary_contact_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Primary Contact Email</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.primary_email || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Primary Contact Phone</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.primary_phone || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Secondary Contact Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.secondary_contact_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Secondary Contact Email</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.secondary_email || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Secondary Contact Phone</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.secondary_phone || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Billing Address</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.billing_address || ''}{' '}
                                {transporter?.billing_pin_code ? `, ${transporter?.billing_pin_code}` : ''}
                                {country ? `, ${country}` : ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Correspondence Address</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.correspondence_address || ''}{' '}
                                {transporter?.correspondence_pin_code ? `, ${transporter?.correspondence_pin_code}` : ''}
                                {country ? `, ${country}` : ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Account Holder Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.account_holder || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Bank Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.bank_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Branch Name</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.branch_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">IFSC Code</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.ifsc_code || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Account Type</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.account_type || ''} {transporter?.account_type && 'account'}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Account No.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.account_number || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Bank Branch Address</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.branch_address || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Name on Pan</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.pan_name || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Pan No.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.pan_card_no || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">GST No.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.gst_no || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">MSME No.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.msme_no || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">CIN No.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.cin_no || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <TagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Swift Code.</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                {transporter?.swift_code || ''}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <RoundaboutRightOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Route</Typography>} />
                        <ListItemSecondaryAction>
                            {transporter.lane &&
                                transporter.lane.length &&
                                transporter?.lane.map((lane) => (
                                    <Chip key={lane.id} label={`${lane.from}-${lane.to}`} sx={{ ml: 1 }} chipcolor="success" />
                                ))}
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <LocalShippingOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Vehicle</Typography>} />
                        <ListItemSecondaryAction>
                            {transporter.vehicle_type &&
                                transporter.vehicle_type.length &&
                                transporter?.vehicle_type.map((vehicle) => (
                                    <Chip key={vehicle.id} label={`${vehicle.vehicle_type}`} sx={{ ml: 1 }} chipcolor="success" />
                                ))}
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography variant="h2" align="left">
                    {activeDocName}
                </Typography>
                <Grid item xs={12} md={12} lg={12}>
                    {activeDoc && (
                        <Grid item xs={12} md={12} lg={12}>
                            <Grid container sx={{ height: '58vh', overflow: 'auto' }}>
                                {activeDoc.includes('.pdf') ? (
                                    <iframe id="doc_preview" title="document preview" width="100%" height="100%" src={activeDoc} />
                                ) : (
                                    <img width="100%" src={activeDoc || ''} alt="document" />
                                )}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                        {transporter?.msme_certificate && (
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        boxShadow: theme.customShadows.primary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        },
                                        marginLeft: 4
                                    }}
                                    disabled={activeDocName && activeDocName === 'MSME Certificate'}
                                    onClick={() => openDoc('msme_certificate')}
                                >
                                    Msme Certificate
                                </Button>
                            </AnimateButton>
                        )}
                        {transporter?.pan && (
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        boxShadow: theme.customShadows.primary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        },
                                        marginLeft: 4
                                    }}
                                    disabled={activeDocName && activeDocName === 'PAN Card'}
                                    onClick={() => openDoc('pan')}
                                >
                                    Pan
                                </Button>
                            </AnimateButton>
                        )}
                        {transporter?.cancelled_cheque && (
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        boxShadow: theme.customShadows.primary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        },
                                        marginLeft: 4
                                    }}
                                    disabled={activeDocName && activeDocName === 'Cancelled Cheque'}
                                    onClick={() => openDoc('cancelled_cheque')}
                                >
                                    Cancelled Cheque
                                </Button>
                            </AnimateButton>
                        )}
                        {transporter?.gst_certificate && (
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        boxShadow: theme.customShadows.primary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        },
                                        marginLeft: 4
                                    }}
                                    disabled={activeDocName && activeDocName === 'GST Certificate'}
                                    onClick={() => openDoc('gst_certificate')}
                                >
                                    Gst Certificate
                                </Button>
                            </AnimateButton>
                        )}
                        {transporter?.incorporation_certificate && (
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        boxShadow: theme.customShadows.primary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        },
                                        marginLeft: 4
                                    }}
                                    disabled={activeDocName && activeDocName === 'Incorporation Certificate'}
                                    onClick={() => openDoc('incorporation_certificate')}
                                >
                                    Incorporation Certificate
                                </Button>
                            </AnimateButton>
                        )}
                    </Grid>
                    {!transporter?.rejected && (
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }} xs={12} md={12} lg={12}>
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
                                    onClick={() => {
                                        setOpen(true);
                                    }}
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
                                    // onClick={() => handleStatusChange('accept')}
                                    // disabled={disableAccept}
                                    onClick={() => setDialog(true)}
                                >
                                    Accept
                                </Button>
                            </AnimateButton>
                            <Dialog
                                open={dialog}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                sx={{ p: 3 }}
                            >
                                {dialog && (
                                    <>
                                        <DialogTitle id="alert-dialog-title">Do You Really Want to approve the vendor?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                <Typography variant="body2" component="span">
                                                    Vendor will be approved by FINANCE and LEGAL heads.
                                                </Typography>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions sx={{ pr: 2.5 }}>
                                            <Button
                                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                                onClick={handleClose}
                                                color="secondary"
                                            >
                                                Disagree
                                            </Button>
                                            <Button variant="contained" size="small" onClick={() => handleStatusChange('accept')} autoFocus>
                                                Agree
                                            </Button>
                                        </DialogActions>
                                    </>
                                )}
                            </Dialog>
                        </Grid>
                    )}
                </Grid>
            </TabPanel>
            <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="reject model" aria-describedby="reason-modal">
                <MainCard
                    sx={{
                        position: 'absolute',
                        width: { xs: 280, lg: 450 },
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title="Reject reason"
                    content={false}
                    secondary={
                        <IconButton onClick={() => setOpen(false)} size="large">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent>
                        <Grid
                            container
                            sx={{
                                mb: 2
                            }}
                        >
                            <Typography variant="contained" component="span" color="primary.dark">
                                Please write rejection reason...
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-textarea"
                                label="Reason"
                                placeholder="please write rejection reason..."
                                defaultValue={reason}
                                sx={{
                                    width: '100%'
                                }}
                                onInput={handleInput}
                                multiline
                            />
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Grid container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                        }
                                    }}
                                    onClick={() => handleStatusChange('reject')}
                                    disabled={disableAccept}
                                >
                                    Update
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </CardActions>
                </MainCard>
            </Modal>
            <TabPanel value={value} index={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <SubCard title="Request Logs">{transporter?.logs && <VendorLogTimeline data={transporter.logs} />}</SubCard>
                </Grid>
            </TabPanel>
        </>
    );
}
