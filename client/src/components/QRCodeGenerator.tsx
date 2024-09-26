// client/src/components/QRCodeGenerator.tsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  content: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ content }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, content, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [content]);

  return (
    <div className="mt-4">
      <canvas ref={canvasRef} />
    </div>
  );
};