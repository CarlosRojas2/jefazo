import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatStr } from '@/Utils/format-time';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------
export default function Date({ value, onChange }) {
    console.log('repair_order.entry_date_time',value)

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enGB}
        >
            <DatePicker
                label="Fecha Entrada"
                value={value}
                onChange={onChange}
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
