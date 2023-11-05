// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrush, IconTools } from '@tabler/icons';

// constant
const icons = {
    IconBrush,
    IconTools
};

// ==============================|| UI ELEMENTS MENU ITEMS ||============================== //

const elements = {
    id: 'ui-element',
    title: <FormattedMessage id="ui-element" />,
    icon: icons.IconBrush,
    type: 'group',
    role: ['DEVELOPER'],
    children: [
        {
            id: 'basic',
            title: <FormattedMessage id="basic" />,
            caption: <FormattedMessage id="basic-caption" />,
            type: 'collapse',
            icon: icons.IconBrush,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'accordion',
                    title: <FormattedMessage id="accordion" />,
                    type: 'item',
                    url: '/basic/accordion',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'avatar',
                    title: <FormattedMessage id="avatar" />,
                    type: 'item',
                    url: '/basic/avatar',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'badges',
                    title: <FormattedMessage id="badges" />,
                    type: 'item',
                    url: '/basic/badges',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'breadcrumb',
                    title: <FormattedMessage id="breadcrumb" />,
                    type: 'item',
                    url: '/basic/breadcrumb',
                    role: ['DEVELOPER']
                },
                {
                    id: 'cards',
                    title: <FormattedMessage id="cards" />,
                    type: 'item',
                    url: '/basic/cards',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'chip',
                    title: <FormattedMessage id="chip" />,
                    type: 'item',
                    url: '/basic/chip',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'list',
                    title: <FormattedMessage id="list" />,
                    type: 'item',
                    url: '/basic/list',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tabs',
                    title: <FormattedMessage id="tabs" />,
                    type: 'item',
                    url: '/basic/tabs',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'advance',
            title: <FormattedMessage id="advance" />,
            type: 'collapse',
            icon: icons.IconTools,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'alert',
                    title: <FormattedMessage id="alert" />,
                    type: 'item',
                    url: '/advance/alert',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'dialog',
                    title: <FormattedMessage id="dialog" />,
                    type: 'item',
                    url: '/advance/dialog',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'pagination',
                    title: <FormattedMessage id="pagination" />,
                    type: 'item',
                    url: '/advance/pagination',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'progress',
                    title: <FormattedMessage id="progress" />,
                    type: 'item',
                    url: '/advance/progress',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'rating',
                    title: <FormattedMessage id="rating" />,
                    type: 'item',
                    url: '/advance/rating',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'snackbar',
                    title: <FormattedMessage id="snackbar" />,
                    type: 'item',
                    url: '/advance/snackbar',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'skeleton',
                    title: <FormattedMessage id="skeleton" />,
                    type: 'item',
                    url: '/advance/skeleton',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'speeddial',
                    title: <FormattedMessage id="speeddial" />,
                    type: 'item',
                    url: '/advance/speeddial',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'timeline',
                    title: <FormattedMessage id="timeline" />,
                    type: 'item',
                    url: '/advance/timeline',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'toggle-button',
                    title: <FormattedMessage id="toggle-button" />,
                    type: 'item',
                    url: '/advance/toggle-button',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'treeview',
                    title: <FormattedMessage id="treeview" />,
                    type: 'item',
                    url: '/advance/treeview',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        }
    ]
};

export default elements;
