import { useState } from 'react';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Datos de prueba para simular respuesta de login exitoso
const mockLoginSuccess = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token",
    refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token"
};

// Datos de prueba para simular respuesta de error
const mockLoginError = {
    error: "Credenciales inválidas",
    message: "El correo o contraseña son incorrectos"
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth();

    const onSubmit = async (event) => {
        event.preventDefault(); // Evita que el formulario se recargue
        //console.log('entreeeeeeeee');
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.post("/auth/login/", {
            //     email: email,
            //     password: password,
            // });

            // Simulación temporal - validar credenciales de prueba
            let response;
            if (email === "usuario@ejemplo.com" && password === "password123") {
                response = { data: mockLoginSuccess };
            } else {
                throw new Error("Credenciales inválidas");
            }

            const { access_token, refresh_token } = response.data;
            console.log('token', refresh_token);
            localStorage.setItem('token', refresh_token);
            login();
        } catch (error) {
            setErrorMessage('Error al iniciar sesión. Verifica tus credenciales');
            console.error('Error al iniciar sesión:', error.response?.data || error.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                <h2 className="text-3xl text-center mb-8">INICIAR SESIÓN</h2>
                <form className="space-y-8" onSubmit={onSubmit}>
                    <div className="relative border-b border-blue">
                        <input
                            type="email"
                            id="correo"
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CORREO"
                            onChange={ev => setEmail(ev.target.value)}
                            required
                        />
                    </div>
                    <div className="relative border-b border-blue">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CONTRASEÑA"
                            onChange={ev => setPassword(ev.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-black"
                        >
                            {showPassword ? <MdLockOpen /> : <MdLock />}
                        </button>
                    </div>

                    <div className="text-red-500 mb-6">{errorMessage}</div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue text-white text-lg py-4 tracking-wider hover:bg-gray-800 transition-all duration-300"
                        >
                            ENTRAR
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-gray-500">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className=" hover:text-black transition-colors">
                                REGÍSTRATE
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;