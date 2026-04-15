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

const installBtn = document.getElementById('install-btn');
let deferredPrompt = null;

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!isStandalone) installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  installBtn.hidden = true;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installBtn.hidden = true;
});
