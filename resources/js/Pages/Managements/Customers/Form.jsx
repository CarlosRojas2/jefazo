import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from '@/Template/Components/snackbar';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm  } from '@inertiajs/react';
import { useEffect,useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SearchDocument from '@/Components/SearchDocument';
import Grid from '@mui/material/Unstable_Grid2';

export default function Form({ open,handleClose,initFormData,handleRefresh }){
    const theme = useTheme();
    const [title,setTitle]=useState('Registrar Clientes');
    const { reset, data, setData, post, processing, errors,clearErrors } = useForm({
        id:-1,
        full_names: '',
        dni:'',
        phone:'',
        address:''
    });
    useEffect(() => {
        if (open) {
            if (initFormData !== null) {
                setData(initFormData);
                setTitle('Editar Cliente');
            } else {
                reset();
                setTitle('Registrar Cliente');
            }
            clearErrors(); // Limpiar errores al abrir
        }
    }, [open, initFormData]);

    // Limpiar formulario al cerrar
    const handleModalClose = () => {
        reset();
        clearErrors();
        handleClose();
    };

    function handleSubmit(e) {
        e.preventDefault()
        post(route('customers.store'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
                reset();
                handleRefresh();
                handleClose();
            }
        })
    }

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
            onClose={handleModalClose}
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
            <DialogTitle sx={{ minHeight: 30,height:30,py:1 }}>{title}</DialogTitle>
            <form onSubmit={handleSubmit}>
                {/* <Scrollbar fillContent sx={{ px: 3 }}> */}
                    <Stack spacing={3} sx={{px:3, pb:2}}>
                        <Grid container spacing={1} sx={{pt:1}}>
                            <Grid xs={12} md={12} lg={12}>
                                <SearchDocument
                                    label="Dni"
                                    value={data.dni}
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
                                    value={data.full_names}
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
                                    value={data.address}
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
                                    value={data.phone}
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
                    <Button color="error" onClick={handleModalClose}>
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
