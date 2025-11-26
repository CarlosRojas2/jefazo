import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from '@/Template/Components/snackbar';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { usePage  } from '@inertiajs/react';
import { useEffect,useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SearchDocument from '@/Components/SearchDocument';
import { setFormData } from '@/Utils/setFormData';
import Grid from '@mui/material/Unstable_Grid2';
import api from '@/lib/axios';

export default function Form({ open,handleClose,initFormData,handleRefresh }){
    const theme = useTheme();
    const defaultForm={
        id:-1,
        full_names: '',
        dni:'',
        phone:'',
        address:''
    };

    // Estado del formulario
    const { errors } = usePage().props;
    const [form, setForm] = useState({ ...defaultForm });
    const [processing, setProcessing] = useState(false);

    const reset=()=>{
        setForm({ ...defaultForm });
    }

    // Función para actualizar campos individuales del formulario
    const setData = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Effect para llenar el formulario cuando se pasa initFormData
    useEffect(() => {
        if (initFormData !== null) {
            setFormData(setData, defaultForm, initFormData);
        } else {
            reset();
        }
    }, [initFormData]);

    // Limpiar errores cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        api.post(route('customers.store'), form)
        .then((res) => {
            const customer = res.data;
            toast.success('Datos guardados con éxito!');
            // Llamar a handleRefresh
            if (handleRefresh) {
                handleRefresh(customer);
            }

            handleClose();
        })
        .catch(({ response }) => {
            if (response?.status === 422) {
                const { errors } = response.data;
                for (const msgs of Object.values(errors)) {
                    toast.error(msgs[0]);
                }
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        }).finally(() => setProcessing(false));
    };

    const handleSearchDni = (response)=>{
        setData('dni',response);
    };

    const setSearchDni = (response)=>{
        setData('full_names',response.name);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            disableEscapeKeyDown={false}
            transitionDuration={{
                enter: theme.transitions.duration.shortest,
                exit: theme.transitions.duration.shortest - 80,
            }}
            PaperProps={{
                sx: {
                    display: 'flex',
                    overflow: 'hidden',
                    flexDirection: 'column',
                    '& form': { minHeight: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' },
                },
            }}
            sx={{alignSelf: 'flex-start'}}
        >
            <DialogTitle sx={{ minHeight: 30,height:30,py:1 }}>
                {form.id>0 ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                {/* <Scrollbar fillContent sx={{ px: 3 }}> */}
                    <Stack spacing={3} sx={{px:3, pb:2}}>
                        <Grid container spacing={1} sx={{pt:1}}>
                            <Grid xs={12} md={12} lg={12}>
                                <SearchDocument
                                    label="Dni"
                                    value={form.dni}
                                    path="dni.search"
                                    autofocus={true}
                                    onChange={handleSearchDni}
                                    onSearch={setSearchDni}
                                    from='dni'
                                    error={errors.dni}
                                    helperText={errors.dni}
                                ></SearchDocument>
                            </Grid>

                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Nombres"
                                    name="full_names"
                                    value={form.full_names}
                                    onChange={e => setData('full_names', e.target.value)}
                                    error={errors.full_names?true:false}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Dirección"
                                    name="address"
                                    value={form.address}
                                    onChange={e => setData('address', e.target.value)}
                                    error={errors.address?true:false}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Teléfono"
                                    name="phone"
                                    value={form.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    error={errors.phone?true:false}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                {/* </Scrollbar> */}
                <DialogActions sx={{py:1,px:3}}>
                    <Button color="error" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleSubmit}
                        type="submit"
                        variant="contained"
                        loading={processing}
                        disabled={processing}
                        color="primary"
                    >
                        Guardar
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}
