import MapPage from 'layouts/map';

import gfwLogo from 'assets/logos/gfw.png';

const MapEmbedPage = () => (
  <div className="l-embed-map-page">
    <a className="embed-logo" href="/" target="_blank">
      <img src={gfwLogo} alt="Global Forest Watch" />
    </a>
    <MapPage embed />
  </div>
);

export default MapEmbedPage;
