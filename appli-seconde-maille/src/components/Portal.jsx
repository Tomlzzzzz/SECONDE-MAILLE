import { createPortal } from 'react-dom';

/* Affiche une fenêtre au-dessus de toute l'appli (au-dessus de la barre d'onglets) */
export default function Portal({ children }) {
  const host = typeof document !== 'undefined' ? document.querySelector('.app') : null;
  return host ? createPortal(children, host) : children;
}
