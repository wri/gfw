import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MapPopup } from 'wri-api-components';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';

class Popup extends Component {
  render() {
    const {
      map,
      data,
      latlng,
      options,
      value,
      interactions,
      setInteractionSelected
    } = this.props;

    return (
      <MapPopup
        map={map}
        latlng={latlng}
        data={{ ...interactions, selected: value }}
      >
        <div className="c-popup">
          {options &&
            options.length > 1 && (
              <Dropdown
                className="layer-selector"
                theme="theme-dropdown-native-plain"
                value={value}
                options={options}
                onChange={e => setInteractionSelected(e.target.value)}
                native
              />
            )}
          {options &&
            options.length === 1 && (
              <div className="popup-title">{options[0].label}</div>
            )}
          <div className="values">
            {data &&
              data.map(d => (
                <div key={d.label} className="wrapper">
                  <div className="label">{d.label}:</div>
                  <div className="value">{d.value || 'n/a'}</div>
                </div>
              ))}
          </div>
          <div className="nav-footer">
            <Button>Analyse</Button>
          </div>
        </div>
      </MapPopup>
    );
  }
}

Popup.propTypes = {
  map: PropTypes.object,
  data: PropTypes.array,
  options: PropTypes.array,
  value: PropTypes.string,
  setInteractionSelected: PropTypes.func,
  latlng: PropTypes.object,
  interactions: PropTypes.object
};

export default Popup;
