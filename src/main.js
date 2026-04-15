import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { registerRoute, startRouter } from './router.js';
import { renderGlobe } from './views/globe.js';
import { renderCountry } from './views/country.js';

registerSW({ immediate: true });

const appRoot = document.getElementById('app');

registerRoute('/', (root) => renderGlobe(root));
registerRoute('/country/:iso', (root, params) => renderCountry(root, params));

startRouter(appRoot);

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
});
