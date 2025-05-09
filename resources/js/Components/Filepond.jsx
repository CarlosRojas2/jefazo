import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,FilePondPluginFilePoster);
export default function Filepond({ vehicle, images, handleSet }) {
    const { csrf_token } = usePage().props;
    const [files, setFiles] = useState([]);
    // useEffect(() => {
    //     if (Array.isArray(images) && images.length > 0) {
    //         const paths = images.map(image => ({
    //             source: image,
    //             options: {
    //                 type: 'local',
    //                 metadata: {
    //                     poster: '/storage/' + image,
    //                 }
    //             }
    //         }));
    //         setFiles(paths);
    //     }
    // }, [images]);
    const process = (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort
    ) => {
        const formData = new FormData();
        formData.append("images", file);
        formData.append("vehicle", vehicle); // asumiendo que 'vehicle' está en scope
        const source = axios.CancelToken.source();
        axios.post("/repair_orders/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN": csrf_token, // asegurarte de tener este token
            },
            onUploadProgress: (e) => {
                progress(true, e.loaded, e.total);
            },
            cancelToken: source.token,
        })
        .then((response) => {
            const uploadedPath = response.data; // solo string
            console.log('uploadedPath',uploadedPath)

            handleSet(uploadedPath);
            load(uploadedPath); // este será el token usado en revert
        })
        .catch((err) => {
            console.error(err);
            error("Error al subir la imagen");
        });

        return {
            abort: () => {
                source.cancel("Upload cancelado");
                abort();
            },
        };
    };

    const revert = (uniqueFileId, load, error) => {
        console.log();
        // Mostrar confirmación al usuario
        if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            return;
        }
        axios.post("/repair_orders/revert", { path: uniqueFileId }, {
            headers: {
                "X-CSRF-TOKEN": csrf_token,
            },
        })
        .then(() => {
            load(); // Notifica a FilePond que se completó la eliminación
        })
        .catch(() => {
            error('Error al eliminar la imagen');
        });
    };

    return (
        <div style={{ width: "80%", margin: "auto", padding: "1%" }}>
            <FilePond
                files={files}
                acceptedFileTypes="image/*"
                onupdatefiles={setFiles}
                allowMultiple={true}
                server={{ process, revert,
                    load: (source, load, error, progress, abort) => {
                        // source = "annexes/ABC123/image1.jpg"
                        const request = new XMLHttpRequest();
                        request.open('GET', '/storage/' + source, true);
                        request.responseType = "blob";
                        request.onload = () => {
                            load(request.response);
                        };
                        request.onerror = () => {
                            error("Error al cargar la imagen");
                        };
                        request.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        };
                        request.send();
                        return {
                            abort: () => {
                                request.abort();
                                abort();
                            },
                        };
                    },
                }}
                name="file"
                labelIdle='Arrastra imágenes o <span class="filepond--label-action">Explora</span>'
            />
        </div>
    );
}
