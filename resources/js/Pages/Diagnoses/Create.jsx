import { Head } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useCallback, useState,useEffect } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { toast } from '@/Template/Components/snackbar';
import { useForm,usePage,router  } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
import SearchDocument from '@/Components/SearchDocument';
import DatePicker from '@/Components/DatePicker';

export default function Form() {
    const { data, setData, post, processing, errors } = useForm({
        id:-1,
        customer_id: '',
        vehicle_id: '',
        observations:'',
        reason:'',
    });
    const { diagnosis } = usePage().props;
    const [title,setTitle]=useState('Registrar Diagnóstico');
    const [vehicles,setVehicles]=useState([]);
    useEffect(()=>{
        if(diagnosis!==undefined){
            setForm();//para editar
            setTitle('Editar Diagnóstico');
        }
    },[diagnosis]);
    const setForm = ()=>{
        setFormData(data, diagnosis);
    }
    function handleSubmit(event) {
        event.preventDefault()
        post(route('diagnoses.store'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
            }
        })
    }
    const setCustomer = (customer_id,vehicles)=>{
        if(Array.isArray(vehicles) && vehicles.length > 0){
            console.log('vehicles',vehicles)
            setVehicles(vehicles);
            setData(old=>({...old,vehicle_id:vehicles[0].id}));
        }
        setData(old=>({...old,customer_id:customer_id}));
    }

    const handleBack = ()=>{
        router.visit(route('diagnoses.index'));
    }

    return (
        <DashboardLayout>
            <Head title='Diagnósticos'></Head>
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
                                            <PartialCustomer
                                                path='customers.search'
                                                id={data.id!=-1?data.customer_id:null}
                                                handleSet={setCustomer}
                                                error={errors.customer_id}
                                            >
                                            </PartialCustomer>
                                        </Grid>

                                        <Grid xs={12} md={2} lg={2}>
                                            <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
                                                <InputLabel>Vehículo</InputLabel>
                                                <Select
                                                    value={data.vehicle_id}
                                                    label="Vehiculo"
                                                    onChange={e => setData('vehicle_id', e.target.value)}
                                                    size='small'
                                                    error={errors.vehicle_id}
                                                >
                                                {vehicles.map((vehicle,index)=>(
                                                    <MenuItem key={index} value={vehicle.id}>
                                                        {vehicle.brand+' '+vehicle.model+' '+vehicle.color}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* <Grid xs={12} md={9} lg={9}>
                                            <TextField
                                                label="Razón social"
                                                name="company_name"
                                                value={data.company_name}
                                                onChange={e => setData('company_name', e.target.value)}
                                                error={errors.company_name?true:false}
                                                size="small"
                                                fullWidth
                                                inputRef={companynameRef}
                                            />
                                        </Grid> */}



                                        {/* <Grid xs={6} md={2} lg={2}>
                                            <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
                                                <InputLabel>Género</InputLabel>
                                                <Select
                                                    value={data.gender}
                                                    label="Género"
                                                    onChange={e => setData('gender', e.target.value)}
                                                    size='small'
                                                    error={errors.gender}
                                                >
                                                    <MenuItem value={1}>Masculino</MenuItem>
                                                    <MenuItem value={2}>Femenino</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid> */}

                                        <Grid xs={6} md={2} lg={2}>
                                            <DatePicker></DatePicker>
                                        </Grid>
                                    </Grid>

                                </Box>
                                <Stack alignItems="flex-end" sx={{ mt: 3}}>
                                    <LoadingButton color='primary' type="submit" size='normal' variant="contained" loading={processing}>
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
