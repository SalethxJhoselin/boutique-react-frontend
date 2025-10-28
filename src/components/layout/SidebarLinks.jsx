import { AimOutlined, SolutionOutlined, SettingOutlined, FileAddOutlined, TeamOutlined } from '@ant-design/icons';
import { FaBox } from 'react-icons/fa';

const SidebarLinks = () => [
  {
    label: "Usuarios",
    icon: <TeamOutlined />,
    subMenu: [
      {
        label: "Administrar Perfil",
        to: "/perfil",
      },
      {
        label: "Administrar roles",
        to: "/roles",
      },
      {
        label: "Asignar permisos",
        to: "/permisos",
      },
      {
        label: "Administrar usuarios",
        to: "/adminUsers",
      },
    ],
  },
  {
    label: "Productos",
    icon: <FaBox />,
    subMenu: [
      {
        label: "Gestionar Categoria",
        to: "/categoria",
      },
      {
        label: "Gestionar Categorias de Colores",
        to: "/categoria_color",
      },
      {
        label: "Gestionar Color",
        to: "/color",
      },
      {
        label: "Gestionar Talla",
        to: "/talla",
      },
      {
        label: "Gestionar Marca",
        to: "/marca",
      },
      {
        label: "Gestionar Producto",
        to: "/producto",
      }
    ],
  },
  {
    label: "Compras y Ventas",
    icon: <SettingOutlined />,
    subMenu: [
      {
        label: "Notas de ingreso",
        to: "/notaIngreso",
      },
      {
        label: "Notas de venta",
        to: "/ventas",
      }/*,
      {
        label: "Tipo de pago",
        to: "/tipoPago",
      }*/
    ],
  }
];

export default SidebarLinks;
