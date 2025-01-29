import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
// import { usePathname } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';
import { varAlpha } from '@/Theme/styles';
import { Logo } from '@/Template/Components/logo';
import { Scrollbar } from '@/Template/Components/scrollbar';
// import { NavUpgrade } from '../components/nav-upgrade';

// import { WorkspacesPopover } from '../components/workspaces-popover';
// ----------------------------------------------------------------------
export function NavDesktop({
    sx,
    data,
    slots,
    workspaces,
    layoutQuery,
}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                pt: 2.5,
                px: 2.5,
                top: 0,
                left: 0,
                height: 1,
                display: 'none',
                position: 'fixed',
                flexDirection: 'column',
                bgcolor: 'var(--layout-nav-bg)',
                zIndex: 'var(--layout-nav-zIndex)',
                width: 'var(--layout-nav-vertical-width)',
                borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
                [theme.breakpoints.up(layoutQuery)]: {
                    display: 'flex',
                },
                ...sx,
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Box>
    );
}

// ----------------------------------------------------------------------

export function NavMobile({
    sx,
    data,
    open,
    slots,
    onClose,
    workspaces,
}) {
    // const pathname = usePathname();
    // useEffect(() => {
    //     if (open) {
    //         onClose();
    //     }
    // }, [pathname]);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    pt: 2.5,
                    px: 2.5,
                    overflow: 'unset',
                    bgcolor: 'var(--layout-nav-bg)',
                    width: 'var(--layout-nav-mobile-width)',
                    ...sx,
                },
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Drawer>
    );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }) {
    // const pathname = usePathname();
    return (
        <>
            <Logo />
            {slots?.topArea}
            {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} /> */}

            <Scrollbar fillContent>
                <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
                    <Box component="ul" gap={0.5} sx={{pl:0}} display="flex" flexDirection="column">
                        {data.map((item) => {
                            {/* const isActived = item.path === pathname; */}
                            const isActived = route().current(item.path) || route().current(`${item.path.split('.')[0]}.*`);
                            return (
                                <ListItem disableGutters disablePadding key={item.title}>
                                    <ListItemButton
                                        disableGutters
                                        component={Link} // Usar el componente Link de Inertia
                                        href={route(item.path)} // La ruta que apunta al backend con Inertia
                                        sx={{
                                            pl: 2,
                                            py: 1,
                                            gap: 2,
                                            pr: 1.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            fontWeight: 'fontWeightMedium',
                                            color: 'var(--layout-nav-item-color)',
                                            minHeight: 'var(--layout-nav-item-height)',
                                            ...(isActived && {
                                                fontWeight: 'fontWeightSemiBold',
                                                bgcolor: 'var(--layout-nav-item-active-bg)',
                                                color: 'var(--layout-nav-item-active-color)',
                                                '&:hover': {
                                                    bgcolor: 'var(--layout-nav-item-hover-bg)',
                                                },
                                            }),
                                        }}
                                    >
                                        <Box component="span" sx={{ width: 24, height: 24 }}>
                                            {item.icon}
                                        </Box>

                                        <Box component="span" flexGrow={1}>
                                            {item.title}
                                        </Box>

                                        {item.info && item.info}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </Box>
                </Box>
            </Scrollbar>

            {slots?.bottomArea}

            {/* <NavUpgrade /> */}
        </>
    );
}
