import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Link,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Switch,
    Button,
    Typography
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import useAuth from 'hooks/useAuth';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
import useConfig from 'hooks/useConfig';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const navigate = useNavigate();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout } = useAuth();
    let { user } = useAuth();
    const [open, setOpen] = useState(false);
    const ROLE = 'Hello!';
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */

    const anchorRef = useRef(null);
    const handleLogout = async () => {
        try {
            user = {};
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);
    // if (user !== null) {
    //     ROLE = user.role.role;
    //     ROLE = ROLE.charAt(0).toUpperCase() + ROLE.slice(1).toLowerCase();
    //     ROLE = ROLE.replace(/[^\w\s]|_/g, ' ');
    // }
    const location = useLocation();
    return (
        <>
            {location.pathname !== '/' ? (
                <Chip
                    sx={{
                        height: '48px',
                        alignItems: 'center',
                        borderRadius: '27px',
                        transition: 'all .2s ease-in-out',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                        '&[aria-controls="menu-list-grow"], &:hover': {
                            borderColor: theme.palette.primary.main,
                            background: `${theme.palette.primary.main}!important`,
                            color: theme.palette.primary.light,
                            '& svg': {
                                stroke: theme.palette.primary.light
                            }
                        },
                        '& .MuiChip-label': {
                            lineHeight: 0
                        }
                    }}
                    icon=""
                    label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
                    variant="outlined"
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="primary"
                />
            ) : (
                <>
                    <Link
                        component={RouterLink}
                        to="/yms/home"
                        sx={{
                            textDecoration: 'none',
                            cursor: 'pointer',
                            padding: '2px 12px',
                            alignItems: 'center',
                            borderRadius: '27px',
                            transition: 'all .2s ease-in-out',
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                        }}
                    >
                        YMS
                    </Link>
                    <Link
                        sx={{
                            textDecoration: 'none',
                            cursor: 'pointer',
                            padding: '2px 17px',
                            marginRight: '45px',
                            alignItems: 'center',
                            borderRadius: '27px',
                            transition: 'all .2s ease-in-out',
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                        }}
                        onClick={() => alert('decelopment mode')}
                    >
                        TMS
                    </Link>
                    <Chip
                        sx={{
                            height: '34px',
                            padding: '2px 17px',
                            alignItems: 'center',
                            borderRadius: '27px',
                            transition: 'all .2s ease-in-out',
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                        }}
                        label={user.name}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        {user.name}
                    </Chip>
                </>
            )}
            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2, pb: 0, mb: 1 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">Good Morning,</Typography>
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {user?.name}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">{ROLE}</Typography>
                                            </Stack>
                                        </Box>
                                        <PerfectScrollbar
                                            style={{
                                                height: '100%',
                                                maxHeight: 'calc(100vh - 250px)',
                                                overflowX: 'hidden'
                                            }}
                                        >
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <Divider />
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 350,
                                                        minWidth: 300,
                                                        backgroundColor: theme.palette.background.paper,
                                                        borderRadius: '10px',
                                                        [theme.breakpoints.down('md')]: {
                                                            minWidth: '100%'
                                                        },
                                                        '& .MuiListItemButton-root': {
                                                            mt: 0.5
                                                        }
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{
                                                            display: location.pathname === '/' ? 'none' : 'inline-flex',
                                                            borderRadius: `${borderRadius}px`
                                                        }}
                                                        selected={selectedIndex === 0}
                                                        onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconSettings stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="account-settings" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{
                                                            display: location.pathname === '/' ? 'none' : 'inline-flex',
                                                            borderRadius: `${borderRadius}px`
                                                        }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) => handleListItemClick(event, 1, '/user/social-profile/posts')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconUser stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Grid container spacing={1} justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="body2">
                                                                            <FormattedMessage id="social-profile" />
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Chip
                                                                            label="02"
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor:
                                                                                    theme.palette.mode === 'dark'
                                                                                        ? theme.palette.dark.dark
                                                                                        : theme.palette.warning.dark,
                                                                                color: theme.palette.background.default
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 4}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="logout" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </List>
                                            </Box>
                                        </PerfectScrollbar>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
