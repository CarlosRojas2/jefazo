import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FilePond, registerPlugin } from 'react-filepond';
// Importa los plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// Import the plugin code
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
// Import the plugin styles
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
// Importa los estilos de FilePond
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// Registra los plugins
registerPlugin(FilePondPluginImagePreview,FilePondPluginFilePoster);
import { toast } from '@/Template/Components/snackbar';

export default function Filepond({vehicle,images,handleSet}){
    const { csrf_token } = usePage().props;
    const [files, setFiles] = useState([]);
    const handleFilePondInit = (pond) => {
        if(Array.isArray(images)&& images.length > 0){
            const paths=[];
            images.forEach(element => {
                paths.push({
                    source:'/storage/'+element,
                    options:{
                        type:'local',
                        metadata:{
                            poster:'/storage/'+element
                        }
                    }
                });
            });
            setFiles(paths);
        }
    };
    const serverConfig ={
        url: '',
        process: {
            url: '/repair_orders/upload',
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            ondata: (formData) => {
                if(!vehicle){
                    toast.warning('Seleccionar vehicle!');
                    return;
                }else{
                    toast.success('pasó!');
                }
                // Agregar el nombre del cliente al formulario
                formData.append('vehicle', vehicle);
                return formData;
            },
            onload:(response)=>handleSet(JSON.parse(response)),
        },
        // remove: this.handleFilePondRemove,
        // revert: this.handleFilePondRevert
    };
    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
            <FilePond
                files={files}
                onupdatefiles={setFiles} // Actualiza el estado de los archivos seleccionados
                allowMultiple={true} // Permitir múltiples archivos (opcional)
                maxFiles={5}
                maxFileSize="10MB" // Permite archivos de hasta 10 MB
                allowImagePreview={true} // Mostrar vista previa
                name="images[]" // Nombre del campo (para el backend)
                server={serverConfig}
                labelIdle='Arrastra tus archivos o <span class="filepond--label-action">Explora</span>'
                oninit={handleFilePondInit}
                filePosterMaxHeight={250}
                allowFilePondPlugin={false}
            />
        </div>
    );
};
