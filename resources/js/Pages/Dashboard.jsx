import { Head,usePage } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import { Iconify } from '@/Template/Components/iconify';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { SvgColor } from '@/Template/Components/svg-color';
import Grid from '@mui/material/Unstable_Grid2';
import { varAlpha, bgGradient } from '@/Theme/styles';
const Dashboard = ()=>{
    const theme = useTheme();
    const color='primary';
    const { customers, ingresados, revisados, totalOrdenes } = usePage().props;


    return (
        <DashboardContent>
            <Head title="Dashboard" />
            <Grid container spacing={3}>
                {/* Tarjeta de Clientes */}
                <Grid xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            ...bgGradient({
                                color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
                            }),
                            p: 3,
                            boxShadow: 'none',
                            position: 'relative',
                            color: `${color}.darker`,
                            backgroundColor: 'common.white',
                        }}
                    >
                        <Box sx={{ width: 48, height: 48, mb: 3 }}>
                            <img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />
                        </Box>

                        <Box
                            sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            }}
                        >
                            <Box sx={{ flexGrow: 1, minWidth: 112 }}>
                                <Box sx={{ mb: 1, typography: 'subtitle2' }}>Clientes</Box>
                                <Box sx={{ typography: 'h4' }}>{customers}</Box>
                            </Box>
                        </Box>

                        <SvgColor
                            src="/assets/background/shape-square.svg"
                            sx={{
                            top: 0,
                            left: -20,
                            width: 240,
                            zIndex: -1,
                            height: 240,
                            opacity: 0.24,
                            position: 'absolute',
                            color: `${color}.main`,
                            }}
                        />

                    </Card>
                </Grid>

                {/* Tarjeta de Órdenes Ingresadas */}
                <Grid xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            ...bgGradient({
                                color: `135deg, ${varAlpha(theme.vars.palette.warning.lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette.warning.lightChannel, 0.48)}`,
                            }),
                            p: 3,
                            boxShadow: 'none',
                            position: 'relative',
                            color: 'warning.darker',
                            backgroundColor: 'common.white',
                        }}
                    >
                        <Box sx={{ width: 48, height: 48, mb: 3 }}>
                            <img alt="icon" src="/assets/icons/glass/ic-document.svg" />
                        </Box>

                        <Box
                            sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            }}
                        >
                            <Box sx={{ flexGrow: 1, minWidth: 112 }}>
                                <Box sx={{ mb: 1, typography: 'subtitle2' }}>Ingresadas</Box>
                                <Box sx={{ typography: 'h4' }}>{ingresados}</Box>
                            </Box>
                        </Box>

                        <SvgColor
                            src="/assets/background/shape-square.svg"
                            sx={{
                            top: 0,
                            left: -20,
                            width: 240,
                            zIndex: -1,
                            height: 240,
                            opacity: 0.24,
                            position: 'absolute',
                            color: 'warning.main',
                            }}
                        />

                    </Card>
                </Grid>

                {/* Tarjeta de Órdenes Revisadas */}
                <Grid xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            ...bgGradient({
                                color: `135deg, ${varAlpha(theme.vars.palette.success.lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette.success.lightChannel, 0.48)}`,
                            }),
                            p: 3,
                            boxShadow: 'none',
                            position: 'relative',
                            color: 'success.darker',
                            backgroundColor: 'common.white',
                        }}
                    >
                        <Box sx={{ width: 48, height: 48, mb: 3 }}>
                            <img alt="icon" src="/assets/icons/glass/ic-document.svg" />
                        </Box>

                        <Box
                            sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            }}
                        >
                            <Box sx={{ flexGrow: 1, minWidth: 112 }}>
                                <Box sx={{ mb: 1, typography: 'subtitle2' }}>Revisadas</Box>
                                <Box sx={{ typography: 'h4' }}>{revisados}</Box>
                            </Box>
                        </Box>

                        <SvgColor
                            src="/assets/background/shape-square.svg"
                            sx={{
                            top: 0,
                            left: -20,
                            width: 240,
                            zIndex: -1,
                            height: 240,
                            opacity: 0.24,
                            position: 'absolute',
                            color: 'success.main',
                            }}
                        />

                    </Card>
                </Grid>

                {/* Tarjeta de Total de Órdenes */}
                <Grid xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            ...bgGradient({
                                color: `135deg, ${varAlpha(theme.vars.palette.info.lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette.info.lightChannel, 0.48)}`,
                            }),
                            p: 3,
                            boxShadow: 'none',
                            position: 'relative',
                            color: 'info.darker',
                            backgroundColor: 'common.white',
                        }}
                    >
                        <Box sx={{ width: 48, height: 48, mb: 3 }}>
                            <img alt="icon" src="/assets/icons/glass/ic-document.svg" />
                        </Box>

                        <Box
                            sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            }}
                        >
                            <Box sx={{ flexGrow: 1, minWidth: 112 }}>
                                <Box sx={{ mb: 1, typography: 'subtitle2' }}>Total Órdenes</Box>
                                <Box sx={{ typography: 'h4' }}>{totalOrdenes}</Box>
                            </Box>
                        </Box>

                        <SvgColor
                            src="/assets/background/shape-square.svg"
                            sx={{
                            top: 0,
                            left: -20,
                            width: 240,
                            zIndex: -1,
                            height: 240,
                            opacity: 0.24,
                            position: 'absolute',
                            color: 'info.main',
                            }}
                        />

                    </Card>
                </Grid>

            </Grid>
        </DashboardContent>
    );
}
Dashboard.layout = page => <DashboardLayout children={page} title="Dashboard" />
export default Dashboard
