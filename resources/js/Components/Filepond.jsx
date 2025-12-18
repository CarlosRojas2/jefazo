import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

registerPlugin(
    FilePondPluginImageExifOrientation, 
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

export default function Filepond({ vehicle, images, handleSet, handleRemove }) {
    const { csrf_token } = usePage().props;
    const [files, setFiles] = useState([]);

    // Cargar imágenes existentes cuando cambien
    useEffect(() => {
        console.log('Imágenes recibidas:', images);
        if (Array.isArray(images) && images.length > 0) {
            const formattedFiles = images.map((imagePath) => {
                return {
                    source: imagePath,
                    options: {
                        type: 'local'
                    }
                };
            });
            console.log('Archivos formateados:', formattedFiles);
            setFiles(formattedFiles);
        } else {
            setFiles([]);
        }
    }, [images]);

    // Proceso de subida
    const process = (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData();
        formData.append("images", file);
        formData.append("vehicle", vehicle);

        const source = axios.CancelToken.source();

        axios.post("/repair_orders/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN": csrf_token,
            },
            onUploadProgress: (e) => {
                progress(true, e.loaded, e.total);
            },
            cancelToken: source.token,
        })
        .then((response) => {
            const uploadedPath = response.data;
            console.log('Imagen subida exitosamente:', uploadedPath);
            
            // Notificar al componente padre
            if (handleSet) {
                handleSet(uploadedPath);
            }
            
            // Informar a FilePond que la subida fue exitosa
            load(uploadedPath);
        })
        .catch((err) => {
            console.error('Error al subir:', err);
            if (axios.isCancel(err)) {
                error("Subida cancelada");
            } else {
                error("Error al subir la imagen");
            }
        });

        return {
            abort: () => {
                source.cancel("Upload cancelado por el usuario");
                abort();
            },
        };
    };

    // Proceso de eliminación para archivos recién subidos
    const revert = (uniqueFileId, load, error) => {
        console.log('Revert llamado con:', uniqueFileId);
        
        // IMPORTANTE: FilePond espera que envíes el uniqueFileId como texto plano
        axios.post("/repair_orders/revert", uniqueFileId, {
            headers: {
                "X-CSRF-TOKEN": csrf_token,
                "Content-Type": "text/plain", // ← Enviar como texto plano
            },
        })
        .then(() => {
            console.log('Imagen eliminada (revert):', uniqueFileId);
            
            // Notificar al componente padre
            if (handleRemove) {
                handleRemove(uniqueFileId);
            }
            
            load();
        })
        .catch((err) => {
            console.error('Error al eliminar (revert):', err);
            error('Error al eliminar la imagen');
        });
    };

    // Carga de imágenes existentes desde el servidor
    const load = (source, load, error, progress, abort, headers) => {
        console.log('Load llamado con source:', source);
        
        const imageUrl = source;
        
        fetch(imageUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al cargar la imagen');
                }
                return response.blob();
            })
            .then((blob) => {
                console.log('Imagen cargada exitosamente:', source);
                load(blob);
            })
            .catch((err) => {
                console.error('Error al cargar imagen:', err);
                error('Error al cargar la imagen');
            });
    };

    // Eliminación de archivos existentes (archivos ya cargados)
    const remove = (source, load, error) => {
        console.log('Remove llamado con source:', source);
        
        // Mostrar confirmación
        if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            error('Eliminación cancelada');
            return;
        }

        // Enviar como texto plano igual que revert
        axios.post("/repair_orders/revert", source, {
            headers: {
                "X-CSRF-TOKEN": csrf_token,
                "Content-Type": "text/plain", // ← Enviar como texto plano
            },
        })
        .then(() => {
            console.log('Imagen eliminada del servidor:', source);
            
            // Notificar al componente padre
            if (handleRemove) {
                handleRemove(source);
            }
            
            load();
        })
        .catch((err) => {
            console.error('Error al eliminar:', err);
            error('Error al eliminar la imagen del servidor');
        });
    };

    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <FilePond
                files={files}
                onupdatefiles={(fileItems) => {
                    console.log('Files actualizados:', fileItems);
                    setFiles(fileItems.map(item => item.file ? item.file : item));
                }}
                allowMultiple={true}
                maxFiles={10}
                maxFileSize="5MB"
                acceptedFileTypes={['image/*']}
                labelMaxFileSizeExceeded="La imagen es muy grande"
                labelMaxFileSize="El tamaño máximo es {filesize}"
                labelFileTypeNotAllowed="Tipo de archivo no válido"
                fileValidateTypeLabelExpectedTypes="Se esperan imágenes"
                instantUpload={true}
                server={{ 
                    process, 
                    revert, 
                    load,
                    remove
                }}
                name="file"
                labelIdle='Arrastra y suelta imágenes o <span class="filepond--label-action">Haz clic para explorar</span>'
                labelFileLoading="Cargando"
                labelFileLoadError="Error al cargar"
                labelFileProcessing="Subiendo"
                labelFileProcessingComplete="Subida completa"
                labelFileProcessingAborted="Subida cancelada"
                labelFileProcessingError="Error en la subida"
                labelFileProcessingRevertError="Error al revertir"
                labelFileRemoveError="Error al eliminar"
                labelTapToCancel="toca para cancelar"
                labelTapToRetry="toca para reintentar"
                labelTapToUndo="toca para deshacer"
                credits={false}
                allowRevert={true}
                allowRemove={true}
                allowImageCapture={true}
            />
        </div>
    );
}