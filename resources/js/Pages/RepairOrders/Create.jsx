import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useState,useEffect } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { toast } from '@/Template/Components/snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import PartialCustomer from '@/Pages/Partials/PartialCustomer';
import DatePicker from '@/Components/DatePicker';
import Filepond from '@/Components/Filepond';
import { format,parse } from 'date-fns';
import { setFormData } from '@/Utils/functions';
import DigitalSignature from "@/Components/DigitalSignature";
export default function Form() {
    const { data, setData, post, processing, errors,transform } = useForm({
        id:-1,
        customer_id: '',
        vehicle_id: '',
        observations:'',
        problem:'',
        correlative:'..',
        entry_date_time: new Date(),
        status:'INGRESADO',
        images:[],
        signature:''
    });
    const { repair_order } = usePage().props;
    const [title,setTitle]=useState('Registrar Órden de reparación');
    const [vehicles,setVehicles]=useState([]);
    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Editar Órden de reparación');
        }
    }, [repair_order]);
    const setForm = ()=>{
        setFormData(data, repair_order);
        let images=[];
        repair_order.images.forEach(image => {
            images.push(image.path)
        });
        setData(old=>({...old,images:images}));
        setData(old=>({...old,entry_date_time:parse(repair_order.entry_date_time, "yyyy-MM-dd HH:mm:ss", new Date())}));
    }
    function handleSubmit(event) {
        event.preventDefault()
        console.log('data.signature',data.signature)
        if(data.signature==''){
            toast.warning('La firma del cliente es obligatorio!');
            return;
        }
        transform((data) => ({
            ...data,
            entry: data.entry_date_time ? format(data.entry_date_time, 'yyyy-MM-dd') : null
        }));
        post(route('repair_orders.store'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
            }
        })
    }
    const setCustomer = (customer_id,vehicles)=>{
        if(Array.isArray(vehicles) && vehicles.length > 0){
            setVehicles(vehicles);
            if(!repair_order){
                setData(old=>({...old,vehicle_id:vehicles[0].id}));
            }
        }else{
            setVehicles([]);
        }
        setData(old=>({...old,customer_id:customer_id}));
    }

    const handleBack = ()=>{
        router.visit(route('repair_orders.index'));
    }

    const setImages = (newImagePath) => {
        setData(old => {
            const currentImages = old.images || [];
            return {
                ...old,
                images: [...currentImages, newImagePath],
            };
        });
    };

    const handleSaveSignature = (signatureData) => {
        setData(old=>({...old,signature:signatureData}));
    };

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
                                            <PartialCustomer
                                                path='customers.search'
                                                id={repair_order?repair_order.customer_id:null}
                                                handleSet={setCustomer}
                                                error={errors.customer_id}
                                            >
                                            </PartialCustomer>
                                        </Grid>

                                        <Grid xs={12} md={3} lg={3}>
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
                                                        {vehicle.brand+' '+vehicle.model+' '+vehicle.color+' '+vehicle.plate}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid xs={6} md={2} lg={2}>
                                            <DatePicker
                                                value={data.entry_date_time}
                                                onChange={(newValue) => setData('entry_date_time', newValue)}
                                            >
                                            </DatePicker>
                                        </Grid>

                                        <Grid xs={6} md={3} lg={3}>
                                            <TextField
                                                label="Nro orden"
                                                value={data.correlative}
                                                name="correlative"
                                                onChange={e => setData('correlative', e.target.value)}
                                                size="small"
                                                fullWidth
                                                inputProps={{
                                                    readOnly: true,
                                                    style: { color: "blue" }, // Personalizar el texto del input
                                                }}
                                            />
                                        </Grid>

                                    </Grid>

                                    <Grid container spacing={1} sx={{pt:1}}>
                                        <Grid xs={12} md={12} lg={12}>
                                            <TextField
                                                label="Requerimiento del cliente"
                                                name="problem"
                                                value={data.problem}
                                                onChange={e => setData('problem', e.target.value)}
                                                error={errors.problem?true:false}
                                                size="small"
                                                fullWidth
                                                multiline
                                                maxRows={4}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} sx={{pt:1}}>
                                        <Grid xs={12} md={12} lg={12}>
                                            <TextField
                                                label="Observaciones"
                                                name="observations"
                                                value={data.observations}
                                                onChange={e => setData('observations', e.target.value)}
                                                error={errors.observations?true:false}
                                                size="small"
                                                fullWidth
                                                multiline
                                                maxRows={4}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} sx={{pt:1}}>
                                        <Grid xs={12} md={6} lg={6}>
                                            <Stack spacing={1} direction="row" alignItems="center">
                                                <Typography variant="h5"> Imagenes anexadas: </Typography>
                                            </Stack>
                                            {data.vehicle_id!==''?(
                                            <Filepond
                                                vehicle={data.vehicle_id}
                                                images={data.images}
                                                handleSet={setImages}
                                            ></Filepond>
                                            ):(
                                                <Typography variant="h5"> Seleccione un vehiculo para subir sus imagenes: </Typography>
                                            )}
                                        </Grid>
                                        <Grid xs={12} md={6} lg={6}>
                                            <Stack spacing={1} direction="row" alignItems="center">
                                                <Typography variant="h5"> Firma: </Typography>
                                            </Stack>
                                            {data.id==-1?(
                                                <DigitalSignature onSave={handleSaveSignature} />
                                            ):(
                                                <Card sx={{ maxWidth: 345 }}>
                                                    <CardMedia
                                                        sx={{ height: 140 }}
                                                        image={'/storage/'+data.signature}
                                                        title="green iguana"
                                                    />
                                                </Card>
                                            )}
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
