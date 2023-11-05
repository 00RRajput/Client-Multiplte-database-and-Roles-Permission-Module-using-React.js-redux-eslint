// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconClipboardCheck, IconPictureInPicture, IconForms, IconBorderAll, IconChartDots, IconStairsUp } from '@tabler/icons';

// constant
const icons = {
    IconClipboardCheck,
    IconPictureInPicture,
    IconForms,
    IconBorderAll,
    IconChartDots,
    IconStairsUp
};

// ==============================|| UI FORMS MENU ITEMS ||============================== //

const forms = {
    id: 'ui-forms',
    title: <FormattedMessage id="forms" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    role: ['DEVELOPER'],
    children: [
        {
            id: 'components',
            title: <FormattedMessage id="components" />,
            type: 'collapse',
            icon: icons.IconPictureInPicture,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'autocomplete',
                    title: <FormattedMessage id="autocomplete" />,
                    type: 'item',
                    url: '/components/autocomplete',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'button',
                    title: <FormattedMessage id="button" />,
                    type: 'item',
                    url: '/components/button',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'checkbox',
                    title: <FormattedMessage id="checkbox" />,
                    type: 'item',
                    url: '/components/checkbox',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'date-time',
                    title: <FormattedMessage id="date-time" />,
                    type: 'item',
                    url: '/components/date-time',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'radio',
                    title: <FormattedMessage id="radio" />,
                    type: 'item',
                    url: '/components/radio',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'slider',
                    title: <FormattedMessage id="slider" />,
                    type: 'item',
                    url: '/components/slider',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'switch',
                    title: <FormattedMessage id="switch" />,
                    type: 'item',
                    url: '/components/switch',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'text-field',
                    title: <FormattedMessage id="text-field" />,
                    type: 'item',
                    url: '/components/text-field',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'plugins',
            title: <FormattedMessage id="plugins" />,
            type: 'collapse',
            icon: icons.IconForms,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'frm-autocomplete',
                    title: <FormattedMessage id="autocomplete" />,
                    type: 'item',
                    url: '/forms/frm-autocomplete',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-mask',
                    title: <FormattedMessage id="mask" />,
                    type: 'item',
                    url: '/forms/frm-mask',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-clipboard',
                    title: <FormattedMessage id="clipboard" />,
                    type: 'item',
                    url: '/forms/frm-clipboard',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-recaptcha',
                    title: <FormattedMessage id="recaptcha" />,
                    type: 'item',
                    url: '/forms/frm-recaptcha',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-wysiwug',
                    title: <FormattedMessage id="wysiwug-editor" />,
                    type: 'item',
                    url: '/forms/frm-wysiwug',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-modal',
                    title: <FormattedMessage id="modal" />,
                    type: 'item',
                    url: '/forms/frm-modal',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-tooltip',
                    title: <FormattedMessage id="tooltip" />,
                    type: 'item',
                    url: '/forms/frm-tooltip',
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'layouts',
            title: 'Layouts',
            type: 'collapse',
            icon: icons.IconForms,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'frm-layouts',
                    title: <FormattedMessage id="layouts" />,
                    type: 'item',
                    url: '/forms/layouts/layouts',
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-multi-column-forms',
                    title: <FormattedMessage id="multi-column-forms" />,
                    type: 'item',
                    url: '/forms/layouts/multi-column-forms',
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-action-bar',
                    title: <FormattedMessage id="action-bar" />,
                    type: 'item',
                    url: '/forms/layouts/action-bar',
                    role: ['DEVELOPER']
                },
                {
                    id: 'frm-sticky-action-bar',
                    title: <FormattedMessage id="sticky-action-bar" />,
                    type: 'item',
                    url: '/forms/layouts/sticky-action-bar',
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'tables',
            title: <FormattedMessage id="table" />,
            type: 'collapse',
            icon: icons.IconBorderAll,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'tbl-basic',
                    title: <FormattedMessage id="table-basic" />,
                    type: 'item',
                    url: '/tables/tbl-basic',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-dense',
                    title: <FormattedMessage id="table-dense" />,
                    type: 'item',
                    url: '/tables/tbl-dense',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-enhanced',
                    title: <FormattedMessage id="table-enhanced" />,
                    type: 'item',
                    url: '/tables/tbl-enhanced',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-data',
                    title: <FormattedMessage id="table-data" />,
                    type: 'item',
                    url: '/tables/tbl-data',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-customized',
                    title: <FormattedMessage id="table-customized" />,
                    type: 'item',
                    url: '/tables/tbl-customized',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-sticky-header',
                    title: <FormattedMessage id="table-sticky-header" />,
                    type: 'item',
                    url: '/tables/tbl-sticky-header',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'tbl-collapse',
                    title: <FormattedMessage id="table-collapse" />,
                    type: 'item',
                    url: '/tables/tbl-collapse',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'charts',
            title: <FormattedMessage id="charts" />,
            type: 'collapse',
            icon: icons.IconChartDots,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'apexchart',
                    title: <FormattedMessage id="apexchart" />,
                    type: 'item',
                    url: '/forms/charts/apexchart',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'organization-chart',
                    title: <FormattedMessage id="organization-chart" />,
                    type: 'item',
                    url: '/forms/charts/orgchart',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'forms-validation',
            title: <FormattedMessage id="forms-validation" />,
            type: 'item',
            url: '/forms/forms-validation',
            icon: icons.IconClipboardCheck,
            role: ['DEVELOPER']
        },
        {
            id: 'forms-wizard',
            title: <FormattedMessage id="forms-wizard" />,
            type: 'item',
            url: '/forms/forms-wizard',
            icon: icons.IconStairsUp,
            role: ['DEVELOPER']
        }
    ]
};

export default forms;
