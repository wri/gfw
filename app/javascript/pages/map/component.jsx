import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tooltip } from 'react-tippy';
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
import Tip from 'components/ui/tip';
import AreaOfInterestModal from 'components/modals/area-of-interest';
// import MapPrompts from 'components/prompts/map-prompts';
// import ModalWelcome from 'components/modals/welcome';
// import RecentImagery from 'components/recent-imagery';

import DataAnalysisMenu from './components/data-analysis-menu';
import MapControlButtons from './components/map-controls';

import './styles.scss';

class MainMapComponent extends PureComponent {
  static propTypes = {
    handleShowTooltip: PropTypes.func,
    onDrawComplete: PropTypes.func,
    handleClickAnalysis: PropTypes.func,
    handleClickMap: PropTypes.func,
    oneClickAnalysis: PropTypes.bool,
    hidePanels: PropTypes.bool,
    embed: PropTypes.bool,
    recentActive: PropTypes.bool,
    tooltipData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    showTooltip: PropTypes.bool,
    setMainMapAnalysisView: PropTypes.func
  };

  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      embed,
      hidePanels,
      oneClickAnalysis,
      showTooltip,
      tooltipData,
      handleClickMap,
      handleShowTooltip,
      recentActive,
      handleClickAnalysis,
      setMainMapAnalysisView,
      onDrawComplete
    } = this.props;

    return (
      <div className={cx('c-map-main', { embed })}>
        <div
          className="main-map-container"
          role="button"
          tabIndex={0}
          onClick={handleClickMap}
          onMouseOver={() =>
            oneClickAnalysis &&
            handleShowTooltip(true, 'Click shape to analyze.')}
          onFocus={() => oneClickAnalysis &&
            handleShowTooltip(true, 'Click shape to analyze.')}
          onMouseOut={() => handleShowTooltip(false, '')}
          onBlur={() => handleShowTooltip(false, '')}
        >
          <Tooltip
            className="map-tooltip"
            theme="tip"
            html={(
              <Tip
                className="map-hover-tooltip"
                text={this.renderInfoTooltip(tooltipData)}
              />
            )}
            position="top"
            followCursor
            hideOnClick
            animateFill={false}
            open={showTooltip}
          >
            <Map
              className="main-map"
              onSelectBoundary={setMainMapAnalysisView}
              onDrawComplete={onDrawComplete}
              popupActions={[
                {
                  label: 'Analyze',
                  action: handleClickAnalysis
                }
              ]}
            />
          </Tooltip>
        </div>
        {!hidePanels && (
          <Media greaterThanOrEqual="md">
            <DataAnalysisMenu
              className="data-analysis-menu"
              embed={embed}
            />
          </Media>
        )}
        {!embed && (
          <>
            <Media greaterThanOrEqual="md">
              <MapControlButtons
                className="main-map-controls"
                isDesktop
              />
            </Media>
            <Media lessThan="md">
              <MapControlButtons
                className="main-map-controls"
              />
            </Media>
          </>
        )}
        {/* <RecentImagery active={recentActive} /> */}
        {/* {!embed && (
          <Media greaterThanOrEqual="md">
            {!embed && <MapPrompts />}
            <ModalWelcome />
          </Media>
        )} */}
        <Share />
        <ModalMeta />
        <ModalSource />
        <CountryDataProvider />
        <WhitelistsProvider />
        <GeodescriberProvider />
        <AreaOfInterestModal viewAfterSave clearAfterDelete canDelete />
        <AreasProvider />
        <PlanetBasemapsProvider />
        <LatestProvider />
        <GeostoreProvider />
        <DatasetsProvider />
      </div>
    );
  }
}

export default MainMapComponent;
