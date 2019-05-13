import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import bbox from 'turf-bbox';
import { Popup as MapPopup } from 'react-map-gl';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';

import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';

class Popup extends Component {
  componentDidUpdate(prevProps) {
    const { interactions } = this.props;
    const { activeDatasets, clearMapInteractions } = prevProps;
    if (
      isEmpty(interactions) &&
      !isEqual(activeDatasets.length, this.props.activeDatasets.length)
    ) {
      clearMapInteractions();
    }
  }

  handleClickZoom = selected => {
    const { setMapSettings, clearMapInteractions } = this.props;
    const newBbox = bbox(selected.geometry);
    setMapSettings({ canBound: true, bbox: newBbox });
    clearMapInteractions();
  };

  handleClickAction = (selected, handleAction) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    handleAction({
      data,
      layer,
      geometry,
      isUse,
      isAdmin,
      isWdpa
    });

    this.props.clearMapInteractions();
  };

  render() {
    const {
      tableData,
      cardData,
      latlng,
      interactions,
      selected,
      setMapInteractionSelected,
      clearMapInteractions,
      onSelectBoundary,
      setMapSettings,
      isBoundary,
      zoomToShape,
      buttons
    } = this.props;

    return latlng && latlng.lat && selected && !selected.data.cluster ? (
      <MapPopup
        latitude={latlng.lat}
        longitude={latlng.lng}
        onClose={clearMapInteractions}
        closeOnClick={false}
      >
        <div className="c-popup">
          {cardData ? (
            <Card
              className="popup-card"
              theme="theme-card-small"
              data={{
                ...cardData,
                buttons: cardData.buttons.map(
                  b =>
                    (b.text === 'ZOOM'
                      ? {
                        ...b,
                        onClick: () =>
                          setMapSettings({
                            canBound: true,
                            bbox: cardData.bbox
                          })
                      }
                      : b)
                )
              }}
            />
          ) : (
            <div className="popup-table">
              {interactions &&
                interactions.length > 1 && (
                  <Dropdown
                    className="layer-selector"
                    theme="theme-dropdown-native"
                    value={selected}
                    options={interactions}
                    onChange={setMapInteractionSelected}
                    native
                  />
                )}
              {selected &&
                interactions.length === 1 && (
                  <div className="popup-title">{selected.label}</div>
                )}
              {isBoundary ? (
                <BoundarySentence
                  selected={selected}
                  data={tableData}
                  onSelectBoundary={onSelectBoundary}
                />
              ) : (
                <DataTable data={tableData} />
              )}
              <div className="popup-footer">
                {zoomToShape ? (
                  <Button onClick={() => this.handleClickZoom(selected)}>
                    Zoom
                  </Button>
                ) : (
                  buttons &&
                  buttons.map(p => (
                    <Button
                      key={p.label}
                      onClick={() => this.handleClickAction(selected, p.action)}
                    >
                      {p.label}
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </MapPopup>
    ) : null;
  }
}

Popup.propTypes = {
  clearMapInteractions: PropTypes.func,
  setMapInteractionSelected: PropTypes.func,
  latlng: PropTypes.object,
  selected: PropTypes.object,
  interactions: PropTypes.array,
  tableData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isBoundary: PropTypes.bool,
  cardData: PropTypes.object,
  activeDatasets: PropTypes.array,
  onSelectBoundary: PropTypes.func,
  setMapSettings: PropTypes.func,
  zoomToShape: PropTypes.bool,
  buttons: PropTypes.array
};

export default Popup;
