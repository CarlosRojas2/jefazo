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
import { Scrollbar } from '@/Template/Components/scrollbar';

export default function Form({ open,handleClose,initFormData,handleRefresh }){
    const theme = useTheme();
    const [title,setTitle]=useState('Registrar Clientes');
    const { reset, data, setData, post, processing, errors } = useForm({
        id:-1,
        full_name: ''
    });
    useMemo(()=>{
        if(initFormData!==null){
            setData(initFormData);
            setTitle('Editar Cliente');
        }else{
            reset();
            setTitle('Registrar Cliente');
        }
    },[initFormData]);

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

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
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
                <Scrollbar sx={{ p: 2 }}>
                    <Stack spacing={1}>
                        <TextField
                            autoFocus={true}
                            label="Nombres"
                            name="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            error={errors.description?true:false}
                            size="small"
                        />
                    </Stack>
                </Scrollbar>
                <DialogActions sx={{py:1}}>
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
