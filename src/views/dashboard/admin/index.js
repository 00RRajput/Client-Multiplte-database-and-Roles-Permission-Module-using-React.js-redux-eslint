import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, Typography } from '@mui/material';

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import ApexBarChart from './ApexBarChart';
import ApexBarChartUser from './ApexBarChartUser';
import Map from './Dashboardmap';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);
    const theme = useTheme();
    return (
        <Grid container spacing={gridSpacing}>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Typography sx={{ fontSize: '1.425rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Hub Locations</Typography>
                        <Map />
                    </Grid>
                </Grid>
            </Grid> */}
            <Grid item xs={12}>
                <SubCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item sm={6} md={3}>
                            <Card sx={{ border: `1px solid ${theme.palette.secondary.main}` }}>
                                <CardHeader
                                    sx={{ borderBottom: `1px solid ${theme.palette.secondary.main}` }}
                                    title={
                                        <Typography variant="h5" sx={{ color: theme.palette.secondary.main }}>
                                            Secondary
                                        </Typography>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle1" color="inherit">
                                                Secondary Card Title
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2" color="inherit">
                                                Some quick example text to build on the card title and make up the bulk of the card&apos;s
                                                content.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <Card sx={{ border: `1px solid ${theme.palette.orange.main}` }}>
                                <CardHeader
                                    sx={{ borderBottom: `1px solid ${theme.palette.orange.main}` }}
                                    title={
                                        <Typography variant="h5" sx={{ color: theme.palette.orange.main }}>
                                            Orange
                                        </Typography>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle1" color="inherit">
                                                Orange Card Title
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2" color="inherit">
                                                Some quick example text to build on the card title and make up the bulk of the card&apos;s
                                                content.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <Card sx={{ border: `1px solid ${theme.palette.warning.main}` }}>
                                <CardHeader
                                    sx={{ borderBottom: `1px solid ${theme.palette.warning.main}` }}
                                    title={
                                        <Typography variant="h5" sx={{ color: theme.palette.warning.main }}>
                                            Warning
                                        </Typography>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle1" color="inherit">
                                                Warning Card Title
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2" color="inherit">
                                                Some quick example text to build on the card title and make up the bulk of the card&apos;s
                                                content.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <Card sx={{ border: `1px solid ${theme.palette.info.main}` }}>
                                <CardHeader
                                    sx={{ borderBottom: `1px solid ${theme.palette.info.main}` }}
                                    title={
                                        <Typography variant="h5" sx={{ color: theme.palette.info.main }}>
                                            Info
                                        </Typography>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle1" color="inherit">
                                                Info Card Title
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2" color="inherit">
                                                Some quick example text to build on the card title and make up the bulk of the card&apos;s
                                                content.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ fontSize: '1.425rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Vendors</Typography>
                        <ApexBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ fontSize: '1.425rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Holisol Users</Typography>
                        <ApexBarChartUser isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default Dashboard;
