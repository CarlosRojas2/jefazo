import { useState,useEffect } from 'react';
import { Head,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import { toast } from '@/Template/Components/snackbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Iconify } from '@/Template/Components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import DataGrid from '@/Components/DataGrid';
import PrintOrderModal from '@/Components/PrintOrderModal';
import axios from 'axios';
const RepairOrder = ()=>{
    const columns = [
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
            width: 160,
            filterable:false,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 130,
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
    const [showInspection,setShowInspection]=useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [openPrintModal, setOpenPrintModal] = useState(false);
    const handleEdit=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para editar!');
            return;
        }
        router.visit(route('repair_orders.edit',selectedRecord));
    };

    const handleDiagnose=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro!');
            return;
        }
        router.visit(route('repair_orders.show',selectedRecord));
    };

    const handleInspection=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro!');
            return;
        }
        router.visit(route('repair_orders.inspection',selectedRecord));
    };

    const handleDestroy=()=>{
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para eliminar!');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar?')) {
            return;
        }
        
        axios.delete(route('repair_orders.destroy',selectedRecord))
        .then(response => {
            toast.success(response.data.message);
            refreshGrid();
        })
        .catch(error => {
            if (error.response) {
                toast.error(error.response.data.message); // Muestra el mensaje de error si el backend lo envió
            }
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

    const handlePrintOrder = () => {
        if(selectedRecord.length<=0){
            toast.warning('Por favor seleccione un registro para imprimir!');
            return;
        }
        setOpenPrintModal(true);
    };

    const handleViewPDF = (orderId) => {
        window.open(route('repair_orders.print', orderId), '_blank');
    };

    const handlePrintPDF = (orderId) => {
        // Usar el iframe del modal para imprimir
        setTimeout(() => {
            const iframe = document.querySelector('iframe[title="PDF Preview"]');
            if (iframe) {
                iframe.contentWindow.print();
            }
        }, 100);
    };

    return (
        <DashboardContent>
            <Head title="Ordenes de reparación" />
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
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
                    color="secondary"
                    startIcon={<Iconify icon="noto:man-mechanic-medium-light-skin-tone" />}
                    onClick={handleDiagnose}
                >
                    Diagnosticar
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Iconify icon="wpf:inspection" />}
                    onClick={handleInspection}
                >
                    Inspección técnica
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="mingcute:print-fill" />}
                    onClick={handlePrintOrder}
                >
                    Imprimir órden
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

            <PrintOrderModal 
                open={openPrintModal}
                onClose={() => setOpenPrintModal(false)}
                orderId={selectedRecord}
                onView={handleViewPDF}
                onPrint={handlePrintPDF}
            />
        </DashboardContent>
    );
}
RepairOrder.layout = page => <DashboardLayout children={page} title="Clientes" />
export default RepairOrder
