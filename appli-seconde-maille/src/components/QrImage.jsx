import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/* QR code généré sur l'appareil (aucune donnée envoyée) */
export default function QrImage({ text, size = 220, className = '' }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text, { margin: 1, width: size * 2, errorCorrectionLevel: 'M', color: { dark: '#0F2926', light: '#FFFFFF' } })
      .then((u) => alive && setSrc(u))
      .catch(() => alive && setSrc(null));
    return () => {
      alive = false;
    };
  }, [text, size]);
  return (
    <div className={`bg-white rounded-2xl p-3 grid place-items-center ${className}`} style={{ width: size + 24, height: size + 24 }}>
      {src ? <img src={src} alt={`QR code : ${text}`} width={size} height={size} className="block [image-rendering:pixelated]" /> : <span className="w-full h-full rounded-xl bg-[#F5FBF9] animate-pulse" />}
    </div>
  );
}
