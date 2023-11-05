// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    departments: []
};

const slice = createSlice({
    name: 'department',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DEPARTMENT
        setDepartment(state, action) {
            state.departments = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDepartment(queryString = '') {
    return async () => {
        try {
            const response = await axios.get(`/departments${queryString}`);
            dispatch(slice.actions.setDepartment(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
