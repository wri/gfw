import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { MapPopup } from 'wri-api-components/dist/map';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';

import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';

class Popup extends Component {
  componentDidUpdate(prevProps) {
    const { activeDatasets, clearInteractions } = prevProps;
    if (!isEqual(activeDatasets.length, this.props.activeDatasets.length)) {
      clearInteractions();
    }
  }

  render() {
    const {
      map,
      tableData,
      cardData,
      latlng,
      interactions,
      selected,
      setInteractionSelected,
      setMainMapAnalysisView,
      setMapSettings,
      isBoundary
    } = this.props;

    return (
      <MapPopup
        map={map}
        latlng={!isEmpty(interactions) ? latlng : null}
        data={{ interactions, selected }}
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
                <Button onClick={() => setMainMapAnalysisView(selected)}>
                  ANALYZE
                </Button>
              </div>
            </div>
          )}
        </div>
      </MapPopup>
    );
  }
}

Popup.propTypes = {
  map: PropTypes.object,
  setInteractionSelected: PropTypes.func,
  latlng: PropTypes.object,
  selected: PropTypes.object,
  interactions: PropTypes.array,
  tableData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isBoundary: PropTypes.bool,
  cardData: PropTypes.object,
  activeDatasets: PropTypes.array,
  setMainMapAnalysisView: PropTypes.func,
  setMapSettings: PropTypes.func
};

export default Popup;
