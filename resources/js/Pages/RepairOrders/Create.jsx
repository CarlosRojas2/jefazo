import { Head, useForm, usePage, router } from '@inertiajs/react';
import { DashboardLayout, DashboardContent } from '@/Layouts/dashboard';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import Card from '@mui/material/Card';
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
import { format, parse } from 'date-fns';
import { setFormData } from '@/Utils/functions';
import DigitalSignature from "@/Components/DigitalSignature";

export default function Form() {
    const { data, setData, post, processing, errors, transform } = useForm({
        id: -1,
        customer_id: '',
        vehicle_id: '',
        observations: '',
        problem: '',
        correlative: '..',
        entry_date_time: new Date(),
        status: 'INGRESADO',
        images: [],
        signature: ''
    });
    const { repair_order } = usePage().props;
    const [title, setTitle] = useState('Registrar Órden de reparación');
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Editar Órden de reparación');
        }
    }, [repair_order]);

    const setForm = () => {
        setFormData(data, repair_order);
        let images = [];
        
        // Asegurarse de extraer correctamente los paths
        if (repair_order.images && Array.isArray(repair_order.images)) {
            repair_order.images.forEach(image => {
                const imagePath = typeof image === 'string' ? image : image.path;
                images.push(imagePath);
            });
        }
        
        console.log('Imágenes cargadas del repair_order:', images);
        
        setData(old => ({ 
            ...old, 
            images: images,
            entry_date_time: parse(repair_order.entry_date_time, "yyyy-MM-dd HH:mm:ss", new Date())
        }));
    }

    function handleSubmit(event) {
        event.preventDefault()
        
        // Validaciones
        if (data.signature == '') {
            toast.warning('La firma del cliente es obligatoria!');
            return;
        }

        if (!data.customer_id) {
            toast.warning('Debe seleccionar un cliente!');
            return;
        }

        if (!data.vehicle_id) {
            toast.warning('Debe seleccionar un vehículo!');
            return;
        }

        if (!data.problem || data.problem.trim() === '') {
            toast.warning('Debe especificar el requerimiento del cliente!');
            return;
        }

        transform((data) => ({
            ...data,
            entry: data.entry_date_time ? format(data.entry_date_time, 'yyyy-MM-dd') : null
        }));

        post(route('repair_orders.store'), {
            onSuccess: () => {
                toast.success('Datos guardados con éxito!');
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
                toast.error('Error al guardar. Revise los campos.');
            }
        })
    }

    const setCustomer = (customer_id, vehicles) => {
        if (Array.isArray(vehicles) && vehicles.length > 0) {
            console.log('igual enytra')
            setVehicles(vehicles);
            if (!repair_order) {
                setData(old => ({ ...old, vehicle_id: vehicles[0].id }));
            }
        } else {
            setVehicles([]);
        }
        setData(old => ({ ...old, customer_id: customer_id }));
    }

    const handleBack = () => {
        router.visit(route('repair_orders.index'));
    }

    // Agregar nueva imagen al array
    const setImages = (newImagePath) => {
        console.log('Agregando nueva imagen:', newImagePath);
        setData(old => {
            const currentImages = old.images || [];
            // Evitar duplicados
            if (currentImages.includes(newImagePath)) {
                console.log('Imagen duplicada, no se agrega');
                return old;
            }
            const updatedImages = [...currentImages, newImagePath];
            console.log('Array actualizado de imágenes:', updatedImages);
            return {
                ...old,
                images: updatedImages,
            };
        });
    };

    // Remover imagen del array
    const removeImage = (imagePath) => {
        console.log('Removiendo imagen:', imagePath);
        setData(old => {
            const updatedImages = old.images.filter(img => img !== imagePath);
            return {
                ...old,
                images: updatedImages,
            };
        });
    };

    const handleSaveSignature = (signatureData) => {
        setData(old => ({ ...old, signature: signatureData }));
        toast.success('Firma guardada correctamente');
    };

    return (
        <DashboardLayout>
            <Head title='Registrar Órden de reparación'></Head>
            <DashboardContent>
                {/* HEADER FIJO */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1100,
                        backgroundColor: 'background.paper',
                        borderBottom: 1,
                        borderColor: 'divider',
                        pb: 2,
                        pt: 1,
                        mb: 2
                    }}
                >
                    <Stack
                        spacing={1.5}
                        direction="row"
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
                </Box>

                {/* CONTENIDO */}
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
                                    <Grid container spacing={1} sx={{ pt: 0 }}>
                                        <Grid xs={12} md={4} lg={4} sx={{ display: 'flex' }}>
                                            <PartialCustomer
                                                path='customers.search'
                                                id={repair_order ? repair_order.customer_id : null}
                                                handleSet={setCustomer}
                                                error={errors.customer_id}
                                            />
                                        </Grid>
                                        <Grid xs={12} md={3} lg={3}>
                                            <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
                                                <InputLabel>Vehículo *</InputLabel>
                                                <Select
                                                    value={data.vehicle_id}
                                                    label="Vehiculo *"
                                                    onChange={e => setData('vehicle_id', e.target.value)}
                                                    size='small'
                                                    error={errors.vehicle_id}
                                                    disabled={vehicles.length === 0}
                                                >
                                                    {vehicles.map((vehicle, index) => (
                                                        <MenuItem key={index} value={vehicle.id}>
                                                            {vehicle.brand + ' ' + vehicle.model + ' ' + vehicle.color + ' ' + vehicle.plate}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        

                                        <Grid xs={6} md={2} lg={2}>
                                            <DatePicker
                                                value={data.entry_date_time}
                                                onChange={(newValue) => setData('entry_date_time', newValue)}
                                            />
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
                                                    style: { color: "blue" },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} sx={{ pt: 1 }}>
                                        <Grid xs={12} md={12} lg={12}>
                                            <TextField
                                                label="Requerimiento del cliente (El cliente describe las fallas de su vehículo) *"
                                                name="problem"
                                                value={data.problem}
                                                onChange={e => setData('problem', e.target.value)}
                                                error={errors.problem ? true : false}
                                                helperText={errors.problem}
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} sx={{ pt: 1 }}>
                                        <Grid xs={12} md={12} lg={12}>
                                            <TextField
                                                label="Observaciones, el taller anota detalles adicionales"
                                                name="observations"
                                                value={data.observations}
                                                onChange={e => setData('observations', e.target.value)}
                                                error={errors.observations ? true : false}
                                                helperText={errors.observations}
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ pt: 2 }}>
                                        <Grid xs={12} md={6} lg={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Imágenes del vehículo ({data.images.length})
                                            </Typography>
                                            {(data.customer_id>0&&data.vehicle_id>0) ? (
                                                <Filepond
                                                    vehicle={data.vehicle_id}
                                                    images={data.images}
                                                    handleSet={setImages}
                                                    handleRemove={removeImage}
                                                />
                                            ) : (
                                                <Box 
                                                    sx={{ 
                                                        p: 3, 
                                                        border: '2px dashed', 
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        Seleccione un vehículo para subir imágenes
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Grid>

                                        <Grid xs={12} md={6} lg={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Firma del cliente *
                                            </Typography>
                                            {data.id == -1 ? (
                                                <DigitalSignature onSave={handleSaveSignature} />
                                            ) : (
                                                <Card sx={{ maxWidth: 400 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={'/storage/' + data.signature}
                                                        alt="Firma del cliente"
                                                        sx={{ objectFit: 'contain', p: 2 }}
                                                    />
                                                </Card>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </form>
                        </Card>
                    </Grid>
                </Grid>

                {/* FOOTER FIJO */}
                <Box
                    sx={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 1100,
                        backgroundColor: 'background.paper',
                        borderTop: 1,
                        borderColor: 'divider',
                        pt: 2,
                        pb: 2,
                        mt: 2
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleBack}
                            startIcon={<Iconify icon="openmoji:return" />}
                        >
                            Atrás
                        </Button>
                        <LoadingButton
                            color='primary'
                            variant="contained"
                            loading={processing}
                            onClick={handleSubmit}
                            startIcon={<Iconify icon="eva:save-fill" />}
                        >
                            Guardar Orden
                        </LoadingButton>
                    </Stack>
                </Box>
            </DashboardContent>
        </DashboardLayout>
    );
}