// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconApps, IconPictureInPicture } from '@tabler/icons';

const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconApps,
    IconPictureInPicture
};

// ==============================|| MENU ITEMS - master ||============================== //

const master = {
    id: 'ui-masters',
    // title: <FormattedMessage id="forms" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    children: [
        {
            id: 'masters',
            title: <FormattedMessage id="Masters" />,
            type: 'collapse',
            icon: icons.IconApps,
            children: [
                {
                    id: 'department',
                    title: <FormattedMessage id="Department" />,
                    type: 'item',
                    url: '/yms/department',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_department'
                },
                {
                    id: 'role',
                    title: <FormattedMessage id="Role" />,
                    type: 'item',
                    url: '/yms/role',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_role'
                },
                {
                    id: 'usersss',
                    title: <FormattedMessage id="User" />,
                    type: 'item',
                    url: '/admin/users',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_admin_user'
                },
                {
                    id: 'usera',
                    title: <FormattedMessage id="User" />,
                    type: 'collapse',
                    // url: '/users',
                    icon: '',
                    breadcrumbs: false,
                    children: [
                        {
                            id: 'user',
                            title: <FormattedMessage id="Users List" />,
                            type: 'item',
                            url: '/users',
                            icon: '',
                            breadcrumbs: false,
                            access: 'read_user'
                        },
                        {
                            id: 'usermap',
                            title: <FormattedMessage id="User Customer Mapping" />,
                            type: 'item',
                            url: '/user/customer/map',
                            icon: '',
                            breadcrumbs: false,
                            access: 'read_user_customer'
                        },
                        {
                            id: 'userlocationmap',
                            title: <FormattedMessage id="User Location Mapping" />,
                            type: 'item',
                            url: '/user/location/map',
                            icon: '',
                            breadcrumbs: false,
                            access: 'read_user_location'
                        }
                    ]
                },
                {
                    id: 'customera',
                    title: <FormattedMessage id="Customer" />,
                    type: 'collapse',
                    // url: '/admin/customer',
                    icon: '',
                    breadcrumbs: false,
                    children: [
                        {
                            id: 'customer',
                            title: <FormattedMessage id="Customer List" />,
                            type: 'item',
                            url: '/admin/customer',
                            icon: '',
                            breadcrumbs: false,
                            access: 'read_customer'
                        },
                        {
                            id: 'customermap',
                            title: <FormattedMessage id="Customer Product Mapping" />,
                            type: 'item',
                            url: '/admin/customer/map',
                            icon: '',
                            breadcrumbs: false,
                            access: 'read_customer_product'
                        }
                    ]
                },
                {
                    id: 'category',
                    title: <FormattedMessage id="Category" />,
                    type: 'item',
                    url: '/category',
                    icon: '',
                    breadcrumbs: false
                },
                {
                    id: 'product',
                    title: <FormattedMessage id="Product" />,
                    type: 'item',
                    url: '/admin/products',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_product'
                },
                {
                    id: 'yard',
                    title: <FormattedMessage id="Yard" />,
                    type: 'item',
                    url: '/admin/yards',
                    icon: '',
                    breadcrumbs: false,
                    access: 'read_yard'
                },
                {
                    id: 'dispatch',
                    title: <FormattedMessage id="Dispatch Type" />,
                    type: 'item',
                    url: '/admin/dispatch/type',
                    icon: '',
                    breadcrumbs: false
                }
            ]
        }
    ]
};
export default master;
