// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall, IconQuestionMark, IconShieldLock } from '@tabler/icons';

// constant
const icons = {
    IconKey,
    IconReceipt2,
    IconBug,
    IconBellRinging,
    IconPhoneCall,
    IconQuestionMark,
    IconShieldLock
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: <FormattedMessage id="pages" />,
    caption: <FormattedMessage id="pages-caption" />,
    icon: icons.IconKey,
    type: 'group',
    role: ['DEVELOPER'],
    children: [
        {
            id: 'price',
            title: <FormattedMessage id="pricing" />,
            type: 'collapse',
            icon: icons.IconReceipt2,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'price1',
                    title: (
                        <>
                            <FormattedMessage id="price" /> 01
                        </>
                    ),
                    type: 'item',
                    url: '/pages/price/price1',
                    role: ['DEVELOPER']
                },
                {
                    id: 'price2',
                    title: (
                        <>
                            <FormattedMessage id="price" /> 02
                        </>
                    ),
                    type: 'item',
                    url: '/pages/price/price2',
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'maintenance',
            title: <FormattedMessage id="maintenance" />,
            type: 'collapse',
            icon: icons.IconBug,
            role: ['DEVELOPER'],
            children: [
                {
                    id: 'error',
                    title: <FormattedMessage id="error-404" />,
                    type: 'item',
                    url: '/pages/error',
                    target: true,
                    role: ['DEVELOPER']
                },
                {
                    id: 'coming-soon',
                    title: <FormattedMessage id="coming-soon" />,
                    type: 'collapse',
                    role: ['DEVELOPER'],
                    children: [
                        {
                            id: 'coming-soon1',
                            title: (
                                <>
                                    <FormattedMessage id="coming-soon" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon1',
                            target: true,
                            role: ['DEVELOPER']
                        },
                        {
                            id: 'coming-soon2',
                            title: (
                                <>
                                    <FormattedMessage id="coming-soon" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon2',
                            target: true,
                            role: ['DEVELOPER']
                        }
                    ]
                },
                {
                    id: 'under-construction',
                    title: <FormattedMessage id="under-construction" />,
                    type: 'item',
                    url: '/pages/under-construction',
                    target: true,
                    role: ['DEVELOPER']
                }
            ]
        },
        {
            id: 'landing',
            title: <FormattedMessage id="landing" />,
            type: 'item',
            icon: icons.IconBellRinging,
            url: '/pages/landing',
            target: true,
            role: ['DEVELOPER']
        },
        {
            id: 'contact-us',
            title: <FormattedMessage id="contact-us" />,
            type: 'item',
            icon: icons.IconPhoneCall,
            url: '/pages/contact-us',
            target: true,
            role: ['DEVELOPER']
        },
        {
            id: 'faqs',
            title: <FormattedMessage id="faqs" />,
            type: 'item',
            icon: icons.IconQuestionMark,
            url: '/pages/faqs',
            target: true,
            role: ['DEVELOPER']
        },
        {
            id: 'privacy-policy',
            title: <FormattedMessage id="privacy-policy" />,
            type: 'item',
            icon: icons.IconShieldLock,
            url: '/pages/privacy-policy',
            target: true,
            role: ['DEVELOPER']
        }
    ]
};

export default pages;
