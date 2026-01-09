import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Iconify } from '@/Template/Components/iconify';
import { useState, useEffect } from 'react';
export default function PrintOrderModal({ open, onClose, orderId, onView, onPrint }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Cargar preview cuando se abre el modal
    useEffect(() => {
        if (open && orderId) {
            loadPreview();
        }
    }, [open, orderId]);

    const loadPreview = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener el PDF como blob
            const response = await fetch(`/repair_orders/print/${orderId}`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar el PDF');
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPreview(url);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Limpiar URL del blob
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        setError(null);
        onClose();
    };

    const handlePrint = () => {
        // Usar el iframe para imprimir
        const iframe = document.querySelector('iframe[title="PDF Preview"]');
        if (iframe) {
            iframe.contentWindow.print();
        }
    };
    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Vista previa - Orden de Reparación
                {loading && <CircularProgress size={24} />}
            </DialogTitle>
            <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}
                
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {preview && !loading && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '500px',
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <iframe
                            src={preview}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            title="PDF Preview"
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cerrar
                </Button>
                <Button 
                    onClick={() => {
                        onView(orderId);
                        handleClose();
                    }}
                    variant="contained"
                    color="info"
                    startIcon={<Iconify icon="mingcute:eye-line" />}
                >
                    Abrir PDF
                </Button>
                <Button 
                    onClick={handlePrint}
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="mingcute:print-fill" />}
                >
                    Imprimir
                </Button>
            </DialogActions>
        </Dialog>
    );
}
