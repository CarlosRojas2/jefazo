import { Head } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
const Concept = ()=>{
    return (
        <DashboardContent>
            <Head title="Conceptos" />
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Conceptos
                </Typography>
            </Box>
        </DashboardContent>
    );
}
Concept.layout = page => <DashboardLayout children={page} title="Conceptos" />
export default Concept
