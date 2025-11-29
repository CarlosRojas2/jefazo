import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import {Iconify} from '@/Template/Components/iconify';
import IconButton from '@mui/material/IconButton';
import { useState,useEffect, useMemo } from 'react';
import { toast } from '@/Template/Components/snackbar';
import Form from '@/Pages/Managements/Articles/Form';
import debounce from 'lodash.debounce';
import api from '@/lib/axios';

export default function PartialProduct({path,id,handleSet,error}){
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dataFormEdit, setDataFormEdit] = useState(null);

    const handleOpenNewProduct = () => {
        setOpenDialog(true);
    };

    const handleOpenEditProduct = () => {
        if(!selectedValue){
            toast.warning('Por favor seleccione un producto para editar!');
            return;
        }
        setDataFormEdit(selectedValue);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDataFormEdit(null);
    };

    const fetchOptions = (input)=>{
        setLoading(true);
        api.get(route(path,{'search':input}))
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            toast.warning(error.response.data);
        })
        .finally(()=>{
            setLoading(false);
            setDataFormEdit({
                description: input.toUpperCase()
            });
        });
    }

    // Función para manejar el nuevo producto
    const handleAddProduct = (newProduct) => {
        // Agregar el nuevo producto a la lista
        setItems((prevItems) => {
            // Verificar si ya existe para evitar duplicados
            const exists = prevItems.some(item => item.id === newProduct.id);
            if (exists) {
                return prevItems;
            }
            return [...prevItems, newProduct];
        });

        // Seleccionar automáticamente el nuevo producto
        setSelectedValue(newProduct);

        // Limpiar el search para que muestre el valor seleccionado
        setSearch('');
    };

    const debouncedFetchOptions = useMemo(() => debounce(fetchOptions, 500), []);

    useEffect(()=>{
        if(selectedValue){
            if(selectedValue.description==search || search==''){
                return;
            }
        }
        debouncedFetchOptions(search)
    },[search,debouncedFetchOptions]);

    useEffect(()=>{
        if(selectedValue){
            handleSet(selectedValue);
            setSelectedValue(null);
            setSearch(''); // Limpiar el campo de búsqueda
        }else{
            handleSet(null)
        }
    },[selectedValue]);

    // Efecto para cargar al editar el diagnostico
    useEffect(() => {
        if(id)
        api.get(route(path,{'id':id}))
        .then((response)=>{
            setSelectedValue(response.data[0]);
        });
    }, [id]);

    return(
        <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 1000 }}>
                <Autocomplete
                    freeSolo
                    options={items}
                    value={selectedValue}
                    fullWidth
                    loading={loading}
                    loadingText="Cargando..."
                    noOptionsText={search ? "No hay resultados" : "Escribe para buscar"}
                    clearOnEscape
                    inputValue={search}
                    onInputChange={(event, newInputValue) => {
                        // if (!selectedValue) {
                            setSearch(newInputValue);
                        // }
                    }}
                    onChange={(event, newValue) => {
                        setSelectedValue(newValue);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.description}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar producto"
                            fullWidth
                            size='small'
                            error={error}
                            inputProps={{
                                ...params.inputProps,
                                readOnly: selectedValue
                            }}
                            sx={{
                                input: {
                                    textTransform: 'uppercase',
                                }
                            }}
                        />
                    )}
                />
            </Stack>

            {!selectedValue &&(
                <IconButton
                    color="primary"
                    onClick={handleOpenNewProduct}
                >
                    <Iconify width="25" height="25" icon='solar:widget-add-bold-duotone'/>
                </IconButton>
            )}

            {selectedValue &&(
                <IconButton
                    color="warning"
                    onClick={handleOpenEditProduct}
                >
                    <Iconify width="25" height="25" icon='hugeicons:dashboard-square-edit' />
                </IconButton>
            )}

            <Form
                open={openDialog}
                handleClose={handleCloseDialog}
                initFormData={dataFormEdit}
                handleRefresh={handleAddProduct}
            />
        </>
    )
};
