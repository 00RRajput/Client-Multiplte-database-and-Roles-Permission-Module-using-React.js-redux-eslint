import { memo, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';

// project imports
import useAuth from '../../../hooks/useAuth';
import menuItem from 'menu-items';
import NavGroup from './NavGroup';
import useConfig from 'hooks/useConfig';
import { Menu } from 'menu-items/widget';
import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useDispatch, useSelector } from 'store';
import { getConfigurationMenu } from 'store/slices/configuration';
import { getUserPermissions } from 'store/slices/permissions';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const { layout } = useConfig();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const { configMenuList } = useSelector((state) => state.configuration);
    const { permissions } = useSelector((state) => state.permission);

    useEffect(() => {
        dispatch(getConfigurationMenu());
        if (user?.role.id.length) dispatch(getUserPermissions(user?.role.id, 'menu'));
    }, []);

    const getMenu = Menu();

    const handlerMenuItem = () => {
        const isFound = menuItem.items.some((element) => {
            if (element.id === 'widget') {
                return true;
            }
            return false;
        });

        if (getMenu?.id !== undefined && !isFound) {
            menuItem.items.splice(1, 0, getMenu);
        }
    };

    useEffect(() => {
        handlerMenuItem();
    }, [configMenuList, permissions]);

    if (configMenuList?.id !== undefined) {
        let isExists = true;
        menuItem.items.forEach((item) => {
            if (item.id === configMenuList.id) isExists = false;
        });
        if (isExists) menuItem.items.splice(2, 0, configMenuList);
    }

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menuItem.items.length - 1;
    let remItems = [];
    let lastItemId;

    if (lastItem && lastItem < menuItem.items.length) {
        lastItemId = menuItem.items[lastItem - 1].id;
        lastItemIndex = lastItem - 1;
        remItems = menuItem.items.slice(lastItem - 1, menuItem.items.length).map((item) => ({
            title: item.title,
            elements: item.children
        }));
    }

    const navItems = menuItem.items.slice(0, lastItemIndex + 1).map((item) => {
        let hasPermission;
        if (item?.access) hasPermission = permissions.includes(item?.access);
        else if (item.role)
            hasPermission =
                user &&
                user.role &&
                user.role.role.length &&
                item.role.length &&
                user.role.role.some((element) => item.role.includes(element));
        else hasPermission = true;

        if (!hasPermission) return <Typography key={item.id} variant="h6" color="error" align="center" />;

        switch (item.type) {
            case 'group':
                return (
                    <NavGroup
                        key={item.id}
                        item={item}
                        lastItem={lastItem}
                        remItems={remItems}
                        lastItemId={lastItemId}
                        permissions={permissions}
                    />
                );
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });
    return <>{navItems}</>;
};

export default memo(MenuList);
