import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    console.log('isLoggedIn', isLoggedIn);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            console.log('called');
            // navigate(DASHBOARD_PATH[`${user?.role?.role}`.toLowerCase()], { replace: true });
            navigate('/yms/home', { replace: true });
            // console.log(navigate(DASHBOARD_PATH[`${user?.role?.role}`.toLowerCase()], { replace: true }));
        }
    }, [isLoggedIn, user, navigate]);
    // console.log('children', children);
    return children;
};

GuestGuard.propTypes = {
    children: PropTypes.node
};

export default GuestGuard;
