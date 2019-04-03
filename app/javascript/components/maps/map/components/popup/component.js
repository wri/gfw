import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import bbox from 'turf-bbox';
import { Popup as MapPopup } from 'react-map-gl';
import cx from 'classnames';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';
import closeIcon from 'assets/icons/close.svg';
import Icon from 'components/ui/icon';

import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';

class Popup extends Component {
  componentDidUpdate(prevProps) {
    const { activeDatasets, clearInteractions } = prevProps;
    if (!isEqual(activeDatasets.length, this.props.activeDatasets.length)) {
      clearInteractions();
    }
  }

  handleClickAction = selected => {
    if (this.props.buttonState === 'ZOOM') {
      this.handleClickZoom(selected);
    } else {
      this.handleClickAnalysis(selected);
    }
  };

  handleClickZoom = selected => {
    const { setMapSettings } = this.props;
    const newBbox = bbox(selected.geometry);
    setMapSettings({ bbox: newBbox, canBound: true });
  };

  handleClickAnalysis = selected => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    const { getGeostoreId, setMainMapAnalysisView } = this.props;
    if (isAdmin || isWdpa || isUse) {
      setMainMapAnalysisView(selected);
    } else {
      getGeostoreId(geometry);
    }
  };

  render() {
    const {
      tableData,
      cardData,
      latlng,
      interactions,
      selected,
      setInteractionSelected,
      setMainMapAnalysisView,
      setMapSettings,
      clearInteractions,
      isBoundary,
      buttonState
    } = this.props;

    return latlng && latlng.lat && selected && !selected.data.cluster ? (
      <MapPopup
        latitude={latlng.lat}
        longitude={latlng.lng}
        closeButton={false}
      >
        <div className="c-popup">
          <Button
            className="close-btn"
            theme="theme-button-clear theme-button-small square"
            onClick={clearInteractions}
          >
            <Icon
              className={cx({ 'btn-on-card': cardData && !!cardData.image })}
              icon={closeIcon}
            />
          </Button>
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
                    onChange={setInteractionSelected}
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
                  setMainMapAnalysisView={setMainMapAnalysisView}
                />
              ) : (
                <DataTable data={tableData} />
              )}
              <div className="nav-footer">
                <Button onClick={() => this.handleClickAction(selected)}>
                  {buttonState}
                </Button>
              </div>
            </div>
          )}
        </div>
      </MapPopup>
    ) : null;
  }
}

Popup.propTypes = {
  clearInteractions: PropTypes.func,
  setInteractionSelected: PropTypes.func,
  latlng: PropTypes.object,
  selected: PropTypes.object,
  interactions: PropTypes.array,
  tableData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isBoundary: PropTypes.bool,
  cardData: PropTypes.object,
  activeDatasets: PropTypes.array,
  setMainMapAnalysisView: PropTypes.func,
  setMapSettings: PropTypes.func,
  buttonState: PropTypes.string,
  getGeostoreId: PropTypes.func
};

export default Popup;
