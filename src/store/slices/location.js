// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    locations: []
};

const slice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getLocationSuccess(state, action) {
            state.locations = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getLocation(id) {
    return async () => {
        try {
            const response = await axios.get(`/location?client=${id}`);
            console.log(response);
            dispatch(slice.actions.getLocationSuccess(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
