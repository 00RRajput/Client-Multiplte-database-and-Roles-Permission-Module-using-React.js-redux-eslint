// material-ui
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/logo/logo.png';
import {
    AppBar as MuiAppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const sideAvatarSX = {
    display: 'inline-flex'
};
const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         *
         *
         */
        <Typography component="span" sx={{ ...sideAvatarSX, flexGrow: 1, textAlign: 'left' }}>
            <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" color={theme.palette.secondary.main}>
                e-
            </Typography>
            <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" color="primary">
                logistics
            </Typography>
        </Typography>
        // <img src={theme.palette.mode === 'dark' ? logo : logo} alt="holisol-logo" width="100" />
    );
};

export default Logo;
