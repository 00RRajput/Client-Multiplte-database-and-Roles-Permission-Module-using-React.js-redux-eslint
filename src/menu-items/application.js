// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar, IconNfc } from '@tabler/icons';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            type: 'collapse',
            icon: icons.IconUserCheck,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'posts',
                    title: <FormattedMessage id="social-profile" />,
                    type: 'item',
                    url: '/user/social-profile/posts',
                    role: ['DEVELOPER']
                },
                {
                    id: 'account-profile',
                    title: <FormattedMessage id="account-profile" />,
                    type: 'collapse',
                    role: ['DEVELOPER'],
                    children: [
                        {
                            id: 'profile1',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/user/account-profile/profile1',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'profile2',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/user/account-profile/profile2',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'profile3',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 03
                                </>
                            ),
                            type: 'item',
                            url: '/user/account-profile/profile3',
                            role: ['DEVELOPER']
                        }
                    ]
                },
                {
                    id: 'user-card',
                    title: <FormattedMessage id="cards" />,
                    type: 'collapse',
                    role: ['DEVELOPER'],
                    children: [
                        {
                            id: 'card1',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/user/card/card1',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'card2',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/user/card/card2',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'card3',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 03
                                </>
                            ),
                            type: 'item',
                            url: '/user/card/card3',
                            role: ['DEVELOPER']
                        }
                    ]
                },
                {
                    id: 'user-list',
                    title: <FormattedMessage id="list" />,
                    type: 'collapse',
                    role: ['DEVELOPER'],
                    children: [
                        {
                            id: 'list1',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/user/list/list1',
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'list2',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/user/list/list2',
                            role: ['DEVELOPER']
                        }
                    ]
                }
            ]
        },
        {
            id: 'customer',
            title: <FormattedMessage id="customer" />,
            type: 'collapse',
            icon: icons.IconBasket,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'customer-list',
                    title: <FormattedMessage id="customer-list" />,
                    type: 'item',
                    url: '/customer/customer-list',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'order-list',
                    title: <FormattedMessage id="order-list" />,
                    type: 'item',
                    url: '/customer/order-list',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'create-invoice',
                    title: <FormattedMessage id="create-invoice" />,
                    type: 'item',
                    url: '/customer/create-invoice',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'order-details',
                    title: <FormattedMessage id="order-details" />,
                    type: 'item',
                    url: '/customer/order-details',
                    role: ['DEVELOPER']
                },
                {
                    id: 'product',
                    title: <FormattedMessage id="product" />,
                    type: 'item',
                    url: '/customer/product',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'product-review',
                    title: <FormattedMessage id="product-review" />,
                    type: 'item',
                    url: '/customer/product-review',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'chat',
            title: <FormattedMessage id="chat" />,
            type: 'item',
            icon: icons.IconMessages,
            url: '/app/chat',
            role: ['DEVELOPER']
        },
        {
            id: 'kanban',
            title: 'Kanban',
            type: 'item',
            icon: icons.IconLayoutKanban,
            url: '/app/kanban/board',
            role: ['DEVELOPER']
        },
        {
            id: 'mail',
            title: <FormattedMessage id="mail" />,
            type: 'item',
            icon: icons.IconMail,
            url: '/app/mail',
            role: ['DEVELOPER']
        },
        {
            id: 'calendar',
            title: <FormattedMessage id="calendar" />,
            type: 'item',
            url: '/app/calendar',
            icon: icons.IconCalendar,
            breadcrumbs: false,
            role: ['DEVELOPER']
        },
        {
            id: 'contact',
            title: <FormattedMessage id="contact" />,
            type: 'collapse',
            icon: icons.IconNfc,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'c-card',
                    title: <FormattedMessage id="cards" />,
                    type: 'item',
                    url: '/app/contact/c-card',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'c-list',
                    title: <FormattedMessage id="list" />,
                    type: 'item',
                    url: '/app/contact/c-list',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'e-commerce',
            title: <FormattedMessage id="e-commerce" />,
            type: 'collapse',
            icon: icons.IconBasket,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'products',
                    title: <FormattedMessage id="products" />,
                    type: 'item',
                    url: '/e-commerce/products',
                    role: ['DEVELOPER']
                },
                {
                    id: 'product-details',
                    title: <FormattedMessage id="product-details" />,
                    type: 'item',
                    url: '/e-commerce/product-details/1',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'product-list',
                    title: <FormattedMessage id="product-list" />,
                    type: 'item',
                    url: '/e-commerce/product-list',
                    breadcrumbs: false,
                    role: ['DEVELOPER']
                },
                {
                    id: 'checkout',
                    title: <FormattedMessage id="checkout" />,
                    type: 'item',
                    url: '/e-commerce/checkout',
                    role: ['DEVELOPER']
                }
            ]
        }
    ],
    role: ['DEVELOPER']
};

export default application;
