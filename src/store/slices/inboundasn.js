// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    asn: []
};

const slice = createSlice({
    name: 'asn',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DEPARTMENT
        setInboundASN(state, action) {
            state.asn = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getInboundASN(queryString = '') {
    return async () => {
        try {
            const response = await axios.get('/inbound');
            console.log(response.data.data.data);
            dispatch(slice.actions.setInboundASN(response.data.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
