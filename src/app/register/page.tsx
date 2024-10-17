"use client";

import IconLogo from "@/components/logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircularProgress } from "@mui/material";



const RegisterPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!name) newErrors.push("El nombre es requerido.");
    if (!validateEmail(email)) newErrors.push("El correo electrónico no es válido.");
    if (!password) newErrors.push("La contraseña es requerida.");
    if (password !== confirmPassword) newErrors.push("Las contraseñas no coinciden.");

    // Simular verificación de usuario existente
    const userExists = false; // Cambia esto según tu lógica de backend
    if (userExists) newErrors.push("El usuario ya existe.");

    return newErrors;
  };

  const handleChange = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validamos el formulario y mostramos errores si los hay
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true); // Muestra el loader
  
    try {
      // Petición al backend para registro
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(), // Aseguramos que sea un string limpio
          email: email.trim(),
          password: password,
        }),
      });
  
      const responseAPI = await res.json();
  
      if (!res.ok) {
        throw new Error(responseAPI.message || "Error en el registro");
      }
  
      // Intentamos iniciar sesión con NextAuth
      const responseNextAuth = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false, // Importante: Controlamos la redirección manualmente
      });
  
      if (responseNextAuth?.error) {
        throw new Error(responseNextAuth.error);
      }
  
      // Si la autenticación es exitosa, redirigimos al dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error:", error.message); // Log para diagnosticar
      setErrors([error.message]); // Mostrar mensaje de error en pantalla
    } finally {
      setLoading(false); // Oculta el loader y muestra los botones
    }
  };
  

  return (
    <div className="w-[1540px] h-[950px] relative bg-white border-2 border-white">
      <div className="w-[717.97px] h-[950px] left-0 top-0 absolute">
        <div className="w-[717.97px] h-[950px] left-0 top-0 absolute bg-[#25aa80]"></div>
        <div className="w-px h-[950px] left-[718px] top-0 absolute flex-col justify-center items-center inline-flex">
          <div className="w-[950px] h-[0px] origin-top-left -rotate-90 border-[#edf2f7]"></div>
        </div>
        <div className="w-[178px] h-[66px] px-6 py-4 left-[52px] top-[52px] absolute bg-[#fbfcfc] rounded-[90px] justify-center items-center gap-3 inline-flex">
          <div className="text-[#22262e] text-base font-bold font-['DM Sans'] leading-none">
            <IconLogo />
          </div>
        </div>
        <div className="w-[473px] h-[53px] left-[158px] top-[253px] absolute text-white text-[38px] font-bold font-['DM Sans'] leading-[43px]">D@ltex 3.0 ~ Vida Saludable</div>
        <div className="w-[420px] left-[158px] top-[341px] absolute text-white text-lg font-normal font-['Inter'] leading-[30px] mt-6">La herramienta donde puedes encontrar todo para la gestión de tus pacientes.</div>
      </div>
      <div className="w-[648px] h-[882px] left-[743px] top-[34px] absolute flex-col justify-start items-center inline-flex">
        {/* Título y Subtítulo */}
        <div className="text-center mb-10 mt-10">
          <h1 className="text-3xl font-bold text-gray-800">Registro de Usuario</h1>
          <p className="text-lg text-gray-600 mt-2">Para formar parte de la comunidad, completa estos datos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-[60px] self-stretch h-[882px] py-[50px] flex-col justify-center items-center gap-[50px] flex">
          <div className="h-[324px] flex-col justify-start items-start gap-[30px] flex">
            <div className="h-[216px] pt-6 flex-col justify-center items- gap-[30px] flex">
              <div className="self-stretch h-[71px] flex-col justify-start items-start flex">
                <label className="block text-gray-500 font-bold mb-2">Nombre de usuario</label>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${errors.includes("El nombre es requerido.") ? "border-red-500" : ""}`}
                  value={name}
                  onChange={handleChange(setName)}
                />
              </div>
              <div className="self-stretch h-[91px] flex-col justify-start items-start flex">
                <label className="block text-gray-500 font-bold mb-2">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${errors.includes("El correo electrónico no es válido.") ? "border-red-500" : ""}`}
                  value={email}
                  onChange={handleChange(setEmail)}
                />
              </div>

              <div className="self-stretch h-[91px] flex-col justify-start items-start flex">
                <label className="block text-gray-500 font-bold mb-2">Contraseña</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${errors.includes("La contraseña es requerida.") ? "border-red-500" : ""}`}
                  value={password}
                  onChange={handleChange(setPassword)}
                />
              </div>

              <div className="self-stretch h-[91px] flex-col justify-start items-start flex">
                <label className="block text-gray-500 font-bold mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${errors.includes("Las contraseñas no coinciden.") ? "border-red-500" : ""}`}
                  value={confirmPassword}
                  onChange={handleChange(setConfirmPassword)}
                />
              </div>

              <div className="mb-6">
                            {loading ? (
                <div className="flex justify-center items-center w-full h-full">
                  <CircularProgress style={{ color: '#25aa80' }} />
                </div>
              ) : (
                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="w-[212px] px-6 py-4 bg-[#131416] hover:bg-[#25aa80] rounded-[90px] text-center text-[#fbfcfc] text-base font-bold font-['DM Sans'] leading-none">
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="shadow bg-black w-[212px] ml-4 hover:bg-[#25aa80] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-[90px]"
                  >
                    Login
                  </button>
                </div>
              )}

              </div>
            </div>
          </div>
        </form>
        
        {/* Contenedor para mostrar errores debajo del formulario */}
        <div className="h-20">
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded mt-5">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div className="p-2.5 justify-start items-start gap-2.5 inline-flex">
          <div className="text-right">
            <span className="text-[#718096] text-sm font-semibold font-['Inter'] leading-normal">D@ltex 3.0 ~ Vida Saludable ~ Todo lo que buscas en un solo lugar </span>
            <span className="text-[#425466] text-sm font-semibold font-['Inter'] leading-normal"> </span>
 
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;