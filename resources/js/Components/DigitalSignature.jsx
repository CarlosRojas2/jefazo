import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Iconify } from '@/Template/Components/iconify';
import { Button, Box, Typography, Paper } from '@mui/material';

export default function DigitalSignature({ onSave }) {
    const sigCanvas = useRef(null);

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const saveSignature = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Por favor, firme antes de confirmar');
            return;
        }
        const signatureData = sigCanvas.current.toDataURL();
        onSave(signatureData);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    width: 'fit-content'
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 16,
                        fontSize: '11px',
                        fontWeight: 500
                    }}
                >
                    Firme aquí
                </Typography>

                <Box
                    sx={{
                        mt: 2,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        backgroundColor: 'grey.50',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'grey.100'
                        }
                    }}
                >
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{
                            width: 500,
                            height: 200,
                            style: { 
                                display: 'block',
                                touchAction: 'none'
                            }
                        }}
                        penColor="#1976d2"
                    />
                    
                    {/* Línea de firma decorativa */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 40,
                            left: '10%',
                            right: '10%',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            pointerEvents: 'none'
                        }}
                    />
                    
                    {/* Texto debajo de la línea */}
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            fontSize: '10px',
                            pointerEvents: 'none'
                        }}
                    >
                        Firma del cliente
                    </Typography>
                </Box>
            </Paper>

            <Box display="flex" gap={2} justifyContent="center" sx={{ width: '100%', maxWidth: 500 }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={clearSignature}
                    startIcon={<Iconify icon='solar:trash-bin-minimalistic-bold' />}
                    fullWidth
                    sx={{ maxWidth: 200 }}
                >
                    Limpiar
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={saveSignature}
                    startIcon={<Iconify icon='solar:check-circle-bold' />}
                    fullWidth
                    sx={{ maxWidth: 200 }}
                >
                    Confirmar
                </Button>
            </Box>
        </Box>
    );
}