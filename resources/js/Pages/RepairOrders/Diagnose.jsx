import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useCallback, useState,useEffect,useMemo } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { toast } from '@/Template/Components/snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import PartialCustomer from '@/Pages/Partials/PartialCustomer';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import DatePicker from '@/Components/DatePicker';
import { format,parse } from 'date-fns';
import { setFormData } from '@/Utils/functions';
export default function Form() {
    const { data, setData, post, processing, errors } = useForm({
        id:-1,
        status:'REVISADO',
        services:[]
    });
    const { repair_order } = usePage().props;
    const [title,setTitle]=useState('');
    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Orden de reparación - '+ repair_order.correlative);
        }
    }, [repair_order]);
    const setForm = ()=>{
        setFormData(data, repair_order);
    }
    function handleSubmit(event) {
        event.preventDefault()
        post(route('repair_orders.diagnose'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
            }
        })
    }

    const handleBack = ()=>{
        router.visit(route('repair_orders.index'));
    }

    return (
        <DashboardLayout>
            <Head title='Registrar Órden de reparación'></Head>
            <DashboardContent>
                <Stack
                    spacing={1.5}
                    direction="row"
                    sx={{pb:2}}
                    alignItems="flex-start"
                >
                    <IconButton onClick={handleBack}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>
                    <Stack spacing={0.5}>
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography variant="h4"> {title} </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <Grid container spacing={1}>
                    <Grid xs={12} md={12}>
                        <Card sx={{ p: 2 }}>
                            <form onSubmit={handleSubmit}>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                    }}
                                >
                                    <Grid container spacing={1} sx={{pt:0}}>
                                        <Grid xs={12} md={4} lg={4}>
                                            {repair_order.customer.full_names}
                                        </Grid>

                                        <Grid xs={12} md={3} lg={3}>
                                            {repair_order.vehicle.plate+' '+repair_order.vehicle.brand+' '+repair_order.vehicle.color}
                                        </Grid>

                                        <Grid xs={6} md={2} lg={2}>
                                            {repair_order.entry_date_time }
                                        </Grid>
                                        <Grid xs={6} md={3} lg={3}>
                                            {repair_order.correlative}
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} sx={{pt:1}}>
                                        <Grid xs={12} md={12} lg={12}>
                                        <TableContainer sx={{ maxHeight: 180 }} component={Paper}>
                                    <Table stickyHeader aria-label="sticky table" size="small">
                                        <TableHead>
                                            <TableRow sx={{ height: 10 }}>
                                                <TableCell width='10%'>Unidad de medida</TableCell>
                                                <TableCell width='6%'>Abreviación</TableCell>
                                                <TableCell width='5%' align="center">Cantidad</TableCell>
                                                <TableCell width='5%' align="center">Precio compra</TableCell>
                                                <TableCell width='5%' align="center"> % Utilidad</TableCell>
                                                <TableCell width='5%' align="center">Precio Venta</TableCell>
                                                <TableCell width='5%' align="center">Código Barra</TableCell>
                                                <TableCell width='1%' align="center"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.services.map((service,index) => (
                                                <TableRow
                                                    key={service.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 },mineight:10 }}
                                                >
                                                    <TableCell sx={{py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            prueba
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{px:1,py:0}}>
                                                        <Tooltip
                                                            title="Quitar"
                                                            placement="left"
                                                            slotProps={{
                                                                popper: {
                                                                    modifiers: [
                                                                        {
                                                                            name: 'offset',
                                                                            options: {
                                                                                offset: [0, -12]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }}>
                                                            <IconButton
                                                                aria-label="delete"
                                                                color="error"
                                                                size='small'
                                                            >
                                                                <Iconify icon="solar:trash-bin-trash-bold" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Stack alignItems="flex-end" sx={{ mt: 3}}>
                                    <LoadingButton color='primary' type="submit" size='normal' variant="contained" loading={processing} onClick={handleSubmit}>
                                        Guardar
                                    </LoadingButton>
                                </Stack>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </DashboardContent>
        </DashboardLayout>
    );
}
