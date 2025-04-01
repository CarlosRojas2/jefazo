import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import {Iconify} from '@/Template/Components/iconify';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState,useEffect, useMemo } from 'react';
import { toast } from '@/Template/Components/snackbar';
// import Form from '@/Pages/Managements/Services/Form';
import debounce from 'lodash.debounce';
export default function PartialService({path,id,handleSet,error}){
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dataFormEdit, setDataFormEdit] = useState(null);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);

        setDataFormEdit(null);
    };
    const fetchOptions = (input)=>{
        setLoading(true);
        axios.get(route(path,{'search':input}))
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            toast.warning(error.response.data);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
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

    // Efecto para cargar al editar
    useEffect(() => {
        if(id)
        axios.get(route(path,{'id':id}))
        .then((response)=>{
            setSelectedValue(response.data[0]);
        });
    }, [id]);
    return(
        <>
            {/* <Stack spacing={2} sx={{ width: 543 }} > */}
                <Autocomplete
                    freeSolo
                    options={items}
                    value={selectedValue}
                    fullWidth
                    inputValue={search}
                    onInputChange={(event, newInputValue) => {
                        setSearch(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                        setSelectedValue(newValue);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.description}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar Servicio"

                            size='small'
                            error={error}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                                // endAdornment: (
                                //     <InputAdornment position="end">
                                //         <IconButton
                                //             edge="end"
                                //             color="primary"
                                //             onClick={handleOpenDialog}
                                //         >
                                //             <Iconify icon='octicon:feed-plus-16' />
                                //         </IconButton>
                                //     </InputAdornment>
                                // )
                            }}
                        />
                    )}
                />
            {/* </Stack> */}
            {/* <Form
                open={openDialog}
                handleClose={handleCloseDialog}
                initFormData={dataFormEdit}
            /> */}
        </>
    )
};
