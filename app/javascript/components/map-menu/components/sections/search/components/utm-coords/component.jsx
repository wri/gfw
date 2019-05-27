import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import proj4 from 'proj4';
import cx from 'classnames';

import { validateLatLng } from 'utils/geoms';

import Button from 'components/ui/button';
import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class UTMCoords extends PureComponent {
  state = {
    error: false,
    east: '',
    north: '',
    zone: '',
    hemisphere: 'north'
  };

  handleSubmit = () => {
    const { east, north, zone, hemisphere } = this.state;
    const { setMapSettings } = this.props;
    const utm = `+proj=utm +zone=${zone} +${hemisphere}`;
    const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
    let latlng = [];
    try {
      latlng = proj4(utm, wgs84, [parseInt(east, 10), parseInt(north, 10)]);
    } catch (error) {
      this.setState({ error: true });
    }
    if (validateLatLng(latlng[1], latlng[0])) {
      setMapSettings({ center: { lat: latlng[1], lng: latlng[0] } });
    } else {
      this.setState({ error: true });
    }
  };

  handleKeyPress = e => {
    if (e.keyCode === 13 && !this.state.error) {
      this.handleSubmit();
    }
  };

  render() {
    const { east, north, zone, hemisphere, error } = this.state;

    return (
      <div className="c-utm-coords">
        <span className="label">East:</span>
        <input
          value={east}
          onChange={e => this.setState({ east: e.target.value, error: false })}
          onKeyDown={this.handleKeyPress}
          className={cx('coord-input', { error: east && error })}
        />
        <span className="label">North:</span>
        <input
          value={north}
          onChange={e => this.setState({ north: e.target.value, error: false })}
          className={cx('coord-input', { error: north && error })}
          onKeyDown={this.handleKeyPress}
        />
        <span className="label">Zone:</span>
        <input
          value={zone}
          onChange={e => this.setState({ zone: e.target.value, error: false })}
          className={cx('coord-input', { error: zone && error })}
          onKeyDown={this.handleKeyPress}
        />
        <span className="label">Hemisphere:</span>
        <Dropdown
          className="hemisphere-select"
          theme="theme-dropdown-button-small"
          value={hemisphere}
          options={[
            {
              label: 'N',
              value: 'north'
            },
            {
              label: 'S',
              value: 'south'
            }
          ]}
          onChange={value => this.setState({ hemisphere: value.value })}
        />
        <Button
          onClick={this.handleSubmit}
          disabled={error || !east || !zone || !north}
        >
          GO TO POSITION
        </Button>
        {error && <p className="error-message">Invalid coordinates</p>}
      </div>
    );
  }
}

UTMCoords.propTypes = {
  setMapSettings: PropTypes.func
};

export default UTMCoords;
