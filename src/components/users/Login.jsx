import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/apiServices';

// Mocks de datos para desarrollo
const MOCK_RESPONSES = {
    success: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token",
        user: {
            id: 1,
            email: "usuario@ejemplo.com",
            name: "Usuario Demo"
        }
    },
    error: {
        error: "Credenciales inválidas",
        message: "El email o contraseña son incorrectos"
    }
};

// Usuarios de prueba para mocks
const MOCK_USERS = [
    {
        email: "demo@ejemplo.com",
        password: "demo123",
        user_id: 1
    },
    {
        email: "test@ejemplo.com",
        password: "test123",
        user_id: 2
    },
    {
        email: "admin@ejemplo.com",
        password: "admin123",
        user_id: 3
    }
];

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);
    const { login } = useAuth();

    const validateMockCredentials = (email, password) => {
        const user = MOCK_USERS.find(user =>
            user.email === email && user.password === password
        );
        return user;
    };

    const mockLogin = async (email, password) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        const user = validateMockCredentials(email, password);

        if (user) {
            return {
                data: {
                    ...MOCK_RESPONSES.success,
                    user: {
                        ...MOCK_RESPONSES.success.user,
                        id: user.user_id,
                        email: user.email
                    }
                }
            };
        } else {
            throw {
                response: {
                    data: MOCK_RESPONSES.error
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
                console.log("Usando mock de login");
                response = await mockLogin(email, password);
            } else {
                response = await api.post("/auth/login/", {
                    email: email,
                    password: password,
                });
            }

            const { access_token, refresh_token, user } = response.data;
            console.log('Login exitoso, user ID:', user?.id);

            // Guardar token en localStorage
            localStorage.setItem('token', refresh_token);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            // Llamar función de login del contexto
            login(user);

        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                'Error al iniciar sesión. Verifica tus credenciales';
            setErrorMessage(errorMsg);
            console.error('Error al iniciar sesión:', error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };

    // Datos de prueba rápidos para desarrollo
    const fillDemoCredentials = (userType = 'demo') => {
        const users = {
            demo: MOCK_USERS[0],
            test: MOCK_USERS[1],
            admin: MOCK_USERS[2]
        };

        const user = users[userType];
        if (user) {
            setEmail(user.email);
            setPassword(user.password);
            setUseMockData(true);
        }
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
                            <p className="text-xs text-gray-600 mb-2">Credenciales de prueba:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('demo')}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                    Demo User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('test')}
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                >
                                    Test User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('admin')}
                                    className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                                >
                                    Admin User
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl text-center mb-8">INICIAR SESIÓN</h2>

                {errorMessage && (
                    <div className="mb-4 text-center text-red-500 font-bold bg-red-100 border border-red-500 rounded py-2">
                        {errorMessage}
                    </div>
                )}

                {useMockData && process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                        <strong>Modo Prueba:</strong> Usando credenciales mockeadas
                    </div>
                )}

                <form className="space-y-8" onSubmit={onSubmit}>
                    <div className="relative border-b border-blue">
                        <input
                            type="email"
                            id="correo"
                            value={email}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CORREO"
                            onChange={ev => setEmail(ev.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative border-b border-blue">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CONTRASEÑA"
                            onChange={ev => setPassword(ev.target.value)}
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

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue text-white text-lg py-4 tracking-wider hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    INICIANDO SESIÓN...
                                </>
                            ) : (
                                'ENTRAR'
                            )}
                        </button>
                    </div>

                    {/* Información de usuarios demo en desarrollo */}
                    {process.env.NODE_ENV === 'development' && useMockData && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                            <p className="font-semibold mb-2">Usuarios disponibles (mock):</p>
                            <ul className="space-y-1">
                                {MOCK_USERS.map((user, index) => (
                                    <li key={index}>
                                        <strong>Email:</strong> {user.email} |
                                        <strong> Pass:</strong> {user.password}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center text-sm">
                        <p className="text-gray-500">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="hover:text-black transition-colors">
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