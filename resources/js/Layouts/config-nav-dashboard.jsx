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
        icon: icon('ic-user')
    },
    {
        title: 'Vehículos',
        path: 'vehicles.index',
        icon: icon('ic-order')
    },
    {
        title: 'Servicios',
        path: 'services.index',
        icon: icon('ic-course')
    },

    {
        title: 'Repuestos',
        path: 'articles.index',
        icon: icon('ic-label')
    },
    {
        title: 'Partes de vehículo',
        path: 'vehicle_parts.index',
        icon: icon('ic-parameter')
    },
    {
        title: 'Órdenes de Rep.',
        path: 'repair_orders.index',
        icon: icon('ic-folder')
    }
];
