// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    vendors: [],
    count: 0
};

const slice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET VENDORS
        getVendorsSuccess(state, action) {
            state.vendors = action.payload;
        },
        // SET VENDOR COUNT
        setVendorCount(state, action) {
            state.count = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getVendors(filter) {
    return async () => {
        try {
            const response = await axios.get(`/vendors${filter}`);
            dispatch(slice.actions.getVendorsSuccess(response.data.data.vendors));
            dispatch(slice.actions.setVendorCount(response.data.count));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
