// third-party
import { FormattedMessage } from 'react-intl';

// assets
import ShutterSpeedSharpIcon from '@mui/icons-material/ShutterSpeedSharp';

const Permission = {
    id: 'ui-permission',
    // title: <FormattedMessage id="forms" />,
    icon: '',
    type: 'group',
    access: 'read_permission',
    children: [
        {
            id: 'permission',
            title: <FormattedMessage id="Permission" />,
            type: 'item',
            url: '/yms/role-permissions',
            icon: ShutterSpeedSharpIcon,
            breadcrumbs: false,
            access: 'read_permission'
        }
    ]
};
export default Permission;
