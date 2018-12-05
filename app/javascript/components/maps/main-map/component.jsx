import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import MediaQuery from 'react-responsive';
import { track } from 'utils/analytics';
import { Tooltip } from 'react-tippy';

import Tip from 'components/ui/tip';
import Map from 'components/maps/map';
import SubscribeModal from 'components/modals/subscribe';

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
      handleShowTooltip,
      oneClickAnalysisActive,
      setRecentImagerySettings,
      handleRecentImageryTooltip,
      tileGeoJSON,
      draw,
      tooltipData,
      showTooltip,
      embed,
      hidePanels,
      onMapClick
    } = this.props;

    return (
      <MediaQuery minDeviceWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-map-main">
            <div
              className="main-map-container"
              onClick={onMapClick}
              role="button"
              tabIndex={0}
              onMouseOver={() =>
                oneClickAnalysisActive &&
                handleShowTooltip(true, 'Click shape to analyze.')
              }
              onMouseOut={() => handleShowTooltip(false, '')}
            >
              <Tooltip
                className="map-tooltip"
                theme="tip"
                hideOnClick
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
                animateFill={false}
                open={showTooltip}
                disabled={!isDesktop}
              >
                <Map
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
                  className={cx('data-analysis-menu', { embed })}
                  embed={embed}
                />
              )}
            {!embed && (
              <MapControlButtons
                className="main-map-controls"
                embed={embed}
                isDesktop={isDesktop}
              />
            )}
            <RecentImagery />
            <SubscribeModal />
          </div>
        )}
      </MediaQuery>
    );
  }
}

MainMapComponent.propTypes = {
  handleShowTooltip: PropTypes.func,
  onMapClick: PropTypes.func,
  oneClickAnalysisActive: PropTypes.bool,
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
