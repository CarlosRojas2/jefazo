import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useCallback, useState,useEffect,useMemo } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import PartialService  from '@/Pages/Partials/PartialService';
import PartialArticle  from '@/Pages/Partials/PartialArticle';
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
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import { format,parse } from 'date-fns';
import { setFormData } from '@/Utils/functions';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

export default function Form() {
    const { data, setData, post, processing, errors } = useForm({
        id:-1,
        status:'REVISADO',
        services:[],
        articles:[]
    });
    const { repair_order } = usePage().props;
    const [title,setTitle]=useState('');
    
    // Calcular el total de la proforma
    const totalAmount = useMemo(() => {
        return data.articles.reduce((sum, article) => {
            const quantity = parseFloat(article.quantity) || 0;
            const price = parseFloat(article.price) || 0;
            return sum + (quantity * price);
        }, 0);
    }, [data.articles]);

    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Orden de reparación - '+ repair_order.correlative);
        }
    }, [repair_order]);
    
    const setForm = ()=>{
        setFormData(data, repair_order);
        let services =[];
        data.services.forEach((service)=>{
            services.push({
                id:service.id,
                service:service.description,
                observations:service.pivot.observations
            });
        });
        let articles =[];
        data.articles.forEach((article)=>{
            articles.push({
                id:article.id,
                article:article.description,
                quantity:article.pivot.quantity,
                price:article.pivot.price || article.price || 0 // Obtener precio del pivot o del artículo
            });
        });
        setData(old=>({...old,services:services,articles:articles}));
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        if(data.status!='REVISADO'){
            toast.error('El estado debe ser REVISADO para continuar.');
            return;
        }
        post(route('repair_orders.diagnose'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
            }
        })
    }

    const handleBack = ()=>{
        router.visit(route('repair_orders.index'));
    }

    const setService=(service)=>{
        if(!service){
            return;
        }
        const found = data.services.find((item)=>{
            return (item.id==service.id);
        });
        if(found!=undefined){
            toast.warning('El servicio ya fue agregado!');
            return;
        }
        const newData = {...data};
        newData.services.push({
            id:service.id,
            service:service.description,
            observations:''
        });
        setData(newData);
    }
    
    const handleRemoveService = (service)=>{
        const newData = {...data};
        newData.services.splice(newData.services.indexOf(service),1);
        setData(newData);
    };
    
    const handleObservations = (index, value) => {
        setData((prevState) => {
            const updatedServices = [...prevState.services];
            updatedServices[index] = {
                ...updatedServices[index],
                observations: value,
            };
            return { ...prevState, services: updatedServices };
        });
    };
    
    const setArticle=(article)=>{
        if(!article){
            return;
        }
        const found = data.articles.find((item)=>{
            return (item.id==article.id);
        });
        if(found!=undefined){
            toast.warning('La pieza ya fue agregada!');
            return;
        }
        const newData = {...data};
        newData.articles.push({
            id:article.id,
            article:article.description,
            quantity:1,
            price:article.price || 0 // Asegurarse de incluir el precio del artículo
        });
        setData(newData);
    }
    
    const handleQuantity = (index, value) => {
        setData((prevState) => {
            const updatedArticles = [...prevState.articles];
            updatedArticles[index] = {
                ...updatedArticles[index],
                quantity: value,
            };
            return { ...prevState, articles: updatedArticles };
        });
    };
    
    const handlePrice = (index, value) => {
        setData((prevState) => {
            const updatedArticles = [...prevState.articles];
            updatedArticles[index] = {
                ...updatedArticles[index],
                price: value,
            };
            return { ...prevState, articles: updatedArticles };
        });
    };
    
    const handleRemoveArticle = (article)=>{
        const newData = {...data};
        newData.articles.splice(newData.articles.indexOf(article),1);
        setData(newData);
    };
    
    return (
        <DashboardLayout>
            <Head title='Diagnosticar'></Head>
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
                                        <Grid xs={12} md={6} lg={6}>
                                            <Toolbar
                                                sx={[
                                                    {
                                                        pl: { sm: 2 },
                                                        pr: { xs: 1, sm: 1 },
                                                    }
                                                ]}
                                            >
                                                <Typography
                                                    sx={{ flex: '1 1 100%' }}
                                                    variant="h6"
                                                    id="tableTitle"
                                                    component="div"
                                                >
                                                    Servicios prestados
                                                </Typography>

                                                <PartialService
                                                    path='services.search'
                                                    handleSet={setService}
                                                ></PartialService>

                                            </Toolbar>
                                            <TableContainer sx={{ maxHeight: 220 }} component={Paper}>
                                                <Table stickyHeader aria-label="sticky table" size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ height: 10 }}>
                                                            <TableCell width='20%'>Descripción</TableCell>
                                                            <TableCell width='60%'>Observaciones</TableCell>
                                                            <TableCell width='1%' align="center"></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.services.map((service,index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 },mineight:10 }}
                                                            >
                                                                <TableCell sx={{py:0}}>
                                                                    <Typography variant="caption" display="block" gutterBottom>
                                                                        {service.service}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{py:1}}>
                                                                    <TextField
                                                                        value={service.observations}
                                                                        onChange={(e) => handleObservations(index, e.target.value)}
                                                                        size='small'
                                                                        key={index}
                                                                        fullWidth
                                                                        inputProps={{onFocus:(event)=>event.target.select()}}
                                                                        sx={{ '& .MuiInputBase-root': { height: 25,pa:0 } }}
                                                                    />
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
                                                                            onClick={()=>handleRemoveService(service)}
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

                                        <Grid xs={12} md={6} lg={6}>
                                            <Toolbar
                                                sx={[
                                                    {
                                                        pl: { sm: 2 },
                                                        pr: { xs: 1, sm: 1 },
                                                    }
                                                ]}
                                            >
                                                <Typography
                                                    sx={{ flex: '1 1 100%' }}
                                                    variant="h6"
                                                    id="tableTitle"
                                                    component="div"
                                                >
                                                    Piezas de reparación
                                                </Typography>
                                                <PartialArticle
                                                    path='articles.search'
                                                    handleSet={setArticle}
                                                ></PartialArticle>
                                            </Toolbar>
                                            <TableContainer sx={{ maxHeight: 220 }} component={Paper}>
                                                <Table stickyHeader aria-label="sticky table" size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ height: 10 }}>
                                                            <TableCell width='40%'>Descripción</TableCell>
                                                            <TableCell width='10%' align="right">Cant.</TableCell>
                                                            <TableCell width='15%' align="right">Precio</TableCell>
                                                            <TableCell width='15%' align="right">Subtotal</TableCell>
                                                            <TableCell width='1%' align="center"></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.articles.map((article,index) => (
                                                            <TableRow
                                                                key={article.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 },mineight:10 }}
                                                            >
                                                                <TableCell sx={{px:1,py:0}}>
                                                                    <Typography variant="caption" display="block" gutterBottom>
                                                                        {article.article}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{py:1,px:1}}>
                                                                    <TextField
                                                                        value={article.quantity}
                                                                        onChange={(e) => handleQuantity(index, e.target.value)}
                                                                        size='small'
                                                                        type="number"
                                                                        fullWidth
                                                                        inputProps={{
                                                                            onFocus:(event)=>event.target.select(),
                                                                            style: { textAlign: 'right' }
                                                                        }}
                                                                        sx={{ '& .MuiInputBase-root': { height: 27 } }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{py:1,px:1}}>
                                                                    <TextField
                                                                        value={article.price}
                                                                        onChange={(e) => handlePrice(index, e.target.value)}
                                                                        size='small'
                                                                        type="number"
                                                                        fullWidth
                                                                        inputProps={{
                                                                            onFocus:(event)=>event.target.select(),
                                                                            step: "0.01",
                                                                            style: { textAlign: 'right' }
                                                                        }}
                                                                        sx={{ '& .MuiInputBase-root': { height: 27 } }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="right" sx={{py:0,px:1}}>
                                                                    <Typography variant="caption" display="block">
                                                                        {((parseFloat(article.quantity) || 0) * (parseFloat(article.price) || 0)).toFixed(2)}
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
                                                                            onClick={()=>handleRemoveArticle(article)}
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
                                            
                                            {/* Total de la proforma */}
                                            <Box sx={{ mt: 2, px: 2 }}>
                                                <Divider sx={{ mb: 1 }} />
                                                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                                    <Typography variant="h6">
                                                        Total:
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        S/ {totalAmount.toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Grid>

                                        <Grid xs={12} md={2} lg={2}>
                                            <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
                                                <InputLabel>Estado</InputLabel>
                                                <Select
                                                    value={data.status}
                                                    label="Vehiculo"
                                                    onChange={e => setData('status', e.target.value)}
                                                    size='small'
                                                    error={errors.status}
                                                >
                                                {['INGRESADO','REVISADO'].map((status,index)=>(
                                                    <MenuItem key={index} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
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