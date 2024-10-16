import Image from 'next/image';

const IconLogo = () => {
  return (
    <div className="flex mb-1 ">
      <Image 
        src="/apple.png" // Ruta de la imagen en la carpeta public
        alt="Descripción de la imagen"
        width={50} // Ancho de la imagen
        height={50} // Alto de la imagen
        className="rounded-lg" // Clases de Tailwind CSS (opcional)
      />
      <label className='flex mt-2 justify-between'>
        Vida Saludable
      </label>
    </div>
  );
};

export default IconLogo;
