// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    customeruser: []
};

const slice = createSlice({
    name: 'customeruser',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DEPARTMENT
        setSuccess(state, action) {
            state.customeruser = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCustomerUser(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/user/customer${queryString}`);
            dispatch(slice.actions.setSuccess(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
