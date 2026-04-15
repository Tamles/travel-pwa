import Globe from 'globe.gl';
import { Color } from 'three';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { navigate } from '../router.js';

isoCountries.registerLocale(enLocale);

const countries = feature(worldData, worldData.objects.countries).features;

const LAND = '#f5e9c8';
const LAND_HOVER = '#fde68a';
const OCEAN = '#0b2545';
const STROKE = '#0f172a';

export function renderGlobe(root) {
  const container = document.createElement('div');
  container.className = 'globe-container';
  root.appendChild(container);

  let hoveredPolygon = null;

  const world = Globe()(container)
    .backgroundColor('#020617')
    .showAtmosphere(true)
    .atmosphereColor('#60a5fa')
    .atmosphereAltitude(0.18)
    .polygonsData(countries)
    .polygonAltitude((d) => (d === hoveredPolygon ? 0.012 : 0.006))
    .polygonCapColor((d) => (d === hoveredPolygon ? LAND_HOVER : LAND))
    .polygonSideColor(() => 'rgba(15, 23, 42, 0.35)')
    .polygonStrokeColor(() => STROKE)
    .polygonsTransitionDuration(180)
    .onPolygonHover((polygon) => {
      hoveredPolygon = polygon;
      container.style.cursor = polygon ? 'pointer' : 'grab';
    })
    .onPolygonClick((polygon) => {
      const iso2 = isoCountries.numericToAlpha2(String(polygon.id));
      const name = polygon.properties?.name || '';
      if (iso2) {
        navigate(`/country/${iso2}`);
      } else if (name) {
        navigate(`/country/${encodeURIComponent(name)}`);
      }
    })
    .width(window.innerWidth)
    .height(window.innerHeight);

  world.globeMaterial().color = new Color(OCEAN);

  const controls = world.controls();
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 180;
  controls.maxDistance = 600;

  container.style.cursor = 'grab';

  const onResize = () => {
    world.width(window.innerWidth).height(window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    world.pauseAnimation();
    container.replaceChildren();
    container.remove();
  };
}
