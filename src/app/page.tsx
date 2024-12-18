'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const router = useRouter(); // Inicializa el router

  useEffect(() => {
    // Redirige a /login al cargar la página
    router.push("/login");
  }, [router]);

  // No se renderiza nada en la página
  return (
  <> 
    <ProtectedRoute children={undefined}>
      
    </ProtectedRoute>
  </>
  ); // Retorna null para no mostrar nada
}