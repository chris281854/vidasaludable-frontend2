// SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-10 bg-gray-200 rounded-md animate-pulse" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
