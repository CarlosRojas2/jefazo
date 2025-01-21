import { Label } from '@/Template/Components/label';
import { SvgColor } from '@/Template/Components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
    <SvgColor width="100%" height="100%" src={`/storage/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
    {
        title: 'Clientes',
        path: 'customers.index',
        icon: icon('ic-analytics')
    },
    {
        title: 'Conceptos',
        path: 'concepts.index',
        icon: icon('ic-user')
    },
    {
        title: 'Vehículos',
        path: 'vehicles.index',
        icon: icon('ic-cart')
    },
    {
        title: 'Diagnósticos',
        path: 'diagnoses.index',
        icon: icon('ic-cart')
    }
];
