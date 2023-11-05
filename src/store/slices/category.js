// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    category: []
};

const slice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getCategorySuccess(state, action) {
            state.category = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategory(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/category${queryString}`);
            console.log(response.data.data.categories);
            dispatch(slice.actions.getCategorySuccess(response.data.data.categories));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
