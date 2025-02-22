import { Head,useForm,usePage,router } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import Stack from '@mui/material/Stack';
import { useState,useEffect } from 'react';
import { Iconify } from '@/Template/Components/iconify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, Button,Typography } from "@mui/material";
import Card from '@mui/material/Card';
import { toast } from '@/Template/Components/snackbar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { setFormData } from '@/Utils/functions';
export default function Inspection() {
    const { data, setData, post, processing, errors } = useForm({
        repair_order_id:-1,
        inspections:[]
    });
    const { repair_order } = usePage().props;
    const [title,setTitle]=useState('');
    const vehicleParts = [
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
        { id: 1, name: "Motor" },
        { id: 2, name: "Frenos" },
        { id: 3, name: "Luces" },
        { id: 4, name: "Batería" },
    ];
    useEffect(() => {
        if (repair_order !== undefined) {
            setForm();
            setTitle('Inspección - '+ repair_order.correlative);
        }
    }, [repair_order]);
    const setForm = ()=>{
        let inspections =[];
        repair_order.inspections.forEach((inspection)=>{
            inspections.push({
                id:inspection.id,
                repair_order_id:inspection.repair_order_id,
                name:inspection.vehicle_part.description,
                vehicle_part_id:inspection.vehicle_part_id,
                status:inspection.status,
                observations:inspection.observations
            });
        });
        setData(old=>({...old,inspections:inspections,repair_order_id:repair_order.id}));
    }
    function handleSubmit(event) {
        event.preventDefault()
        post(route('repair_orders.diagnose'),{
            onSuccess:()=>{
                toast.success('Datos guardados con éxito!');
            }
        })
    }

    const handleGenerate=(event)=>{
        event.preventDefault();
        post(route('repair_orders.generate.inspection'),{
            preserveScroll:true,
            onSuccess:()=>{
                toast.success('ok!');
            }
        })
    };

    const handleBack = ()=>{
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
                                        <Grid xs={12} md={12} lg={12}>
                                            <TableContainer component={Paper} sx={{ maxWidth: 1000, mt: 1 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ padding: "2px 4px", fontSize: "12px" }}><b>Parte</b></TableCell>
                                                            <TableCell align="center" sx={{ padding: "2px 4px", fontSize: "12px" }}>Revisado Ok</TableCell>
                                                            <TableCell align="center" sx={{ padding: "2px 4px", fontSize: "12px" }}>Atención próxima</TableCell>
                                                            <TableCell align="center" sx={{ padding: "2px 4px", fontSize: "12px" }}>Atención inmediata</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.inspections.map(({ id, name, status }) => (
                                                            <TableRow key={id}>
                                                                <TableCell sx={{ padding: "2px 4px", fontSize: "12px" }}>{name}</TableCell>
                                                                {["good", "needs_repair", "damaged"].map((option) => (
                                                                    <TableCell key={option} align="center" sx={{ padding: "2px 4px" }}>
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
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ mt: 1, width: "100%", py: 0.5, fontSize: "12px" }}
                                                    onClick={handleGenerate}
                                                >
                                                    Actualizar inspección
                                                </Button>
                                            </TableContainer>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </DashboardContent>
        </DashboardLayout>
    );
}
