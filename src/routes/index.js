import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'ui-component/Loadable';

import useAuth from 'hooks/useAuth';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const DashboardAdmin = Loadable(lazy(() => import('views/dashboard/admin')));
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/components/Login')));
const MaintenanceError = Loadable(lazy(() => import('views/pages/maintenance/Error')));
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { isLoggedIn, user } = useAuth();
    return useRoutes([LoginRoutes, AuthenticationRoutes, MainRoutes, { path: '*', element: <MaintenanceError /> }]);
}
