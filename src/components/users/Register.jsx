import { useState } from 'react';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../../api/apiServices';
import { useAuth } from '../../context/AuthContext';

// Mocks de datos para desarrollo
const MOCK_RESPONSES = {
    success: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token_register",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token_register",
        user: {
            id: Math.floor(Math.random() * 1000) + 100,
            email: "",
            name: "",
            roles: [2]
        }
    },
    error: {
        email: ["El correo electrónico ya está en uso"],
        error: "Error en el registro"
    }
};

// Usuarios mock existentes para simular conflictos
const MOCK_EXISTING_USERS = [
    "existente@ejemplo.com",
    "usuario@ejemplo.com",
    "test@ejemplo.com",
    "admin@ejemplo.com"
];

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);
    const { login } = useAuth();

    const validateMockRegistration = (nombre, correo, contraseña) => {
        // Validaciones simuladas del backend
        if (contraseña.length < 6) {
            return {
                success: false,
                error: "La contraseña debe tener al menos 6 caracteres"
            };
        }

        if (MOCK_EXISTING_USERS.includes(correo)) {
            return {
                success: false,
                error: "El correo electrónico ya está en uso"
            };
        }

        if (!nombre || nombre.length < 2) {
            return {
                success: false,
                error: "El nombre es requerido"
            };
        }

        return { success: true };
    };

    const mockRegister = async (nombre, correo, contraseña) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        const validation = validateMockRegistration(nombre, correo, contraseña);

        if (validation.success) {
            return {
                data: {
                    ...MOCK_RESPONSES.success,
                    user: {
                        ...MOCK_RESPONSES.success.user,
                        id: Math.floor(Math.random() * 1000) + 100,
                        email: correo,
                        name: nombre
                    }
                }
            };
        } else {
            throw {
                response: {
                    data: {
                        email: [validation.error],
                        error: validation.error
                    }
                }
            };
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            let response;

            if (useMockData) {
                console.log("Usando mock de registro");
                response = await mockRegister(nombre, correo, contraseña);
            } else {
                response = await api.post("/auth/registro/", {
                    nombre: nombre,
                    email: correo,
                    password: contraseña,
                    roles: [2]
                });
            }

            const { access_token, refresh_token, user } = response.data;
            console.log('Registro exitoso, user ID:', user?.id);

            // Guardar token en localStorage
            localStorage.setItem('token', refresh_token);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            // Llamar función de login del contexto
            login(user);

        } catch (error) {
            const errorMsg = error.response?.data?.email?.[0] ||
                error.response?.data?.error ||
                'Error al registrarse. Inténtalo de nuevo.';
            setErrorMessage(errorMsg);
            console.error('Error en el registro:', error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };

    // Rellenar datos de prueba para desarrollo
    const fillDemoData = (type = 'basic') => {
        const demoData = {
            basic: {
                nombre: "Usuario Demo",
                correo: `demo${Math.floor(Math.random() * 1000)}@ejemplo.com`,
                contraseña: "demo123"
            },
            premium: {
                nombre: "Usuario Premium",
                correo: `premium${Math.floor(Math.random() * 1000)}@ejemplo.com`,
                contraseña: "premium123"
            },
            conflict: {
                nombre: "Usuario Existente",
                correo: "existente@ejemplo.com", // Este email ya existe en mocks
                contraseña: "test123"
            }
        };

        const data = demoData[type];
        if (data) {
            setNombre(data.nombre);
            setCorreo(data.correo);
            setContraseña(data.contraseña);
            setUseMockData(true);
        }
    };

    // Generar email único para evitar conflictos
    const generateUniqueEmail = () => {
        return `usuario${Math.floor(Math.random() * 10000)}@ejemplo.com`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                {/* Panel de control para desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={useMockData}
                                    onChange={(e) => setUseMockData(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium">Usar datos de prueba</span>
                            </label>
                            {useMockData && (
                                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                                    MOCK
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-gray-600 mb-2">Datos de prueba:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoData('basic')}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                    Registro Básico
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoData('premium')}
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                >
                                    Registro Premium
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoData('conflict')}
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                >
                                    Email Existente
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl text-center mb-8">REGÍSTRATE</h2>

                {useMockData && process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                        <strong>Modo Prueba:</strong> Usando registro mockeado
                        <div className="mt-1 text-xs">
                            <strong>Emails existentes (conflicto):</strong> {MOCK_EXISTING_USERS.join(', ')}
                        </div>
                    </div>
                )}

                <form className="space-y-8" onSubmit={onSubmit}>
                    <div className="relative border-b border-blue">
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="NOMBRE"
                            onChange={ev => setNombre(ev.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative border-b border-blue">
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CORREO"
                            onChange={ev => setCorreo(ev.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative border-b border-blue">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={contraseña}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CONTRASEÑA"
                            onChange={ev => setContraseña(ev.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-black"
                            disabled={isLoading}
                        >
                            {showPassword ? <MdLockOpen /> : <MdLock />}
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue text-white text-lg py-4 tracking-wider hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    REGISTRANDO...
                                </>
                            ) : (
                                'REGISTRARSE'
                            )}
                        </button>
                    </div>

                    {/* Información de validación en desarrollo */}
                    {process.env.NODE_ENV === 'development' && useMockData && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                            <p className="font-semibold mb-2">Validaciones mock:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Contraseña mínimo 6 caracteres</li>
                                <li>Email no debe existir en: {MOCK_EXISTING_USERS.join(', ')}</li>
                                <li>Nombre requerido (mínimo 2 caracteres)</li>
                                <li>Email válido requerido</li>
                            </ul>
                        </div>
                    )}

                    <div className="text-center text-sm">
                        <p className="text-gray-500">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="hover:text-black transition-colors">
                                INICIA SESIÓN
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;