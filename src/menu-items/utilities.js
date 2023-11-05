// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconBrandFramer,
    IconLayoutGridAdd
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: <FormattedMessage id="utilities" />,
    icon: icons.IconTypography,
    type: 'group',
    role: ['DEVELOPER'],
    children: [
        {
            id: 'util-typography',
            title: <FormattedMessage id="typography" />,
            type: 'item',
            url: '/utils/util-typography',
            icon: icons.IconTypography,
            breadcrumbs: false,
            role: ['DEVELOPER']
        },
        {
            id: 'util-color',
            title: <FormattedMessage id="color" />,
            type: 'item',
            url: '/utils/util-color',
            icon: icons.IconPalette,
            breadcrumbs: false,
            role: ['DEVELOPER']
        },
        {
            id: 'util-shadow',
            title: <FormattedMessage id="shadow" />,
            type: 'item',
            url: '/utils/util-shadow',
            icon: icons.IconShadow,
            breadcrumbs: false,
            role: ['DEVELOPER']
        },
        {
            id: 'icons',
            title: <FormattedMessage id="icons" />,
            type: 'collapse',
            icon: icons.IconWindmill,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'tabler-icons',
                    title: <FormattedMessage id="tabler-icons" />,
                    type: 'item',
                    url: 'https://tabler-icons.io/',
                    external: true,
                    target: true,
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'material-icons',
                    title: <FormattedMessage id="material-icons" />,
                    type: 'item',
                    url: 'https://mui.com/material-ui/material-icons/#main-content',
                    external: true,
                    target: true,
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'util-animation',
            title: <FormattedMessage id="animation" />,
            type: 'item',
            url: '/utils/util-animation',
            icon: icons.IconBrandFramer,
            breadcrumbs: false,
            role: ['DEVELOPER']
        },
        {
            id: 'util-grid',
            title: <FormattedMessage id="grid" />,
            type: 'item',
            url: '/utils/util-grid',
            icon: icons.IconLayoutGridAdd,
            breadcrumbs: false,
            role: ['DEVELOPER']
        }
    ]
};

export default utilities;
