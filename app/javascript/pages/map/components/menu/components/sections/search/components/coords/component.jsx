import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { validateLatLng } from 'utils/geoms';

import Button from 'components/ui/button';
import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class UTMCoords extends PureComponent {
  state = {
    error: false,
    latDeg: '',
    latMin: '',
    latSec: '',
    latCard: 'N',
    lngDeg: '',
    lngMin: '',
    lngSec: '',
    lngCard: 'W'
  };

  convertDMSToDD = (degrees, minutes, seconds, cardinal) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (cardinal === 'S' || cardinal === 'W') dd *= -1; // Don't do anything for N or E
    return dd;
  };

  handleSubmit = () => {
    const {
      latDeg,
      latMin,
      latSec,
      latCard,
      lngDeg,
      lngMin,
      lngSec,
      lngCard
    } = this.state;
    const { setMapSettings } = this.props;
    const lat = this.convertDMSToDD(
      parseInt(latDeg, 10),
      parseInt(latMin, 10),
      parseInt(latSec, 10),
      latCard
    );
    const lng = this.convertDMSToDD(
      parseInt(lngDeg, 10),
      parseInt(lngMin, 10),
      parseInt(lngSec, 10),
      lngCard
    );
    if (validateLatLng(lat, lng)) {
      setMapSettings({ center: { lat, lng } });
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
    const {
      latDeg,
      latMin,
      latSec,
      latCard,
      lngDeg,
      lngMin,
      lngSec,
      lngCard,
      error
    } = this.state;

    return (
      <div className="c-coords">
        <div className="input-row">
          <input
            value={latDeg}
            onChange={e =>
              this.setState({ latDeg: e.target.value, error: false })
            }
            onKeyDown={this.handleKeyPress}
            className={cx('coord-input', { error: latDeg && error })}
          />
          {'\u00b0'}
          <input
            value={latMin}
            onChange={e =>
              this.setState({ latMin: e.target.value, error: false })
            }
            className={cx('coord-input', { error: latMin && error })}
            onKeyDown={this.handleKeyPress}
          />
          {"'"}
          <input
            value={latSec}
            onChange={e =>
              this.setState({ latSec: e.target.value, error: false })
            }
            className={cx('coord-input', { error: latSec && error })}
            onKeyDown={this.handleKeyPress}
          />
          {"''"}
          <Dropdown
            className="hemisphere-select"
            theme="theme-dropdown-button-small"
            value={latCard}
            options={[
              {
                label: 'N',
                value: 'N'
              },
              {
                label: 'S',
                value: 'S'
              }
            ]}
            onChange={value => this.setState({ latCard: value.value })}
          />
        </div>
        <div className="input-row">
          <input
            value={lngDeg}
            onChange={e =>
              this.setState({ lngDeg: e.target.value, error: false })
            }
            onKeyDown={this.handleKeyPress}
            className={cx('coord-input', { error: lngDeg && error })}
          />
          {'\u00b0'}
          <input
            value={lngMin}
            onChange={e =>
              this.setState({ lngMin: e.target.value, error: false })
            }
            className={cx('coord-input', { error: lngMin && error })}
            onKeyDown={this.handleKeyPress}
          />
          {"'"}
          <input
            value={lngSec}
            onChange={e =>
              this.setState({ lngSec: e.target.value, error: false })
            }
            className={cx('coord-input', { error: lngSec && error })}
            onKeyDown={this.handleKeyPress}
          />
          {"''"}
          <Dropdown
            className="hemisphere-select"
            theme="theme-dropdown-button-small"
            value={lngCard}
            options={[
              {
                label: 'W',
                value: 'W'
              },
              {
                label: 'E',
                value: 'E'
              }
            ]}
            onChange={value => this.setState({ lngCard: value.value })}
          />
        </div>
        <Button
          onClick={this.handleSubmit}
          disabled={
            error ||
            !latDeg ||
            !latMin ||
            !latSec ||
            !lngDeg ||
            !lngMin ||
            !lngSec
          }
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
