// src/components/ProtectedRoute.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Estilo personalizado para el CircularProgress
const GreenCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: 'green', // Cambiar el color a verde
}));

// Componente para mostrar el texto letra por letra
const LetterByLetter = ({ text }) => {
    return (
        <Typography variant="h5" sx={{ color: 'green', mt: 2 }}>
            {text.split(' ').map((char, index) => (
                <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        opacity: 0,
                        animation: `fadeIn 0.5s forwards`, // Aparece letra por letra
                        animationDelay: `${index * 0.1}s`, // Retraso para cada letra
                    }}
                >
                    {char}
                </span>
            ))}
            <style jsx>{`
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </Typography>
    );
};

const ProtectedRoute = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Esperar a que se cargue la sesión
        if (!session || !session.user?.token) {
            router.push('/login'); // Redirigir a la página de inicio de sesión
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GreenCircularProgress size={200} />
                    <img 
                        src="/apple.png" // Cambia esta ruta a la imagen que deseas mostrar
                        alt="Cargando"
                        style={{
                            position: 'absolute',
                            width: '100px', // Ajusta el tamaño de la imagen
                            height: '100px', // Ajusta el tamaño de la imagen
                        }}
                    />
                </Box>
                <LetterByLetter text="D@ltex 3.0 ~ Vida Saludable " /> {/* Mostrar el texto letra por letra */}
            </Box>
        ); // Mostrar un ícono de carga y un mensaje mientras se verifica la sesión
    }

    return children; // Renderizar los hijos si la sesión es válida
};

export default ProtectedRoute;