import React from 'react';
import QRCode from 'react-qr-code';

interface QrCodeGeneratorProps {
  value: string; // The value to encode in the QR code (e.g., snippet URL or token)
  size?: number; // Optional size of the QR code
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ value, size = 128 }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <QRCode value={value} size={size} />
    </div>
  );
};

export default QrCodeGenerator;
