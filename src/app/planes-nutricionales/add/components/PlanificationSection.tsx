import React, { useState } from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import SectionDivider from './SectionDivider';
import { FaWeight, FaChartPie, FaRunning, FaHeartbeat, FaAppleAlt, FaWater, FaCheckCircle,  FaStop, FaExclamationTriangle } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { MdGppGood } from 'react-icons/md';
import { CgDanger } from "react-icons/cg";
import { IoBodySharp } from "react-icons/io5";

// Componente para las barras de progreso
const ProgressBar: React.FC<{ progress: number; setProgress: (value: number) => void }> = ({ progress, setProgress }) => {
    const maxProgressValue = 200; // Cambia esto según el valor máximo esperado
    const limitedProgress = Math.min(Math.max(progress, 0), maxProgressValue);
    const scaledProgress = (limitedProgress / maxProgressValue) * 100; // Escalar a 0-100

    // Determinar el color de la barra
    let barColor = '#007BFF'; // Azul por defecto
    let alertMessage = '';
    let alertIcon = null;

    if (scaledProgress < 25) {
        barColor = '#007BFF'; // Azul
        alertMessage = 'Valores bajos';
        alertIcon = <MdGppGood className="text-blue-700" />;
    } else if (scaledProgress < 50) {
        barColor = '#FFA500'; // Naranja
        alertMessage = 'Valores en alerta';
        alertIcon = <FaExclamationTriangle className="text-yellow-500" />;
    } else if (scaledProgress < 75) {
        barColor = '#28A745'; // Verde
        alertMessage = 'Valores normales';
        alertIcon = <FaCheckCircle className="text-green-500" />;
    } else {
        barColor = '#DC3545'; // Rojo
        alertMessage = 'Valores críticos';
        alertIcon = <CgDanger className="text-red-500" />;
    }

    return (
        <Box className="w-full h-[20px] bg-gray-200 rounded-full relative mb-4">
            <Box
                className="h-full rounded-full" // Asegúrate de que la barra también tenga bordes redondeados
                style={{ width: `${scaledProgress}%`, backgroundColor: barColor, transition: 'width 0.5s ease-in-out' }}
            />
            <Box
                className="absolute top-[-5px] left-0 w-5 h-5 bg-white rounded-full border-2 border-[#007BFF] cursor-pointer"
                style={{ transform: `translateX(${scaledProgress - 5}%)` }}
                onMouseDown={(e) => {
                    const handleMouseMove = (event: MouseEvent) => {
                        const newProgress = Math.min(Math.max(0, ((event.clientX - (e.target as HTMLElement).getBoundingClientRect().left) / ((e.target as HTMLElement).parentElement as HTMLElement).offsetWidth) * maxProgressValue), maxProgressValue);
                        setProgress(newProgress);
                    };

                    const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                }}
            />
            <Box className="mt-1 flex items-center">
                {alertIcon}
                <Typography className="ml-2">{alertMessage}</Typography>
            </Box>
        </Box>
    );
};
// Componente para las barras de progreso cilíndricas
const CircularProgressBar: React.FC<{ label: string; value: number; setValue: (value: number) => void }> = ({ label, value, setValue }) => {
    return (
        <Box className="flex flex-col items-center w-full"> {/* Asegúrate de que el contenedor sea de ancho completo */}
            <Box className="w-24 h-24 relative">
                <Box className="absolute inset-0 rounded-full bg-gray-200">
                    <Box
                        className="h-full rounded-full"
                        style={{
                            width: `${value}%`,
                            backgroundColor: value < 25 ? '#007BFF' : value < 50 ? '#FFA500' : value < 75 ? '#28A745' : '#DC3545',
                            transition: 'width 0.5s ease-in-out',
                            borderRadius: '50%',
                        }}
                    />
                </Box>
                <Box
                    className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-white"
                    style={{
                        clipPath: `inset(0 ${100 - value}% 0 0)`,
                    }}
                />
            </Box>
            <Typography className="mt-2">{label}</Typography>
            <TextField
                fullWidth
                label={label}
                name={label.toLowerCase()}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                variant="outlined"
                multiline
                rows={1}
            />
        </Box>
    );
};


