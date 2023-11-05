// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    customerproduct: []
};

const slice = createSlice({
    name: 'customerproduct',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DEPARTMENT
        setSuccess(state, action) {
            state.customerproduct = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCustomerProduct(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/customer/product${queryString}`);
            dispatch(slice.actions.setSuccess(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
