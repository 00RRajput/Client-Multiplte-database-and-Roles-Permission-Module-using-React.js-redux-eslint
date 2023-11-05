import LAYOUT_CONST from 'constant';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = {
    developer: '/yms/home',
    admin: '/yms/home',
    vendor: '/vendor/home',
    legal: '/legal/home',
    finance: '/finance/home',
    operation: '/operations/home',
    customer_care: '/customer_care/home'
};
export const HORIZONTAL_MAX_ITEM = 6;

const config = {
    layout: LAYOUT_CONST.VERTICAL_LAYOUT, // vertical, horizontal
    drawerType: LAYOUT_CONST.MINI_DRAWER, // default, mini-drawer
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    navType: 'light', // light, dark
    presetColor: 'theme3', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: false
};

export default config;
