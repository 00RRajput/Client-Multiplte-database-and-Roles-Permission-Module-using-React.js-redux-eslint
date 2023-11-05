import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// maintenance routing
const MaintenanceError = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const MaintenanceComingSoon1 = Loadable(lazy(() => import('views/pages/maintenance/ComingSoon/ComingSoon1')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('views/pages/maintenance/ComingSoon/ComingSoon2')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('views/pages/maintenance/UnderConstruction')));

// landing & contact-us routing
const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const PagesContactUS = Loadable(lazy(() => import('views/pages/contact-us')));
const PagesFaqs = Loadable(lazy(() => import('views/pages/saas-pages/Faqs')));
const PagesPrivacyPolicy = Loadable(lazy(() => import('views/pages/saas-pages/PrivacyPolicy')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/pages/error',
            element: <MaintenanceError />
        },
        {
            path: '/pages/coming-soon1',
            element: <MaintenanceComingSoon1 />
        },
        {
            path: '/pages/coming-soon2',
            element: <MaintenanceComingSoon2 />
        },
        {
            path: '/pages/under-construction',
            element: <MaintenanceUnderConstruction />
        },

        {
            path: '/pages/landing',
            element: <PagesLanding />
        },
        {
            path: '/pages/contact-us',
            element: <PagesContactUS />
        },
        {
            path: '/pages/faqs',
            element: <PagesFaqs />
        },
        {
            path: '/pages/privacy-policy',
            element: <PagesPrivacyPolicy />
        }
    ]
};

export default AuthenticationRoutes;
