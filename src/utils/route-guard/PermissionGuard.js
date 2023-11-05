import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { dispatch } from 'store';
import { getUserPermissions } from 'store/slices/permissions';
import { useSelector } from 'react-redux';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Role Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 * @param {PropTypes.roles} children accepted roles
 */
const Permission = ({ children, access, route = false }) => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [hasPermission, setPermission] = useState(false);
    const { permissions } = useSelector((state) => state.permission);
    const CheckPerm = ['read_permission', 'create_permission'];

    useEffect(() => {
        if (user) {
            dispatch(getUserPermissions(user?.role.id));
        }
    }, [user, isLoggedIn, navigate]);

    useEffect(() => {
        if (!permissions.length && access && CheckPerm.includes(access)) setPermission(true);
        if (route && permissions.length && !permissions.includes(access)) navigate('/permission-denied');
        if (permissions.length && permissions.includes(access)) setPermission(true);
    }, [permissions]);

    return hasPermission ? children : '';
};

Permission.propTypes = {
    children: PropTypes.node
};

export default Permission;
