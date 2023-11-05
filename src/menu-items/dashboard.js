// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

const icons = {
    IconDashboard,
    IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'ui-dash',
    // title: <FormattedMessage id="forms" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    role: ['SUPER-ADMIN', 'ADMIN', 'DEVELOPER'],
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="Dashboard" />,
            type: 'item',
            url: '/yms/home',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            role: ['SUPER-ADMIN', 'ADMIN', 'DEVELOPER'],
            access: 'read_dash'
        }
    ]
};
export default dashboard;
