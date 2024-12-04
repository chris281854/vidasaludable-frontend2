

// src/components/SectionDivider.tsx


import { Box, Typography } from '@mui/material';
import React from 'react';
interface SectionDividerProps {
    top: number;
    text: string; // Nueva propiedad para el texto
}

const SectionDivider: React.FC<SectionDividerProps> = ({ top, text }) => {
    return (
        <Box bgcolor="black" borderRadius="20px" mt={5} mb={3} py={1} px={2}>
            <Typography variant="subtitle1" color="white" fontWeight="bold">
            {text}
          </Typography> 
        </Box>
    );
};

export default SectionDivider;