// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconApps } from '@tabler/icons';
import SettingsSuggestSharpIcon from '@mui/icons-material/SettingsSuggestSharp';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    configMenuList: [],
    userConfigFilds: [],
    userConfigFild: []
};

const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconApps
};

const slice = createSlice({
    name: 'configuration',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CLIENTS MENU
        getMenuList(state, action) {
            state.configMenuList = action.payload;
        },

        // GET USER CONFIGURATION FIELD
        // NOT SUCCESS
        getUserFilds(state, action) {
            state.userConfigFilds = action.payload;
        },

        // GET USER CONFIGURATION FIELD
        getUserFild(state, action) {
            state.userConfigFild = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export function getConfigurationMenu(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/configuration/menu-list${queryString}`);

            const menuArray = response.data.data.data.map((value, key) => {
                const children = {
                    id: `configuration_${key}`,
                    title: <FormattedMessage id={value.client_user_name} />,
                    type: 'item',
                    url: `/dashboard/configuration/${value.id}`,
                    breadcrumbs: false,
                    role: ['SUPER-ADMIN', 'DEVELOPER']
                };
                return children;
            });

            const configuration = {
                id: 'ui-configuration',
                // title: <FormattedMessage id="forms" />,
                icon: icons.IconPictureInPicture,
                type: 'group',
                role: ['SUPER-ADMIN', 'DEVELOPER'],
                children: [
                    {
                        id: 'configuration',
                        title: <FormattedMessage id="Configuration" />,
                        type: 'collapse',
                        icon: SettingsSuggestSharpIcon,
                        role: ['ADMIN', 'DEVELOPER'],
                        children: menuArray
                    }
                ]
            };

            dispatch(slice.actions.getMenuList(configuration));
            // dispatch(slice.actions.getClientList(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUCFields() {
    return async () => {
        try {
            const response = await axios.get('/configuration/user-fields');
            dispatch(slice.actions.getUserFilds(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserConfigFields(clientId = '') {
    return async () => {
        try {
            const response = await axios.get(`/configuration/user-field/${clientId}`);
            dispatch(slice.actions.getUserFild(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
