import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

import { useNavigate } from 'react-router-dom';

// ===============================|| ||=============================== //

const PermissionDenied = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const backNavigate = () => navigate(-1);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={12}>
                <MainCard
                    boxShadow
                    sx={{
                        pt: 1.75
                    }}
                >
                    <Grid container textAlign="center" spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: '1.5625rem',
                                    fontWeight: 500,
                                    position: 'relative',
                                    mb: 1.875,
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -15,
                                        left: 'calc(50% - 25px)',
                                        width: 50,
                                        height: 4,
                                        background: theme.palette.primary.main,
                                        borderRadius: '3px'
                                    }
                                }}
                            >
                                You Dont have Permissions..
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {/* <Typography variant="body2"></Typography> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'secondary.main'
                                }}
                                onClick={backNavigate}
                            >
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default PermissionDenied;
