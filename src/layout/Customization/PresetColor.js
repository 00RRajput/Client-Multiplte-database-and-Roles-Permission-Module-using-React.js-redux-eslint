import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Grid } from '@mui/material';
import { IconChecks } from '@tabler/icons';

// project imports
import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';

// color import
// import colors from 'assets/scss/_themes-vars.module.scss';
import appTheme from 'assets/scss/_theme.module.scss';

const PresetColorBox = ({ color, presetColor, setPresetColor }) => (
    <Grid item>
        <Avatar
            variant="rounded"
            color="inherit"
            sx={{
                background: `linear-gradient(135deg, ${color.primary} 50%, ${color.secondary} 50%)`,
                opacity: presetColor === color.id ? 0.6 : 1,
                cursor: 'pointer'
            }}
            onClick={() => setPresetColor(color?.id)}
        >
            {presetColor === color.id && <IconChecks color="#fff" />}
        </Avatar>
    </Grid>
);

PresetColorBox.propTypes = {
    color: PropTypes.shape({
        id: PropTypes.string,
        primary: PropTypes.string,
        secondary: PropTypes.string
    }),
    presetColor: PropTypes.string,
    setPresetColor: PropTypes.func
};

const PresetColor = () => {
    const theme = useTheme();
    const { presetColor, onChangePresetColor } = useConfig();

    const colorOptions = [
        {
            id: 'theme',
            primary: theme.palette.mode === 'dark' ? appTheme.darkPrimaryMain : appTheme.primaryMain,
            secondary: theme.palette.mode === 'dark' ? appTheme.darkSecondaryMain : appTheme.secondaryMain
        }
    ];

    return (
        <SubCard title="Preset Color">
            <Grid item container spacing={2} alignItems="center">
                {colorOptions.map((color, index) => (
                    <PresetColorBox key={index} color={color} presetColor={presetColor} setPresetColor={onChangePresetColor} />
                ))}
            </Grid>
        </SubCard>
    );
};

export default PresetColor;
