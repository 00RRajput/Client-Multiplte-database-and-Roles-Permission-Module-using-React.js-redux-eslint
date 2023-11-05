import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch } from '../index';
// import axios from 'utils/axios';

// initial state
const initialState = {
    selectedItem: ['dashboard'],
    selectedID: null,
    drawerOpen: false,
    error: null,
    menu: {}
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        activeID(state, action) {
            state.selectedID = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },

        // has error
        hasError(state, action) {
            state.error = action.payload;
        },

        // get dashboard menu
        getMenuSuccess(state, action) {
            state.menu = action.payload;
        }
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, activeID } = menu.actions;

export function getMenu() {
    return async () => {
        try {
            // const response = await axios.get('/api/menu/widget');
            dispatch(
                menu.actions.getMenuSuccess({
                    id: 'widget',
                    title: 'widget',
                    type: 'group',
                    icon: 'widget',
                    role: ['DEVELOPER'],
                    children: [
                        {
                            id: 'statistics',
                            title: 'statistics',
                            type: 'item',
                            icon: 'statistics',
                            url: '/widget/statistics',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'data',
                            title: 'data',
                            type: 'item',
                            icon: 'data',
                            url: '/widget/data',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'chart',
                            title: 'chart',
                            type: 'item',
                            icon: 'chart',
                            url: '/widget/chart',
                            role: ['DEVELOPER']
                        }
                    ]
                })
            );
        } catch (error) {
            dispatch(menu.actions.hasError(error));
        }
    };
}
