// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';
import vehicleReducer from './slices/vehicle';
import roleReducer from './slices/role';
import departmentReducer from './slices/department';
import laneReducer from './slices/lane';
import clientReducer from './slices/client';
import permissionReducer from './slices/permissions';
import configurationReducer from './slices/configuration';
import hubReducer from './slices/hub';
import vendorReducer from './slices/vendor';
import locationReducer from './slices/location';
import categoryReducer from './slices/category';
import customerproductReducer from './slices/customer.product';
import customeruserReducer from './slices/customer.user';
import dispatchtypeReducer from './slices/dispatchtype';
import dispatchcustomerReducer from './slices/dispatchCustomer';
import userLocationuserReducer from './slices/user.location';
import inboundasnReducer from './slices/inboundasn';

// import clientListReducer from './slices/client'

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'fps-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    menu: menuReducer,
    vehicle: vehicleReducer,
    role: roleReducer,
    permission: permissionReducer,
    department: departmentReducer,
    lane: laneReducer,
    client: clientReducer,
    configuration: configurationReducer,
    hub: hubReducer,
    vendor: vendorReducer,
    location: locationReducer,
    category: categoryReducer,
    customerproduct: customerproductReducer,
    customeruser: customeruserReducer,
    dispatchtype: dispatchtypeReducer,
    dispatchcustomer: dispatchcustomerReducer,
    userloaction: userLocationuserReducer,
    asn: inboundasnReducer
});

export default reducer;
