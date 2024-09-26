import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value }) => {
  const [size, setSize] = useState(128);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef}>
        {/* Use type assertion here */}
        {React.createElement(QRCode as any, {
          value: value,
          size: size,
          level: "H",
          includeMargin: true,
        })}
      </div>
      <div className="mt-4 flex items-center">
        <label htmlFor="size" className="mr-2">
          Size:
        </label>
        <input
          id="size"
          type="range"
          min="64"
          max="256"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="mr-2"
        />
        <span>{size}px</span>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;