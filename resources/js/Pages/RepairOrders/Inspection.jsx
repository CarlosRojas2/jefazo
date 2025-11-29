import { Head, useForm, usePage, router } from '@inertiajs/react';
import { DashboardLayout, DashboardContent } from '@/Layouts/dashboard';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, Button, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import { toast } from '@/Template/Components/snackbar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { setFormData } from '@/Utils/functions';

export default function Inspection() {
    const { data, setData, post, processing, errors } = useForm({
        repair_order_id: -1,
        inspections: []
    });
    const { repair_order } = usePage().props;
    const [title, setTitle] = useState('');
    
    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Inspección - ' + repair_order.correlative);
        }
    }, [repair_order]);

    const setForm = () => {
        let inspections = [];
        repair_order.inspections.forEach((inspection) => {
            inspections.push({
                id: inspection.id,
                repair_order_id: inspection.repair_order_id,
                name: inspection.vehicle_part.description,
                vehicle_part_id: inspection.vehicle_part_id,
                status: inspection.status,
                observations: inspection.observations
            });
        });
        setData(old => ({ ...old, inspections: inspections, repair_order_id: repair_order.id }));
    }

    const handleGenerate = (event) => {
        event.preventDefault();
        post(route('repair_orders.generate.inspection'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('ok!');
            }
        })
    };

    const handleBack = () => {
        router.visit(route('repair_orders.index'));
    }

    const handleChange = (id, newStatus) => {
        setData((prev) => ({
            ...prev,
            inspections: prev.inspections.map((inspection) =>
                inspection.id === id ? { ...inspection, status: newStatus } : inspection
            ),
        }));
    };

    return (
        <DashboardLayout>
            <Head title='Inspección'></Head>
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

                {/* CONTENIDO CON SCROLL */}
                <Grid container spacing={1}>
                    <Grid xs={12} md={12}>
                        <Card sx={{ p: 2 }}>
                            <form onSubmit={handleGenerate}>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                    }}
                                >
                                    <Grid container spacing={1} sx={{ pt: 0 }}>
                                        <Grid xs={12} md={12} lg={12}>
                                            <TableContainer 
                                                component={Paper} 
                                                sx={{ 
                                                    maxWidth: 1000, 
                                                    mt: 1,
                                                    // Altura máxima para permitir scroll interno si hay muchos items
                                                    maxHeight: 'calc(100vh - 280px)',
                                                    overflow: 'auto'
                                                }}
                                            >
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell 
                                                                sx={{ 
                                                                    padding: "8px 12px", 
                                                                    fontSize: "13px",
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: 'background.paper'
                                                                }}
                                                            >
                                                                Parte
                                                            </TableCell>
                                                            <TableCell 
                                                                align="center" 
                                                                sx={{ 
                                                                    padding: "8px 12px", 
                                                                    fontSize: "13px",
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: 'background.paper'
                                                                }}
                                                            >
                                                                Revisado Ok
                                                            </TableCell>
                                                            <TableCell 
                                                                align="center" 
                                                                sx={{ 
                                                                    padding: "8px 12px", 
                                                                    fontSize: "13px",
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: 'background.paper'
                                                                }}
                                                            >
                                                                Atención próxima
                                                            </TableCell>
                                                            <TableCell 
                                                                align="center" 
                                                                sx={{ 
                                                                    padding: "8px 12px", 
                                                                    fontSize: "13px",
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: 'background.paper'
                                                                }}
                                                            >
                                                                Atención inmediata
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.inspections.map(({ id, name, status }) => (
                                                            <TableRow key={id}>
                                                                <TableCell sx={{ padding: "8px 12px", fontSize: "13px" }}>
                                                                    {name}
                                                                </TableCell>
                                                                {["good", "needs_repair", "damaged"].map((option) => (
                                                                    <TableCell key={option} align="center" sx={{ padding: "8px 12px" }}>
                                                                        <Radio
                                                                            color={option === "good" ? "success" : option === "needs_repair" ? "warning" : "error"}
                                                                            checked={status === option}
                                                                            onChange={() => handleChange(id, option)}
                                                                        />
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
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
                        mt: 1
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleBack}
                            sx={{ minWidth: 120 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerate}
                            disabled={processing}
                            sx={{ minWidth: 200 }}
                        >
                            Actualizar inspección
                        </Button>
                    </Stack>
                </Box>
            </DashboardContent>
        </DashboardLayout>
    );
}