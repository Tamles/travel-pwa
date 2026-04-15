import './style.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const installBtn = document.getElementById('install-btn');
const statusEl = document.getElementById('install-status');

let deferredPrompt = null;

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

if (isStandalone) {
  statusEl.textContent = 'Running as an installed app.';
} else {
  statusEl.textContent = 'Open in a supported browser to install.';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
  statusEl.textContent = 'Ready to install.';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  statusEl.textContent =
    outcome === 'accepted' ? 'Installing…' : 'Install dismissed.';
  deferredPrompt = null;
  installBtn.hidden = true;
});

window.addEventListener('appinstalled', () => {
  statusEl.textContent = 'App installed.';
  installBtn.hidden = true;
});
