import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import MediaQuery from 'react-responsive';
import { track } from 'app/analytics';
import { Tooltip } from 'react-tippy';

import Tip from 'components/ui/tip';
import Map from 'components/maps/map';
import SubscribeModal from 'components/modals/subscribe';
import MapTour from 'components/maps/main-map/components/map-tour';
import ModalWelcome from 'components/modals/welcome';
import RecentImagery from './components/recent-imagery';
import DataAnalysisMenu from './components/data-analysis-menu';
import MapControlButtons from './components/map-controls';

import './styles.scss';

class MainMapComponent extends PureComponent {
  renderDataTooltip = data => (
    <div>
      {Object.keys(data).map(key => (
        <p key={key}>
          <strong>{upperFirst(startCase(key).toLowerCase())}</strong>:{' '}
          {data[key]}
        </p>
      ))}
      <p className="view-more">Click to view more.</p>
    </div>
  );

  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      draw,
      embed,
      hidePanels,
      oneClickAnalysis,
      tileGeoJSON,
      showTooltip,
      tooltipData,
      setRecentImagerySettings,
      handleClickMap,
      handleRecentImageryTooltip,
      handleShowTooltip
    } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-map-main', { embed })}>
            <div
              className="main-map-container"
              role="button"
              tabIndex={0}
              onClick={handleClickMap}
              onMouseOver={() =>
                oneClickAnalysis &&
                handleShowTooltip(true, 'Click shape to analyze.')
              }
              onMouseOut={() => handleShowTooltip(false, '')}
            >
              <Tooltip
                className="map-tooltip"
                theme="tip"
                html={
                  <Tip
                    className="map-hover-tooltip"
                    text={
                      typeof tooltipData === 'string'
                        ? this.renderInfoTooltip(tooltipData)
                        : this.renderDataTooltip(tooltipData)
                    }
                  />
                }
                position="top"
                followCursor
                hideOnClick
                animateFill={false}
                open={showTooltip}
                disabled={!isDesktop}
              >
                <Map
                  className="main-map"
                  customLayers={
                    tileGeoJSON
                      ? [
                        {
                          id: 'recentImagery',
                          name: 'Geojson',
                          provider: 'leaflet',
                          layerConfig: {
                            type: 'geoJSON',
                            body: tileGeoJSON,
                            options: {
                              style: {
                                stroke: false,
                                fillOpacity: 0
                              }
                            }
                          },
                          interactivity: true,
                          events: {
                            click: () => {
                              if (!draw) {
                                setRecentImagerySettings({ visible: true });
                                track('recentImageryOpen');
                              }
                            },
                            mouseover: e => {
                              if (!draw) handleRecentImageryTooltip(e);
                            },
                            mouseout: () => {
                              if (!draw) handleShowTooltip(false, {});
                            }
                          }
                        }
                      ]
                      : null
                  }
                />
              </Tooltip>
            </div>
            {isDesktop &&
              !hidePanels && (
                <DataAnalysisMenu
                  className="data-analysis-menu"
                  embed={embed}
                />
              )}
            {!embed && (
              <MapControlButtons
                className="main-map-controls"
                isDesktop={isDesktop}
              />
            )}
            <RecentImagery />
            <SubscribeModal />
            {!embed &&
              isDesktop && (
                <Fragment>
                  <MapTour />
                  <ModalWelcome />
                </Fragment>
              )}
          </div>
        )}
      </MediaQuery>
    );
  }
}

MainMapComponent.propTypes = {
  handleShowTooltip: PropTypes.func,
  handleClickMap: PropTypes.func,
  oneClickAnalysis: PropTypes.bool,
  embed: PropTypes.bool,
  hidePanels: PropTypes.bool,
  setRecentImagerySettings: PropTypes.func,
  handleRecentImageryTooltip: PropTypes.func,
  tileGeoJSON: PropTypes.object,
  draw: PropTypes.bool,
  tooltipData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  showTooltip: PropTypes.bool
};

export default MainMapComponent;
