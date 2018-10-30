import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import { SCREEN_M } from 'utils/constants';
import upperFirst from 'lodash/upperFirst';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';
import iconCrosshair from 'assets/icons/crosshair.svg';
import MediaQuery from 'react-responsive';
import RecentImagery from 'components/map-v2/components/recent-imagery';
import SubscribeModal from 'components/modals/subscribe';

import Popup from './components/popup';
import MapControlButtons from './components/map-controls';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';
import LayerManagerComponent from './components/layer-manager';
import DataAnalysisMenu from './components/data-analysis-menu';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

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
      loading,
      error,
      mapOptions,
      basemap,
      label,
      handleMapMove,
      tooltipData,
      bbox,
      showTooltip,
      handleShowTooltip,
      handleRecentImageryTooltip,
      analysisActive,
      handleMapInteraction,
      oneClickAnalysisActive,
      draw,
      embed,
      hidePanels,
      onMapClick
    } = this.props;

    return (
      <div
        className="c-map"
        style={{ backgroundColor: basemap.color }}
        onMouseOver={() =>
          oneClickAnalysisActive &&
          handleShowTooltip(true, 'Click shape to analyze.')
        }
        onMouseOut={() => handleShowTooltip(false, '')}
      >
        <MediaQuery minDeviceWidth={SCREEN_M}>
          {isDesktop => (
            <Fragment>
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
                <div
                  className="map-click-container"
                  onClick={onMapClick}
                  role="button"
                  tabIndex={0}
                >
                  <Map
                    customClass={cx(
                      'map-wrapper',
                      { analysis: analysisActive },
                      { embed }
                    )}
                    onReady={map => {
                      this.map = map;
                    }}
                    mapOptions={mapOptions}
                    basemap={basemap}
                    label={label}
                    bounds={
                      bbox
                        ? {
                          bbox,
                          options: {
                            padding: [50, 50]
                          }
                        }
                        : {}
                    }
                    events={{
                      move: handleMapMove
                    }}
                  >
                    {map => (
                      <Fragment>
                        <LayerManagerComponent
                          map={map}
                          handleMapInteraction={handleMapInteraction}
                          handleRecentImageryTooltip={
                            handleRecentImageryTooltip
                          }
                          handleShowTooltip={handleShowTooltip}
                        />
                        <Popup map={map} />
                        {draw && <MapDraw map={map} />}
                      </Fragment>
                    )}
                  </Map>
                </div>
              </Tooltip>
              {isDesktop &&
                !hidePanels && (
                  <DataAnalysisMenu
                    className={cx('data-analysis-menu', { embed })}
                    embed={embed}
                  />
                )}
              {!embed && (
                <MapControlButtons
                  className="map-controls"
                  embed={embed}
                  isDesktop={isDesktop}
                />
              )}
              <RecentImagery />
              <Icon className="icon-crosshair" icon={iconCrosshair} />
              <MapAttributions className={cx('map-attributions', { embed })} />
              <SubscribeModal />
              {loading && (
                <Loader className="map-loader" theme="theme-loader-light" />
              )}
              {!loading &&
                error && (
                  <NoContent message="An error occured. Please try again later." />
                )}
            </Fragment>
          )}
        </MediaQuery>
      </div>
    );
  }
}

MapComponent.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  handleMapMove: PropTypes.func,
  tooltipData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bbox: PropTypes.array,
  showTooltip: PropTypes.bool,
  handleShowTooltip: PropTypes.func,
  handleRecentImageryTooltip: PropTypes.func,
  onMapClick: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  analysisActive: PropTypes.bool,
  oneClickAnalysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  embed: PropTypes.bool,
  hidePanels: PropTypes.bool
};

export default MapComponent;
