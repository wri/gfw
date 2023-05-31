import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Desktop, Mobile } from '@worldresources/gfw-components';

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
import MetaProvider from 'providers/meta-provider';

import ModalWelcome from 'components/modals/welcome';
import MetaModal from 'components/modals/meta';
import ShareModal from 'components/modals/share';
import AreaOfInterestModal from 'components/modals/area-of-interest';
import ClimateModal from 'components/modals/climate';
import FiresModal from 'components/modals/fires';

import Map from 'components/map';
import MapPrompts from 'components/prompts/map-prompts';
import RecentImagery from 'components/recent-imagery';
import MapMenu from 'components/map-menu';

import DataAnalysisMenu from './components/data-analysis-menu';
import MapControlButtons from './components/map-controls';

import './styles.scss';

class MainMapComponent extends PureComponent {
  static propTypes = {
    onDrawComplete: PropTypes.func,
    handleClickAnalysis: PropTypes.func,
    handleClickMap: PropTypes.func,
    hidePanels: PropTypes.bool,
    embed: PropTypes.bool,
    recentActive: PropTypes.bool,
  };

  render() {
    const {
      embed,
      hidePanels,
      handleClickMap,
      recentActive,
      handleClickAnalysis,
      onDrawComplete,
    } = this.props;

    return (
      <div className={cx('c-map-main', { embed })}>
        <Desktop>
          <MapMenu className="map-menu" embed={embed} isDesktop />
        </Desktop>
        <Mobile>
          <MapMenu className="map-menu" embed={embed} />
        </Mobile>
        <div
          className="main-map-container"
          role="button"
          tabIndex={0}
          onClick={handleClickMap}
        >
          <Map
            className="main-map"
            onDrawComplete={onDrawComplete}
            onClickAnalysis={handleClickAnalysis}
          />
        </div>
        {!hidePanels && (
          <Desktop>
            <DataAnalysisMenu className="data-analysis-menu" embed={embed} />
          </Desktop>
        )}
        {!embed && (
          <>
            <Desktop>
              <>
                {!embed && <MapPrompts />}
                <ModalWelcome />
                <MapControlButtons className="main-map-controls" isDesktop />
              </>
            </Desktop>
            <Mobile>
              <>
                <MapControlButtons
                  className="main-map-controls"
                  isDesktop={false}
                />
              </>
            </Mobile>
          </>
        )}
        <RecentImagery active={recentActive} />
        <ShareModal />
        <MetaModal />
        <AreaOfInterestModal viewAfterSave clearAfterDelete canDelete />
        <ClimateModal />
        <FiresModal />
        <CountryDataProvider />
        <WhitelistsProvider />
        <MetaProvider />
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
  }
}
export default MainMapComponent;
