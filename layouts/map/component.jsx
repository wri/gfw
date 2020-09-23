import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Media } from 'utils/responsive';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import AreasProvider from 'providers/areas-provider';
import PlanetBasemapsProvider from 'providers/planet-provider';

import Map from 'components/map';
import ModalMeta from 'components/modals/meta';
import ModalSource from 'components/modals/sources';
import Share from 'components/modals/share';
import AreaOfInterestModal from 'components/modals/area-of-interest';
import MapPrompts from 'components/prompts/map-prompts';
import ModalWelcome from 'components/modals/welcome';
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
    setMainMapAnalysisView: PropTypes.func,
  };

  renderInfoTooltip = (string) => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      embed,
      hidePanels,
      handleClickMap,
      recentActive,
      handleClickAnalysis,
      setMainMapAnalysisView,
      onDrawComplete,
    } = this.props;

    return (
      <div className={cx('c-map-main', { embed })}>
        <Media greaterThanOrEqual="md">
          <MapMenu className="map-menu" embed={embed} isDesktop />
        </Media>
        <Media lessThan="md">
          <MapMenu className="map-menu" embed={embed} />
        </Media>
        <div
          className="main-map-container"
          role="button"
          tabIndex={0}
          onClick={handleClickMap}
        >
          <Map
            className="main-map"
            onSelectBoundary={setMainMapAnalysisView}
            onDrawComplete={onDrawComplete}
            popupActions={[
              {
                label: 'Analyze',
                action: handleClickAnalysis,
              },
            ]}
          />
        </div>
        {!hidePanels && (
          <Media greaterThanOrEqual="md">
            <DataAnalysisMenu className="data-analysis-menu" embed={embed} />
          </Media>
        )}
        <RecentImagery active={recentActive} />
        {!embed && (
          <>
            <Media greaterThanOrEqual="md">
              <>
                {!embed && <MapPrompts />}
                <ModalWelcome />
                <MapControlButtons className="main-map-controls" isDesktop />
              </>
            </Media>
            <Media lessThan="md">
              <>
                <MapControlButtons
                  className="main-map-controls"
                  isDesktop={false}
                />
              </>
            </Media>
          </>
        )}
        <Share />
        <ModalMeta />
        <ModalSource />
        <CountryDataProvider />
        <WhitelistsProvider />
        <DatasetsProvider />
        <LatestProvider />
        <GeostoreProvider />
        <GeodescriberProvider />
        <AreaOfInterestModal viewAfterSave clearAfterDelete canDelete />
        <AreasProvider />
        <PlanetBasemapsProvider />
      </div>
    );
  }
}

export default MainMapComponent;
