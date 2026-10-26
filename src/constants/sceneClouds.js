import cloudLeft from '../assets/images/cloud-left.png';
import cloudRight from '../assets/images/cloud-right.png';

/**
 * Cada nube es independiente. Propiedades de `style`:
 *  - top / bottom / left / right: posición (% del panel o px). Los negativos la sacan del panel.
 *  - width: tamaño (la altura se ajusta sola).
 *  - transform: 'scaleX(-1)' para voltearla.
 *  - opacity: 0 a 1.
 */

export const WELCOME_CLOUDS = [
  { id: 'welcome-left', src: cloudLeft, style: { top: '22%', left: '-20%', width: '38%' } },
  { id: 'welcome-right', src: cloudRight, style: { top: '8%', right: '-28%', width: '65%' } },
];

export const LOGIN_CLOUDS = [
  { id: 'login-left', src: cloudLeft, style: { top: '16%', left: '-28%', width: '55%' } },
  { id: 'login-right', src: cloudRight, style: { top: '24%', right: '-28%', width: '65%' } },
];