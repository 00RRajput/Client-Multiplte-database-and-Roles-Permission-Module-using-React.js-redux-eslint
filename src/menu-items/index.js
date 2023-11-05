import dashboard from './dashboard';
import client from './client';
import permission from './permissions';
import application from './application';
import forms from './forms';
import elements from './elements';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import master from './master';
import process from './process';

// ==============================|| MENU ITEMS ||============================== //
const menuItems = {
    items: [dashboard, client, master, permission, process, application, forms, elements, pages, utilities, support, other]
};

export default menuItems;
