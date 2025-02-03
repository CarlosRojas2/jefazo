import { useState } from 'react';
import { Head,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import { toast } from '@/Template/Components/snackbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Iconify } from '@/Template/Components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import DataGrid from '@/Components/DataGrid';
const RepairOrder = ()=>{
    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 90,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'customer',
            headerName: 'Cliente',
            width: 300,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'vehicle',
            headerName: 'Vehículo',
            width: 250,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'problem',
            headerName: 'Falla',
            width: 250,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'entry_date_time',
            headerName: 'Fecha',
            width: 300,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 300,
            filterable:false,
            headerClassName: 'super-app-theme--header',
            cellClassName: (params) => {
                if (params.value === "INGRESADO") {
                    return "status-registered";
                } else if (params.value === "REVISADO") {
                    return "status-diagnosed";
                }
                return "";
            },
        }
    ];
    const [refresh, setRefresh] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const handleEdit=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para editar!');
            return;
        }
        router.visit(route('repair_orders.edit',selectedRecord));
    };

    const handleDiagnose=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para diagnosticar!');
            return;
        }
        router.visit(route('repair_orders.show',selectedRecord));
    };

    const handleDestroy=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para eliminar!');
            return;
        }
        axios.delete(route('customers.destroy',selectedRecord))
        .then(response => {
            toast.success('El Cliente se eliminó con éxito!');
            refreshGrid();
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    };

    const handleAdd = ()=>{
        router.visit(route('repair_orders.create'));
    }

    const handleSelectedRow = (data) => {
        setSelectedRecord(data);
    };
    const refreshGrid=()=>{
        setRefresh(true);
    }
    return (
        <DashboardContent>
            <Head title="Ordenes de reparación" />
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
                    onClick={handleAdd}
                >
                    Nuevo
                </Button>
                <LoadingButton
                    variant="contained"
                    color="info"
                    startIcon={<Iconify icon="mingcute:edit-line" />}
                    onClick={handleEdit}
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

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="noto:man-mechanic-medium-light-skin-tone" />}
                    onClick={handleDiagnose}
                >
                    Diagnosticar
                </Button>
            </Stack>

            <DataGrid
                returnSelectedRow={handleSelectedRow}
                columns={columns}
                refresh={refresh}
                title="Administrar Ordenes de reparación"
                path='repair_orders.list'
                dblClick={handleEdit}
            />
        </DashboardContent>
    );
}
RepairOrder.layout = page => <DashboardLayout children={page} title="Clientes" />
export default RepairOrder
