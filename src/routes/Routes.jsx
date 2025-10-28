import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import UserPerfil from '../components/users/UserPerfil';
import ManageRoles from '../components/views/administrador/ManageRoles';
import ManageUsuarios from '../components/views/administrador/ManageUsuarios';
import Login from '../components/users/Login';
import ManagePermissions from '../components/views/administrador/ManagePermissions';
import Register from '../components/users/Register';
import Catalog from '../components/pages/Catalog';
import ManageDiscount from '../components/views/Productos/ManageDiscount';
import ManageSize from '../components/views/Productos/ManageSize';
import ManageColor from '../components/views/Productos/ManageColor';
import ManageBrand from '../components/views/Productos/ManageBrand';
import ManageCategory from '../components/views/Productos/ManageCategory';
import ManageProduct from '../components/views/Productos/ManageProducts';
import PurchaseReceipt from '../components/views/Catalogo/PurchaseReceipt';
import ManageNotaIngreso from '../components/views/Inventario/ManageNotaIngreso';
import ManageCategoryColor from '../components/views/Productos/ManageCategoryColor';
import ManageUsers from '../components/views/administrador/ManageUsers';
import NotaVents from '../components/views/Inventario/NotaVents';

const MyRoutes = () => {
    const { isLoggedIn } = useAuth();
    return (
        <Routes>
            {/* no logged*/}
            {!isLoggedIn ? (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </>
            ) : (
                <>
                    {/* Si el usuario está logueado, redirigir cualquier intento de acceder a las rutas públicas al home */}
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="/register" element={<Navigate to="/" />} />-
                </>
            )}
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/purchase-receipt" element={<PurchaseReceipt />} />
            <Route path="/" element={<Catalog />} />
            {/*Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/descuento" element={<ManageDiscount />} />
                <Route path="/talla" element={<ManageSize />} />
                <Route path="/color" element={<ManageColor />} />
                <Route path="/marca" element={<ManageBrand />} />
                <Route path="/categoria" element={<ManageCategory />} />
                <Route path="/categoria_color" element={<ManageCategoryColor />} />
                <Route path="/producto" element={<ManageProduct />} />
                <Route path="/notaIngreso" element={<ManageNotaIngreso />} />
                <Route path="/ventas" element={<NotaVents />} />



                <Route path="/perfil" element={<UserPerfil />} />

                <Route path="/roles" element={<ManageRoles />} />
                <Route path="/permisos" element={<ManagePermissions />} />
                <Route path="/adminUsers" element={<ManageUsers />} />
                <Route path="/admin/users" element={<ManageUsuarios />} />
            </Route>



            {/* Ruta por defecto para redirigir a login si no coincide ninguna ruta */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/catalog" : "/login"} />} />
        </Routes>
    )
}

export default MyRoutes