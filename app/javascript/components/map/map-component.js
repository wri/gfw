import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Map from 'wri-api-components/dist/map';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import Popup from './components/popup';
import MapControlButtons from './components/map-controls';
import MapAttributions from './components/map-attributions';
import RecentImagery from './components/recent-imagery';

import './map-styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
    });
  }

  render() {
    const {
      loading,
      error,
      activeLayers,
      mapOptions,
      basemap,
      label,
      setMapSettings,
      bbox,
      recentImagery,
      setInteraction
    } = this.props;

    return (
      <Fragment>
        <Map
          customClass="c-map"
          onReady={map => {
            this.map = map;
          }}
          mapOptions={mapOptions}
          basemap={basemap}
          label={label}
          bounds={bbox}
          events={{
            zoomend: (e, map) => {
              setMapSettings({ zoom: map.getZoom() });
            },
            dragend: (e, map) => {
              setMapSettings({ center: map.getCenter() });
            }
          }}
        >
          {map => (
            <Fragment>
              <LayerManager map={map} plugin={PluginLeaflet}>
                {activeLayers.map(l => {
                  const { interactionConfig } = l;
                  const { output, article } = interactionConfig || {};
                  const layer = {
                    ...l,
                    ...(!isEmpty(output) && {
                      interactivity: output.map(i => i.column),
                      events: {
                        click: e => {
                          setInteraction({
                            ...e,
                            label: l.name,
                            article,
                            id: l.id,
                            value: l.id,
                            config: output
                          });
                        }
                      }
                    })
                  };

                  return <Layer key={l.id} {...layer} />;
                })}
              </LayerManager>
              <Popup map={map} />
              <MapControlButtons className="map-controls" map={map} />
              {recentImagery && (
                <DragDropContextProvider backend={HTML5Backend}>
                  <RecentImagery map={map} />
                </DragDropContextProvider>
              )}
            </Fragment>
          )}
        </Map>
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
      </Fragment>
    );
  }
}

MapComponent.propTypes = {
  loading: PropTypes.bool,
  activeLayers: PropTypes.array,
  error: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  setMapSettings: PropTypes.func,
  setInteraction: PropTypes.func,
  bbox: PropTypes.object,
  recentImagery: PropTypes.bool
};

export default MapComponent;
