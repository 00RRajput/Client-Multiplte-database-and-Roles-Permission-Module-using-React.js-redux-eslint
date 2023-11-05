import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/components/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/components/Register')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/components/ForgotPassword')));
const CardUploadDocs = Loadable(lazy(() => import('views/forms/documents/CardUploadDocs')));
const Terms = Loadable(lazy(() => import('views/pages/authentication/components/Terms')));
const SeaRegister = Loadable(lazy(() => import('views/pages/authentication/auth-forms/SeaRegister')));
const AirRegister = Loadable(lazy(() => import('views/pages/authentication/auth-forms/AirRegister')));
const DashboardAdmin = Loadable(lazy(() => import('views/dashboard/admin')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <AuthLogin />
        },
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        },
        {
            path: '/document/upload',
            element: <CardUploadDocs />
        },
        {
            path: '/document/uploadtest',
            element: <CardUploadDocs />
        },
        {
            path: '/terms',
            element: <Terms />
        }
    ]
};

export default LoginRoutes;
