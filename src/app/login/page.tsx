"use client";

import IconLogo from "../../components/logo";
import { CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
 


const claseImputs ="w-[424px] px-6 py-4 bg-[#eaf0f5] rounded-md text-left text-[#25aa80] text-base font-bold font-['DM Sans'] leading-none";
const LoginPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Nuevo estado de carga
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);
    setLoading(true); // Inicia la carga

    const responseNextAuth = await signIn("credentials", {
      name,
      password,
      redirect: false,
    });

    setLoading(false); // Detiene la carga


    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    //router.push("/homepage");
    router.push("/dashboard");
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
        <div className="w-[420px] left-[158px] top-[341px] absolute text-white text-lg font-normal font-['Inter'] leading-[30px] mt-6">La herramienta donde puedes encontrar todo para la gestion de tus pacientes.</div>
      </div>
      <div className="w-[648px] h-[882px] left-[743px] top-[34px] absolute flex-col justify-start items-center inline-flex">
        <form onSubmit={handleSubmit} className="self-stretch h-[882px] py-[50px] flex-col justify-center items-center gap-[50px] flex">
          <div className="h-[524px] flex-col justify-start items-start gap-[30px] flex">
          <div className="flex flex-col items-center justify-center gap-3">
              <div className="self-stretch text-[#27272e] text-[28px] font-semibold font-serif leading-[38.09px] text-center">Autentificación de Usuarios</div>
              <div className="self-stretch text-[#27272e] text-base font-thin font-['Inter'] leading-relaxed text-center">Que bueno es tenerte de vuelta, estemos listos para darlo todo.</div>
            </div>

            <div className="h-[216px] pt-6 flex-col justify-center items- gap-[30px] flex">
              <div className="self-stretch h-[71px] flex-col justify-start items-start flex">
                <div className="self-stretch h-[71px] flex-col justify-start items-start gap-2 flex">
                  <label className="w-[424px] text-[#425466] text-sm font-medium font-['Inter']">Usuario</label>
                  <input
                    type="text"
                    className={claseImputs}
                    placeholder="Ingrese su nombre de usuario"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                    
                  />
                </div>
              </div>
              <div className="self-stretch h-[91px] flex-col justify-start items-start flex">
                <div className="self-stretch h-[91px] flex-col justify-start items-start gap-2 flex">
                  <label className="w-[424px] text-[#425466] text-sm font-medium font-['Inter']">Password</label>
                  <input
                    type="password"
                    className={claseImputs}
                    placeholder="Escriba su password"
                    value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="h-3 text-right">
                    <a href="/passwordreset" className="w-[424px] text-[#8015a7] text-[11px] font-normal font-['Inter'] leading-3">Olvido su Password?</a>
                  </div>
                </div>
              </div>
            </div>
        {/* Contenedor para el CircularProgress */}
        {loading ? (
              <div className="flex justify-center items-center w-full h-full">
                <CircularProgress style={{ color: '#25aa80' }} />
              </div>
            ) : (
              <button type="submit" className="w-[424px] px-6 py-4 bg-[#131416] rounded-[90px] text-center text-[#fbfcfc] text-base font-bold font-['DM Sans'] leading-none">Ingresar</button>
            )}

            {/* Contenedor para mostrar errores */}
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded mt-5">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        </form>
        <div className="p-2.5 justify-start items-start gap-2.5 inline-flex">
          <div className="text-right">
            <span className="text-[#718096] text-sm font-semibold font-['Inter'] leading-normal">Aun no tienes tu usuario registrado?</span>
            <span className="text-[#425466] text-sm font-semibold font-['Inter'] leading-normal"> </span>
            <a href="/register" className="text-[#25aa80] text-sm font-black font-['Inter'] leading-normal">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;