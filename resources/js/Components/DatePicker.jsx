import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatStr } from '@/Utils/format-time';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------
export default function Date({ value, slotProps,error }) {
    const handleChange =()=>{}
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enGB}
        >
            <DatePicker
                label="Fecha Entrada"
                value={value}
                onChange={(newValue) => {
                    field.onChange(newValue);
                }}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        size:'small'
                    },
                }}
            />
        </LocalizationProvider>
    );
}
