import PropTypes from 'prop-types';

import { Desktop, Mobile } from 'gfw-components';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import AreasProvider from 'providers/areas-provider';
import PlanetBasemapsProvider from 'providers/planet-provider';
import LocationProvider from 'providers/location-provider';
import MyGFWProvider from 'providers/mygfw-provider';

import MetaModal from 'components/modals/meta';
import ShareModal from 'components/modals/share';
import AreaOfInterestModal from 'components/modals/area-of-interest';

import Map from 'components/map';
import MapPrompts from 'components/prompts/map-prompts';
import RecentImagery from 'components/recent-imagery';
import MapMenu from 'components/map-menu';

import DataAnalysisMenu from './components/data-analysis-menu';
import MapControlButtons from './components/map-controls';

import './styles.scss';

const MapPage = ({
  hidePanels,
  handleClickMap,
  recentActive,
  handleClickAnalysis,
  onDrawComplete,
}) => (
  <div className="c-map-page">
    <Desktop>
      <MapMenu className="map-menu" isDesktop />
    </Desktop>
    <Mobile>
      <MapMenu className="map-menu" />
    </Mobile>
    <div
      className="map-container"
      role="button"
      tabIndex={0}
      onClick={handleClickMap}
    >
      <Map
        className="map"
        onDrawComplete={onDrawComplete}
        onClickAnalysis={handleClickAnalysis}
      />
    </div>
    <Desktop>
      <>
        {!hidePanels && <DataAnalysisMenu className="data-analysis-menu" />}
        <MapControlButtons className="map-controls" isDesktop />
        <MapPrompts />
      </>
    </Desktop>
    <Mobile>
      <MapControlButtons className="map-controls" />
    </Mobile>
    <RecentImagery active={recentActive} />
    <ShareModal />
    <MetaModal />
    <AreaOfInterestModal clearAfterDelete canDelete />
    <CountryDataProvider />
    <WhitelistsProvider />
    <DatasetsProvider />
    <LatestProvider />
    <GeostoreProvider />
    <GeodescriberProvider />
    <AreasProvider />
    <PlanetBasemapsProvider />
    <LocationProvider />
    <MyGFWProvider />
  </div>
);

MapPage.propTypes = {
  onDrawComplete: PropTypes.func,
  handleClickAnalysis: PropTypes.func,
  handleClickMap: PropTypes.func,
  hidePanels: PropTypes.bool,
  recentActive: PropTypes.bool,
};

export default MapPage;
