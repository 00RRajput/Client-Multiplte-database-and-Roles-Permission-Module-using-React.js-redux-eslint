// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';
import GroupWorkSharpIcon from '@mui/icons-material/GroupWorkSharp';
// import { useDispatch, useSelector } from 'store';

const icons = {
    IconDashboard,
    IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const Client = {
    id: 'ui-client',
    // title: <FormattedMessage id="forms" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    role: ['SUPER-ADMIN', 'DEVELOPER'],
    children: [
        {
            id: 'client',
            title: <FormattedMessage id="Our Client" />,
            type: 'item',
            url: '/dashboard/client',
            icon: GroupWorkSharpIcon,
            breadcrumbs: false,
            role: ['SUPER-ADMIN', 'DEVELOPER'],
            access: 'read_client'
        }
    ]
};
export default Client;
