import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'store';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box, Button } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthRegister from 'views/pages/authentication/auth-forms/AuthRegister';
import SeaRegister from 'views/pages/authentication/auth-forms/SeaRegister';
import AirRegister from 'views/pages/authentication/auth-forms/AirRegister';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';

// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
    const theme = useTheme();
    const { isLoggedIn } = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [type, setType] = useState('');

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }} md={8}>
                            {/* <AuthCardWrapper> */}
                            <AuthWrapper1
                                sx={{ p: { xs: 1, sm: 3, md: 4 }, mb: 0, bgcolor: theme.palette.background.paper, borderRadius: '10px' }}
                            >
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 1 }}>
                                        <Link to="#" aria-label="theme-logo">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Vendor Registration
                                                    </Typography>
                                                    {/* <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography> */}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid item container direction="column" alignItems="center" xs={12}>
                                                    <Typography
                                                        component={Link}
                                                        to={isLoggedIn ? '/pages/login/login3' : '/login'}
                                                        variant="subtitle1"
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        Already have an account?(click here)
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid />
                                            <Grid item xs={12} sm={12} md={12}>
                                                <Box display="flex" justifyContent="center" border={0.5} p={1} borderRadius={3}>
                                                    <Button
                                                        variant={type === 'Land' ? 'contained' : 'outlined'}
                                                        onClick={() => setType('Land')}
                                                        sx={{ mx: 2 }} // Adds space between the buttons
                                                    >
                                                        Land
                                                    </Button>
                                                    <Button
                                                        variant={type === 'Air' ? 'contained' : 'outlined'}
                                                        onClick={() => setType('Air')}
                                                        sx={{ mx: 2 }} // Adds space between the buttons
                                                    >
                                                        Air
                                                    </Button>
                                                    <Button
                                                        variant={type === 'Sea' ? 'contained' : 'outlined'}
                                                        onClick={() => setType('Sea')}
                                                        sx={{ mx: 2 }} // Adds space between the buttons
                                                    >
                                                        Sea
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {type === 'Land' ? <AuthRegister /> : null}
                                        {type === 'Air' ? <AirRegister /> : null}
                                        {type === 'Sea' ? <SeaRegister /> : null}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                            </AuthWrapper1>
                            {/* </AuthCardWrapper> */}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Register;
