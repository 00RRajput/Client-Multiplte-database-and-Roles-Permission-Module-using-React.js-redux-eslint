// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    permissions: [],
    isLoading: true
};

const slice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // SET PERMISSION STATE
        setPermissionState(state, action) {
            state.permissions = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserPermissions(roles, stac) {
    return async () => {
        try {
            const response = await axios.get(`/permissions/permissions?roles=${JSON.stringify(roles)}`);
            dispatch(slice.actions.setPermissionState(response.data.data.permissions));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
