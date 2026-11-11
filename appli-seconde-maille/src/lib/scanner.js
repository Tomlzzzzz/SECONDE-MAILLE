import jsQR from 'jsqr';

/**
 * Lecture de QR code depuis la caméra.
 * 1. API native BarcodeDetector quand elle existe (Chrome Android, Safari récent…)
 * 2. sinon jsQR (fonctionne partout, y compris sur PC)
 */
export async function startScanner(video, onCode) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false
  });
  video.srcObject = stream;
  video.setAttribute('playsinline', '');
  await video.play();

  let detector = null;
  if ('BarcodeDetector' in window) {
    try {
      const formats = await window.BarcodeDetector.getSupportedFormats();
      if (formats.includes('qr_code')) detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch {
      detector = null;
    }
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let stopped = false;
  let last = 0;

  const loop = async (t) => {
    if (stopped) return;
    if (t - last > 180 && video.readyState >= 2) {
      last = t;
      try {
        if (detector) {
          const codes = await detector.detect(video);
          if (codes[0]?.rawValue) onCode(codes[0].rawValue);
        } else {
          const w = video.videoWidth;
          const h = video.videoHeight;
          const s = Math.min(1, 640 / w);
          canvas.width = Math.round(w * s);
          canvas.height = Math.round(h * s);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
          if (code?.data) onCode(code.data);
        }
      } catch {
        /* image illisible : on continue */
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return () => {
    stopped = true;
    stream.getTracks().forEach((tr) => tr.stop());
    video.srcObject = null;
  };
}
