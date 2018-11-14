import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { validateLat, validateLng, validateLatLng } from 'utils/geoms';

import Button from 'components/ui/button';

import './styles.scss';

class DecimalDegreeSearch extends PureComponent {
  state = {
    error: false,
    lat: '',
    lng: ''
  };

  handleKeyPress = e => {
    if (e.keyCode === 13 && !this.state.error) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const { lat, lng } = this.state;
    const { setMapSettings } = this.props;
    setMapSettings({
      center: { lat: parseInt(lat, 10), lng: parseInt(lng, 10) }
    });
  };

  handleSetLocationState = stateObj => {
    if (!this.state.error) {
      this.setState(stateObj);
    }
  };

  handleSetLatLng = (lat, lng) => {
    this.setState({ lat, lng });
    if (validateLatLng(lat, lng)) {
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { lat, lng, error } = this.state;

    return (
      <div className="c-decimal-degrees">
        <span className="label">Lat:</span>
        <input
          value={lat}
          onChange={e => this.handleSetLatLng(e.target.value, lng)}
          className={cx('coord-input', { error: lat && !validateLat(lat) })}
          onKeyDown={this.handleKeyPress}
        />
        <span className="label">Lng:</span>
        <input
          value={lng}
          onChange={e => this.handleSetLatLng(lat, e.target.value)}
          className={cx('coord-input', { error: lng && !validateLng(lng) })}
          onKeyDown={this.handleKeyPress}
        />
        <Button
          className="submit-btn"
          onClick={this.handleSubmit}
          disabled={error || !lat || !lng}
        >
          GO TO POSITION
        </Button>
        {error && <p className="error-message">Invalid lat lng</p>}
      </div>
    );
  }
}

DecimalDegreeSearch.propTypes = {
  setMapSettings: PropTypes.func
};

export default DecimalDegreeSearch;
