// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    vehicles: []
};

const slice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getVehiclesSuccess(state, action) {
            state.vehicles = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getVehicles(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/vehicles${queryString}`);
            dispatch(slice.actions.getVehiclesSuccess(response.data.data.vehicles));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
