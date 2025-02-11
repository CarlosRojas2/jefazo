import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Box } from '@mui/material';
export default function DigitalSignature({ onSave }) {
    const sigCanvas = useRef(null);
    const clearSignature = () => {
        sigCanvas.current.clear();
    };
    const saveSignature = () => {
        const signatureData = sigCanvas.current.toDataURL(); // Convierte la firma a base64
        onSave(signatureData); // Envía la firma al padre o backend
    };
    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                    width: 500,
                    height: 200,
                    style: { border: '1px solid #ccc', borderRadius: '4px' }
                }}
            />

            <Box display="flex" gap={2}>
                <Button variant="contained" color="error" onClick={clearSignature}>
                    Limpiar
                </Button>
                <Button variant="contained" color="success" onClick={saveSignature}>
                    Confirmar
                </Button>
            </Box>
        </Box>
    );
}