const PlanificationSection = () => {
    const [pesoActual, setPesoActual] = useState(50);
    const [grasaCorporal, setGrasaCorporal] = useState(30);
    const [nivelActividad, setNivelActividad] = useState('Medio');
    const [imc, setImc] = useState(22);
    const [metabolismoBasal, setMetabolismoBasal] = useState(1500);
    const [ingestaCalorica, setIngestaCalorica] = useState(2000);
    const [grasaVisceral, setGrasaVisceral] = useState(15);
    const [masaMuscular, setMasaMuscular] = useState(40);
    const [aguaCuerpo, setAguaCuerpo] = useState(60);

    // Valores de macronutrientes
    const [carbohidratos, setCarbohidratos] = useState(50);
    const [proteinas, setProteinas] = useState(30);
    const [lipidos, setLipidos] = useState(20);

    return (
        <Box className="w-full max-w-[1337px] p-5 rounded-lg">
            <SectionDivider top={0} text={'Informaciones del paciente'} />
 
            <Grid container spacing={3} mb={3}>
                {/* Input para Peso Actual */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaWeight className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="Peso Actual"
                            name="pesoActual"
                            value={pesoActual}
                            onChange={(e) => setPesoActual(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={pesoActual} setProgress={setPesoActual} />
                </Grid>

                {/* Input para % de Grasa Corporal */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaChartPie className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="% Grasa Corporal"
                            name="grasaCorporal"
                            value={grasaCorporal}
                            onChange={(e) => setGrasaCorporal(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={grasaCorporal} setProgress={setGrasaCorporal} />
                </Grid>

                {/* Input para Nivel de Actividad */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-8">
                        <FaRunning className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="Nivel de Actividad"
                            name="nivelActividad"
                            value={nivelActividad}
                            onChange={(e) => setNivelActividad(e.target.value)}
                            variant="outlined"
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                        </TextField>
                    </Box>
                    <ProgressBar progress={nivelActividad === 'Bajo' ? 30 : nivelActividad === 'Medio' ? 60 : 100} setProgress={(value) => setNivelActividad(value === 30 ? 'Bajo' : value === 60 ? 'Medio' : 'Alto')} />
                </Grid>
            </Grid>

            {/* Sección de Métricas de Evaluación Nutricional */}
            <Box className="w-full max-w-[1337px] rounded-lg">
                <SectionDivider top={0} text={'Métricas de Evaluación Nutricional'} />
            </Box>

            <Grid container spacing={3} mb={3}>
                {/* Input para IMC */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <IoBodySharp className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="IMC"
                            name="imc"
                            value={imc}
                            onChange={(e) => setImc(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={imc} setProgress={setImc} />
                </Grid>

                {/* Input para Metabolismo Basal */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaAppleAlt className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="Metabolismo Basal"
                            name="metabolismoBasal"
                            value={metabolismoBasal}
                            onChange={(e) => setMetabolismoBasal(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={metabolismoBasal} setProgress={setMetabolismoBasal} />
                </Grid>

                {/* Input para Ingesta Calórica */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaAppleAlt className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="Ingesta Calórica"
                            name="ingestaCalorica"
                            value={ingestaCalorica}
                            onChange={(e) => setIngestaCalorica(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={ingestaCalorica} setProgress={setIngestaCalorica} />
                </Grid>

                {/* Input para % de Grasa Visceral */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaChartPie className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="% Grasa Visceral"
                            name="grasaVisceral"
                            value={grasaVisceral}
                            onChange={(e) => setGrasaVisceral(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={grasaVisceral} setProgress={setGrasaVisceral} />
                </Grid>

                {/* Input para Nivel de Masa Muscular */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <GiMuscleUp className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="Nivel de Masa Muscular"
                            name="masaMuscular"
                            value={masaMuscular}
                            onChange={(e) => setMasaMuscular(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={masaMuscular} setProgress={setMasaMuscular} />
                </Grid>

                {/* Input para % de Agua en el Cuerpo */}
                <Grid item xs={12} sm={4}>
                    <Box className="flex items-center mb-2">
                        <FaWater className="text-[#00A896] mr-2" />
                        <TextField
                            fullWidth
                            label="% Agua en el Cuerpo"
                            name="aguaCuerpo"
                            value={aguaCuerpo}
                            onChange={(e) => setAguaCuerpo(Number(e.target.value))}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <ProgressBar progress={aguaCuerpo} setProgress={setAguaCuerpo} />
                </Grid>
            </Grid>

            {/* Sección de Cálculo de Macronutrientes */}
            <Box className="w-full max-w-[1337px] rounded-lg">
                <SectionDivider top={0} text={'Cálculo de Macronutrientes'} />
            </Box>

            <Grid container spacing={3} mb={3}>
                {/* Gráfico Circular para Carbohidratos */}
                <Grid item xs={12} sm={4}>
                    <CircularProgressBar label="Carbohidratos" value={carbohidratos} setValue={setCarbohidratos} />
                </Grid>

                {/* Gráfico Circular para Proteínas */}
                <Grid item xs={12} sm={4}>
                    <CircularProgressBar label="Proteínas" value={proteinas} setValue={setProteinas} />
                </Grid>

                {/* Gráfico Circular para Lípidos */}
                <Grid item xs={12} sm={4}>
                    <CircularProgressBar label="Lípidos" value={lipidos} setValue={setLipidos} />
                </Grid>
            </Grid>
       </Box>
    );
}

export default PlanificationSection;