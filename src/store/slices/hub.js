// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    hub: []
};

const slice = createSlice({
    name: 'hub',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getHubSuccess(state, action) {
            state.hub = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getHub(filter = '') {
    return async () => {
        try {
            console.log(filter);
            const response = await axios.get(`/hubs${filter}`);
            dispatch(slice.actions.getHubSuccess(response.data.data.hubs));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
