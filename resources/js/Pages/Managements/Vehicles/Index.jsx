import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import { toast } from '@/Template/Components/snackbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Iconify } from '@/Template/Components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import DataGrid from '@/Components/DataGrid';
import Form from '@/Pages/Managements/Vehicles/Form';
const Vehicle = ()=>{
    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 90,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Representante',
            headerName: 'customer',
            width: 400,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Marca',
            headerName: 'brand',
            width: 200,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Modelo',
            headerName: 'model',
            width: 200,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Placa',
            headerName: 'plate',
            width: 200,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Color',
            headerName: 'color',
            width: 200,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
    ];
    const [refresh, setRefresh] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [dataFormEdit, setDataFormEdit] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const handleEdit=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para editar!');
            return;
        }
        setLoadingEdit(true);
        axios.get(route('vehicles.show',selectedRecord)).then(response => {
            setDataFormEdit(response.data)
            handleOpenDialog();
        }).catch(error => {
            console.error('Error al obtener los datos:',error);
        })
        .finally(()=>{
            setLoadingEdit(false);
        });
    };
    const handleDestroy=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para eliminar!');
            return;
        }
        axios.delete(route('vehicles.destroy',selectedRecord))
        .then(response => {
            toast.success('El Vehículo se eliminó con éxito!');
            refreshGrid();
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
        setRefresh(false);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDataFormEdit(null);
    };
    const handleSelectedRow = (data) => {
        setSelectedRecord(data);
    };
    const refreshGrid=()=>{
        setRefresh(true);
    }
    return (
        <DashboardContent>
            <Head title="Vehículos" />
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: { xs: 3, md: 2 },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleOpenDialog}
                >
                    Nuevo
                </Button>
                <LoadingButton
                    variant="contained"
                    color="info"
                    startIcon={<Iconify icon="mingcute:edit-line" />}
                    onClick={handleEdit}
                    loading={loadingEdit}
                    loadingPosition="start"
                >
                    Modificar
                </LoadingButton>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<Iconify icon="mingcute:delete-line" />}
                    onClick={handleDestroy}
                >
                    Anular
                </Button>
            </Stack>

            <DataGrid
                returnSelectedRow={handleSelectedRow}
                columns={columns}
                refresh={refresh}
                title="Administrar Vehículos"
                path='vehicles.list'
                dblClick={handleEdit}
            />
            <Form
                open={openDialog}
                handleClose={handleCloseDialog}
                initFormData={dataFormEdit}
                handleRefresh={refreshGrid}
            />
        </DashboardContent>
    );
}
Vehicle.layout = page => <DashboardLayout children={page} title="Vehiculoa" />
export default Vehicle
