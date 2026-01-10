import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import Typography from '@mui/material/Typography';
import { Iconify } from '@/Template/Components/iconify';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { SvgColor } from '@/Template/Components/svg-color';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
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
                            <Iconify icon="hugeicons:document-validation-01" width={48} height={48} />
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
                            <Iconify icon="hugeicons:check-circle-02" width={48} height={48} />
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
                            <Iconify icon="hugeicons:document-details-02" width={48} height={48} />
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

                {/* Tabla de Resumen */}
                <Grid xs={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Resumen de Órdenes por Estado</Typography>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell align="center"><strong>Cantidad</strong></TableCell>
                                        <TableCell align="center"><strong>Porcentaje</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Chip label="INGRESADO" color="warning" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="center">{ingresados}</TableCell>
                                        <TableCell align="center">
                                            {totalOrdenes > 0 ? ((ingresados / totalOrdenes) * 100).toFixed(1) : 0}%
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Chip label="REVISADO" color="success" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="center">{revisados}</TableCell>
                                        <TableCell align="center">
                                            {totalOrdenes > 0 ? ((revisados / totalOrdenes) * 100).toFixed(1) : 0}%
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                                        <TableCell><strong>TOTAL</strong></TableCell>
                                        <TableCell align="center"><strong>{totalOrdenes}</strong></TableCell>
                                        <TableCell align="center"><strong>100%</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>

            </Grid>
        </DashboardContent>
    );
}
Dashboard.layout = page => <DashboardLayout children={page} title="Dashboard" />
export default Dashboard
