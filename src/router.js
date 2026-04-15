const routes = [];
let rootEl = null;
let currentCleanup = null;

export function registerRoute(pattern, handler) {
  routes.push({ pattern, handler });
}

export function startRouter(el) {
  rootEl = el;
  window.addEventListener('hashchange', render);
  render();
}

export function navigate(path) {
  location.hash = path.startsWith('#') ? path : `#${path}`;
}

function render() {
  const path = location.hash.replace(/^#/, '') || '/';
  for (const { pattern, handler } of routes) {
    const params = matchRoute(pattern, path);
    if (params) {
      if (typeof currentCleanup === 'function') currentCleanup();
      rootEl.replaceChildren();
      currentCleanup = handler(rootEl, params) || null;
      return;
    }
  }
  rootEl.replaceChildren();
  const notFound = document.createElement('p');
  notFound.textContent = 'Not found';
  rootEl.appendChild(notFound);
}

function matchRoute(pattern, path) {
  const pp = pattern.split('/').filter(Boolean);
  const ap = path.split('/').filter(Boolean);
  if (pp.length !== ap.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) {
      params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
    } else if (pp[i] !== ap[i]) {
      return null;
    }
  }
  return params;
}
