import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Divider } from '@mui/material';

const Terms = () => (
    <>
        <Grid container direction="column" justifyContent="center" spacing={2}>
            <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box sx={{ mb: 2 }} alignItems="center" justifyContent="center">
                    <Typography variant="subtitle1" color="red" size="20px" alignItems="center" justifyContent="center">
                        Terms and Conditions*
                    </Typography>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Typography variant="subtitle1" color="black">
                        1.An Intellectual Property clause will inform users that the contents, logo and other visual media you created is
                        your property and is protected by copyright laws.
                    </Typography>
                    <Typography variant="subtitle1" color="black">
                        2.A Termination clause will inform users that any accounts on your website and mobile app, or users access to your
                        website and app, can be terminated in case of abuses or at your sole discretion.
                    </Typography>
                    <Typography variant="subtitle1" color="black">
                        3.A Governing Law clause will inform users which laws govern the agreement. These laws should come from the country
                        in which your company is headquartered or the country from which you operate your website and mobile app.
                    </Typography>
                    <Typography variant="subtitle1" color="black">
                        4.A Links to Other Websites clause will inform users that you are not responsible for any third party websites that
                        you link to.
                    </Typography>
                    <Typography variant="subtitle1" color="black">
                        5.This kind of clause will generally inform users that they are responsible for reading and agreeing (or
                        disagreeing) with the Terms and Conditions or Privacy Policies of these third parties. If your website or mobile app
                        allows users to create content and make that content public to other users, a Content clause will inform users that
                        they own the rights to the content they have created.
                    </Typography>
                    <Typography variant="subtitle1" color="black">
                        6.This clause usually mentions that users must give you (the website or mobile app developer/owner) a license so
                        that you can share this content on your website/mobile app and to make it available to other users.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </>
);
export default Terms;
