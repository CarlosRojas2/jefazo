import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import Typography from '@mui/material/Typography';
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
    const { customers } = usePage().props;


    return (
        <DashboardContent>
            <Head title="Dashboard" />
            <Grid container spacing={3}>
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
                            <img alt="icon" src="/storage/assets/icons/glass/ic-glass-users.svg" />
                        </Box>

                        <Box
                            sx={{
                                top: 16,
                                gap: 0.5,
                                right: 16,
                                display: 'flex',
                                position: 'absolute',
                                alignItems: 'center',
                            }}
                        >
                            <Iconify width={20} icon='eva:trending-down-fill' />
                            <Box component="span" sx={{ typography: 'subtitle2' }}>
                                algo
                            </Box>
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


            </Grid>
        </DashboardContent>
    );
}
Dashboard.layout = page => <DashboardLayout children={page} title="Dashboard" />
export default Dashboard
