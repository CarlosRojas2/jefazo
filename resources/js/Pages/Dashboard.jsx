import { Head } from '@inertiajs/react';
import { DashboardLayout,DashboardContent } from '@/Layouts/dashboard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
const Dashboard = ()=>{
    return (
        <DashboardContent>
            <Head title="Dashboard" />
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Dashboard
                </Typography>
            </Box>
        </DashboardContent>
    );
}
Dashboard.layout = page => <DashboardLayout children={page} title="Dashboard" />
export default Dashboard
