// PatientSkeleton.tsx
import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

const PatientSkeleton: React.FC = () => (
    <Card className="mb-4">
        <CardContent className="flex items-center space-x-4">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
        </CardContent>
    </Card>
);

export default PatientSkeleton;