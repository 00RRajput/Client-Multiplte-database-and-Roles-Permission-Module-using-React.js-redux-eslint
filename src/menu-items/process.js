// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconApps, IconArrowAutofitRight } from '@tabler/icons';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconApps,
    IconArrowAutofitRight,
    PermIdentityIcon
};

// ==============================|| MENU ITEMS - master ||============================== //

const process = {
    id: 'process',
    title: <FormattedMessage id="process" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'process',
            title: <FormattedMessage id="Process" />,
            type: 'collapse',
            icon: icons.IconArrowAutofitRight,
            // url: '/inbound',
            breadcrumbs: true,
            children: [
                {
                    id: 'inbound',
                    title: <FormattedMessage id="Inbound" />,
                    type: 'item',
                    url: '/inbound',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_inbound'
                },
                {
                    id: 'pre-stages',
                    title: <FormattedMessage id="Pre-stages" />,
                    type: 'item',
                    url: '/pre-stages',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_prestages'
                }
            ]
        },
        {
            id: 'dispatchcustomer',
            title: <FormattedMessage id="Dispatch Customer" />,
            type: 'item',
            icon: icons.PermIdentityIcon,
            url: '/admin/dispatch/type/customer',
            breadcrumbs: true,
            access: 'read_dispatchcustomer'
        }
    ]
};

export default process;
