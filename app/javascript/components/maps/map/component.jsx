import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';

import iconCrosshair from 'assets/icons/crosshair.svg';

import Popup from 'components/maps/components/popup';
import MapDraw from 'components/maps/components/draw';
import MapAttributions from 'components/maps/components/map-attributions';
import LayerManagerComponent from 'components/maps/components/layer-manager';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

  render() {
    const {
      loading,
      error,
      mapOptions,
      basemap,
      label,
      handleMapMove,
      bbox,
      analysisActive,
      handleMapInteraction,
      draw,
      embed
    } = this.props;

    return (
      <div className="c-map" style={{ backgroundColor: basemap.color }}>
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
            moveend: handleMapMove
          }}
        >
          {map => (
            <Fragment>
              <LayerManagerComponent
                map={map}
                handleMapInteraction={handleMapInteraction}
              />
              <Popup map={map} />
              {draw && <MapDraw map={map} />}
            </Fragment>
          )}
        </Map>
        <Icon className="icon-crosshair" icon={iconCrosshair} />
        <MapAttributions className={cx('map-attributions', { embed })} />
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
  bbox: PropTypes.array,
  handleMapInteraction: PropTypes.func,
  analysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  embed: PropTypes.bool
};

export default MapComponent;
