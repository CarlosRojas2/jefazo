import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from '@/Template/Components/snackbar';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm  } from '@inertiajs/react';
import { useMemo,useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import PartialCustomer  from '@/Pages/Partials/PartialCustomer';
export default function Form({ open,handleClose,initFormData,handleRefresh }){
    const theme = useTheme();
    const [title,setTitle]=useState('Registrar Vehículo');
    const { reset, data, setData, post, processing, errors } = useForm({
        id:-1,
        customer_id:'',
        brand:'',
        model:'',
        plate:'',
        color:''
    });
    useMemo(()=>{
        if(initFormData!==null){
            setData(initFormData);
            setTitle('Editar Vehículo');
        }else{
            reset();
            setTitle('Registrar Vehículo');
        }
    },[initFormData]);

    const setCustomer = (customer_id)=>{
        console.log('customer_id',customer_id)
        setData(old=>({...old,customer_id:customer_id}));
    }

    function handleSubmit(e) {
        e.preventDefault()
        post(route('vehicles.store'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
                reset();
                handleRefresh();
                handleClose();
            }
        })
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
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
                                <PartialCustomer
                                    path='customers.search'
                                    id={data.id!=-1?data.customer_id:null}
                                    handleSet={setCustomer}
                                    error={errors.customer_id}
                                >
                                </PartialCustomer>
                            </Grid>
                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Marca"
                                    name="brand"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    error={errors.brand?true:false}
                                    size="small"
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Modelo"
                                    name="model"
                                    value={data.model}
                                    onChange={e => setData('model', e.target.value)}
                                    error={errors.model?true:false}
                                    size="small"
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Placa"
                                    name="plate"
                                    value={data.plate}
                                    onChange={e => setData('plate', e.target.value)}
                                    error={errors.plate?true:false}
                                    size="small"
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid xs={12} md={12} lg={12}>
                                <TextField
                                    label="Color"
                                    name="color"
                                    value={data.color}
                                    onChange={e => setData('color', e.target.value)}
                                    error={errors.color?true:false}
                                    size="small"
                                    fullWidth
                                    autoFocus
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
