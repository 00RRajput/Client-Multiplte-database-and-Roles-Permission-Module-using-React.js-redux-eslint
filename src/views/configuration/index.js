// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Button,
    CardContent,
    CardActions,
    Checkbox,
    Divider,
    Grid,
    TextField,
    FormHelperText,
    FormControlLabel,
    Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';
import LAYOUT_CONST from 'constant';
import ConfigurationTabPanel from './configuration-tab-panel';

// assets
import { IconClipboardList } from '@tabler/icons';
import SettingsSuggestSharpIcon from '@mui/icons-material/SettingsSuggestSharp';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { useParams } from 'react-router-dom';
// ==============================|| Sticky ActionBar ||============================== //

function Configuration() {
    const { clientId } = useParams();
    const theme = useTheme();
    const { layout } = useConfig();
    const [clientData, setClientData] = useState({});

    const getClient = async () => {
        const response = await axios.get(`/client/get-client/${clientId}`);
        setClientData(response.data.data);
    };

    useEffect(() => {
        getClient();
    }, [clientId]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard content={false} sx={{ overflow: 'visible' }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4} lg={5} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                                        <Avatar
                                            variant="rounded"
                                            color="inherit"
                                            sx={{ bgcolor: theme.palette.secondary.main, ml: 'auto' }}
                                        >
                                            <SettingsSuggestSharpIcon style={{ color: '#fff' }} />
                                        </Avatar>
                                    </Grid>
                                    <Grid item xs={12} sm={8} lg={6}>
                                        <Typography variant="h3" sx={{ mb: 0 }}>
                                            Configuration of {clientData.client_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            All applied dashboard
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={1} />
                            <Grid item xs={10}>
                                <ConfigurationTabPanel clientId={clientId} />
                            </Grid>
                        </Grid>
                    </CardContent>
                    {/* <Divider />
                    <CardActions>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} lg={4} />
                            <Grid item xs={12} lg={6}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Button variant="contained" color="secondary">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained">Clear</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardActions> */}
                </MainCard>
            </Grid>
        </Grid>
    );
}

export default Configuration;
