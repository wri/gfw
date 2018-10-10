import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';
import iconCross from 'assets/icons/close.svg';

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
      hidePanels
    } = this.props;

    return (
      <div
        className={cx()}
        style={{ backgroundColor: basemap.color }}
        onMouseOver={() =>
          oneClickAnalysisActive &&
          handleShowTooltip(true, 'Click shape to analyze.')
        }
        onMouseOut={() => handleShowTooltip(false, '')}
      >
        <Tooltip
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
        >
          <Map
            customClass={cx('c-map', { analysis: analysisActive }, { embed })}
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
                    paddingTopLeft: [100, 100],
                    paddingBottomRight: [50, 50]
                  }
                }
                : {}
            }
            events={{
              zoomend: handleMapMove,
              dragend: handleMapMove
            }}
          >
            {map => (
              <Fragment>
                <LayerManagerComponent
                  map={map}
                  handleMapInteraction={handleMapInteraction}
                  handleRecentImageryTooltip={handleRecentImageryTooltip}
                  handleShowTooltip={handleShowTooltip}
                />
                <Popup map={map} />
                <MapControlButtons className="map-controls" embed={embed} />
                {draw && <MapDraw map={map} />}
              </Fragment>
            )}
          </Map>
        </Tooltip>
        {!hidePanels && (
          <DataAnalysisMenu className={cx('data-analysis-menu', { embed })} />
        )}
        <Icon className="icon-crosshair" icon={iconCross} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
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
  handleMapInteraction: PropTypes.func,
  analysisActive: PropTypes.bool,
  oneClickAnalysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  embed: PropTypes.bool,
  hidePanels: PropTypes.bool
};

export default MapComponent;
