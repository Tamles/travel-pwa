import isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

isoCountries.registerLocale(enLocale);

export function renderCountry(root, params) {
  const { iso } = params;
  const name = isoCountries.getName(iso, 'en') || iso;

  const page = document.createElement('main');
  page.className = 'country-page';

  const back = document.createElement('a');
  back.href = '#/';
  back.className = 'back-link';
  back.textContent = '← Back to globe';

  const heading = document.createElement('h1');
  heading.textContent = name;

  const code = document.createElement('p');
  code.className = 'country-code';
  code.textContent = iso;

  const placeholder = document.createElement('p');
  placeholder.className = 'country-placeholder';
  placeholder.textContent = 'More details coming soon.';

  page.append(back, heading, code, placeholder);
  root.appendChild(page);
}
