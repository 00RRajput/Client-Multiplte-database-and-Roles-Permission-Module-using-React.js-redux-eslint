import PropTypes from 'prop-types';
import React, { useEffect, useState, lazy } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Checkbox, Divider, Box, Grid, Stack, Tab, Tabs, Typography, Button } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'store';
import { getUCFields, getUserConfigFields } from 'store/slices/configuration';
import Loadable from 'ui-component/Loadable';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
// componet
const UserConfigurationForm = Loadable(lazy(() => import('views/forms/configuration/user-form')));

// tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        p: 0
                    }}
                >
                    {children}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`
    };
}

// ================================|| UI TABS - VERTICAL ||================================ //

export default function VerticalTabs({ clientId }) {
    VerticalTabs.propTypes = {
        clientId: PropTypes.any.isRequired
    };
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const dispatch = useDispatch();
    const [fields, setFilds] = useState([]);
    const { userConfigFilds } = useSelector((state) => state.configuration);
    const { userConfigFild } = useSelector((state) => state.configuration);
    const [configFilds, setConfigField] = useState({});

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getUCFields());
    }, []);
    useEffect(() => {
        dispatch(getUserConfigFields(clientId));
    }, [clientId]);
    useEffect(() => {
        setFilds(userConfigFilds);
        setConfigField(userConfigFild);
    }, [userConfigFilds, userConfigFild]);
    // console.log('fields', fields);
    const userFormik = useFormik({
        initialValues: {
            fields: []
        },
        // validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(values);
            //     if (values) {
            //         try {
            //             // setOpen(true);
            //             await axios.put(`/roles/${data.id}`, formik.values);
            //             resetForm();
            //             dispatch(getRoles(makeQuery()));
            //             dispatch(
            //                 openSnackbar({
            //                     open: true,
            //                     message: 'Role Updated successfully !',
            //                     variant: 'alert',
            //                     alert: {
            //                         color: 'success'
            //                     },
            //                     transition: 'SlideLeft',
            //                     close: true
            //                 })
            //             );
            //             onEmit(false);
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
        }
    });

    return (
        <div>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={4} md={3}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        orientation="vertical"
                        variant="scrollable"
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                borderBottom: 'none'
                            },
                            '& button': {
                                borderRadius: `${borderRadius}px`,
                                color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
                                minHeight: 'auto',
                                minWidth: '100%',
                                py: 1.5,
                                px: 2,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                textAlign: 'left',
                                justifyContent: 'flex-start'
                            },
                            '& button.Mui-selected': {
                                color: theme.palette.primary.main,
                                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
                            },
                            '& button > svg': {
                                marginBottom: '0px !important',
                                marginRight: 1.25,
                                marginTop: 1.25,
                                height: 20,
                                width: 20
                            },
                            '& button > div > span': {
                                display: 'block'
                            },
                            '& > div > span': {
                                display: 'none'
                            }
                        }}
                    >
                        <Tab
                            icon=""
                            label={
                                <Grid container direction="column">
                                    <Typography variant="subtitle1" color="inherit">
                                        Masters
                                    </Typography>
                                </Grid>
                            }
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={<PersonOutlineTwoToneIcon />}
                            label={
                                <Grid container direction="column">
                                    <Typography variant="subtitle1" color="inherit">
                                        User
                                    </Typography>
                                    <Typography component="div" variant="caption" sx={{ textTransform: 'capitalize' }}>
                                        User Form Settings
                                    </Typography>
                                </Grid>
                            }
                            {...a11yProps(1)}
                        />
                        <Tab
                            icon={<DescriptionTwoToneIcon />}
                            label={
                                <Grid container direction="column">
                                    <Typography variant="subtitle1" color="inherit">
                                        Other
                                    </Typography>
                                    <Typography component="div" variant="caption" sx={{ textTransform: 'capitalize' }}>
                                        Other Information
                                    </Typography>
                                </Grid>
                            }
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <TabPanel value={value} index={1}>
                        <SubCard>
                            <Stack spacing={gridSpacing}>
                                <UserConfigurationForm configFilds={configFilds} clientId={clientId} />
                            </Stack>
                        </SubCard>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <SubCard>
                            <Stack spacing={gridSpacing}>
                                <form onSubmit={userFormik.handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={6} sm={6}>
                                                    <Typography variant="subtitle1" color="inherit">
                                                        Fields
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <Typography variant="subtitle1" color="inherit">
                                                        Visiblity
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Typography variant="subtitle1" color="inherit">
                                                        Integration
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {fields.map((field, index) => (
                                            <Grid item xs={12} key={index}>
                                                <Grid container>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {field.label}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <Checkbox
                                                            key={index}
                                                            color="secondary"
                                                            name={`saveAddress_${index}`}
                                                            value={userFormik.values.visibility}
                                                            onChange={(event, newValue) => {
                                                                userFormik.setFieldValue(`visibility[${field.field}]`, newValue);
                                                            }}
                                                            disabled={field.visibility}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <Checkbox
                                                            key={index + 50}
                                                            color="secondary"
                                                            name={`saveAddress_${index + 50}`}
                                                            onChange={(event, newValue) => {
                                                                userFormik.setFieldValue(`integration[${field.field}]`, newValue);
                                                            }}
                                                            disabled={!field.integration}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        ))}
                                        ;
                                        <Divider />
                                        <Grid item xs={12} lg={6}>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Button type="submit" variant="contained" color="secondary">
                                                        Submit
                                                    </Button>
                                                </Grid>
                                                {/* <Grid item>
                                                    <Button variant="contained">Clear</Button>
                                                </Grid> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Stack>
                        </SubCard>
                    </TabPanel>
                </Grid>
            </Grid>
        </div>
    );
}
