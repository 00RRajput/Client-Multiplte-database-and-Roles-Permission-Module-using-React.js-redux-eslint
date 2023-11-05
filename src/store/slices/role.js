// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    roles: []
};

const slice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getRole(state, action) {
            state.roles = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRoles(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/roles${queryString}`);
            console.log('res', response);
            dispatch(slice.actions.getRole(response.data.data.roles));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
