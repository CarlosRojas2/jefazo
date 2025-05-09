import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import { toast } from '@/Template/Components/snackbar';
import Button from '@mui/material/Button';
import { Iconify } from '@/Template/Components/iconify';
registerPlugin(FilePondPluginImagePreview, FilePondPluginFilePoster);
export default function Filepond({ vehicle, images, handleSet }) {
    const { csrf_token } = usePage().props;
    const [files, setFiles] = useState([]);
    useEffect(() => {
        if (Array.isArray(images) && images.length > 0) {
            const paths = images.map(image => ({
                source: image,
                options: {
                    type: 'local',
                    metadata: {
                        poster: '/storage/' + image,
                    },
                },
            }));
            setFiles(paths);
        }
    }, [images]);

    const handleUploadAll = async () => {
        if (!vehicle) {
            toast.warning('Seleccionar vehículo');
            return;
        }

        if (files.length === 0) {
            toast.warning('Selecciona imágenes para subir');
            return;
        }

        const formData = new FormData();
        formData.append('vehicle', vehicle);

        // Añadir solo los archivos nuevos (tipo 'local' son precargados)
        files.forEach(fileItem => {
            if (fileItem.file instanceof File) {
                formData.append('images[]', fileItem.file);
            }
        });

        try {
            const res = await axios.post('/repair_orders/upload', formData, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Imágenes subidas correctamente!');
            handleSet(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Error al subir imágenes');
        }
    };

    return (
        <div style={{textAlign:'center'}}>

            <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    maxFiles={5}
                    maxFileSize="10MB"
                    allowImagePreview={true}
                    name="images[]"
                    label-idle="Soltar archivos..."
                    label-file-processing="Cargando"
                    label-tap-to-retry="Tocar para volver a intentar"
                    label-tap-to-cancel="Toca para cancelar"
                    filePosterMaxHeight={250}
                    instantUpload={false}
                    onremovefile={(error, file) => {
                        if (file?.source) {
                            handleSet(prev => prev.filter(img => !img.includes(file.source)));
                        }
                    }}
                    server={{
                        // Para precarga de imágenes
                        load: (source, load, error, progress, abort) => {
                            const request = new XMLHttpRequest();
                            request.open('GET', '/storage/' + source, true);
                            request.responseType = 'blob';
                            request.onload = () => {
                                if (request.status >= 200 && request.status < 300) {
                                    load(request.response);
                                } else {
                                    error('Error al cargar imagen');
                                }
                            };
                            request.send();
                            request.onprogress = (e) => {
                                progress(e.lengthComputable, e.loaded, e.total);
                            };

                            return {
                                abort: () => {
                                    request.abort();
                                    abort();
                                },
                            };
                        },
                        // Proceso vacío para evitar subida automática
                        process: (fieldName, file, metadata, load, error, progress, abort) => {
                            // Nada: controlamos la subida manualmente
                            return {
                                abort: () => {
                                    abort();
                                },
                            };
                        }
                    }}
                />
            </div>

            <Button
                endIcon={<Iconify icon="ph:cursor-click-fill" />}
                variant="contained"
                color="success"
                onClick={handleUploadAll}
            >
                Subir imágenes
            </Button>
        </div>

    );
}
