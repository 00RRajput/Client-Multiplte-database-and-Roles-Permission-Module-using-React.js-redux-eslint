// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    dispatchcustomer: []
};

const slice = createSlice({
    name: 'dispatchcustomer',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DEPARTMENT
        setDispatch(state, action) {
            state.dispatchcustomer = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDispatch(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/dispatch/customer${queryString}`);
            dispatch(slice.actions.setDispatch(response.data.data.customers));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
