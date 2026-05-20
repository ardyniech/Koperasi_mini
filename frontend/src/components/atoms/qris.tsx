import React from 'react';

interface QrisImageProps {
  size?: number;
  className?: string;
}

const Qris: React.FC<QrisImageProps> = ({ size = 256, className = '' }) => {
  return (
    <div 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src="/qris.svg" 
        alt="QRIS Donation"
        className="w-full h-full object-contain"
        style={{ aspectRatio: '1/1' }}
      />
    </div>
  );
};

export default Qris;
