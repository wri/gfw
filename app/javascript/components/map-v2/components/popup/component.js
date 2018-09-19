import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { MapPopup } from 'wri-api-components/dist/map';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';

import DataTable from './components/data-table';

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
      setAnalysisView
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
                buttons: cardData.buttons.map(b => ({
                  ...b,
                  onClick: () => setAnalysisView(cardData)
                }))
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
              <DataTable data={tableData} />
              <div className="nav-footer">
                <Button onClick={() => setAnalysisView(selected)}>
                  Analyze
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
  tableData: PropTypes.array,
  cardData: PropTypes.object,
  activeDatasets: PropTypes.array,
  setAnalysisView: PropTypes.func
};

export default Popup;
