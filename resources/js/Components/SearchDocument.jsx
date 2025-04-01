import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '@/Template/Components/iconify';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState,useEffect } from 'react';
import { toast } from '@/Template/Components/snackbar';
export default function SearchDocument({label,value,path,autofocus,onChange,from,onSearch,error,helperText}){
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        setDisabled(true);
        if(from == 'dni'){
            if(value.length=='8'){
                setDisabled(false);
            }
        }
        if(from == 'ruc'){
            if(value.length=='11'){
                setDisabled(false);
            }
        }
    },[value]);
    const handleEnterKeyUp = (event) => {
        if (event.key === 'Enter') {
            handleSearchDocument(event);
        }
    };
    const handleSearchDocument=(event)=>{
        event.preventDefault();
        if(from == 'dni'){
            if(value.length!='8'){
                toast.warning('Parametros no válido para'+' '+from);
                return;
            }
        }
        if(from == 'ruc'){
            if(value.length!='11'){
                toast.warning('Parametros no válido para'+' '+from);
                return;
            }
        }
        setLoading(true);
        axios.get(route(path,value))
        .then(response => {
            onSearch(response.data);
        })
        .catch(error => {
            console.error('Error al obtener los datoss:',error.response.data);
            toast.warning(error.response.data);
        })
        .finally(()=>{
            setLoading(false);
        });
    }
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    return(
        <TextField
            label={label}
            type='text'
            size='small'
            autoFocus
            value={value}
            onChange={handleChange}
            error={error}
            helperText={helperText}
            onKeyDown={handleEnterKeyUp}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {!loading && (
                            <IconButton
                                onClick={handleSearchDocument}
                                edge="end"
                                color="primary"
                                disabled = {disabled}
                            >
                                <Iconify icon='icon-park-solid:click' />
                            </IconButton>
                        )}

                        {loading && (
                            <CircularProgress
                                size={25}
                                color='success'
                            />
                        )}
                    </InputAdornment>
                ),
            }}
        />
    )
};
