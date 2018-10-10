import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Dropdown from 'components/ui/dropdown';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import LayerToggle from 'components/map-v2/components/legend/components/layer-toggle';

import locationIcon from 'assets/icons/location.svg';
import './styles.scss';

class MapMenuSearch extends PureComponent {
  state = {
    error: false,
    lat: '',
    lng: ''
  };

  renderDatasetSearch = () => {
    const {
      search,
      setMenuSettings,
      setMenuLoading,
      loading,
      onToggleLayer,
      handleClickLocation,
      onInfoClick,
      datasets,
      locations
    } = this.props;
    return (
      <Fragment>
        <Search
          className="side-menu-search"
          placeholder="Search"
          input={search}
          onChange={value => {
            setMenuLoading(true);
            setMenuSettings({ search: value });
          }}
        />
        {!search && (
          <NoContent
            className="empty-search"
            message="Enter a search to find datasets or locations..."
          />
        )}
        <div className="search-results">
          {loading && <Loader />}
          {!loading &&
            search &&
            datasets &&
            !!datasets.length && (
              <div
                className={cx('datasets-search', {
                  'show-border': locations && locations.length
                })}
              >
                <h5>Datasets</h5>
                {datasets.map(d => (
                  <LayerToggle
                    key={d.id}
                    className="dataset-toggle"
                    data={{ ...d, dataset: d.id }}
                    onToggle={onToggleLayer}
                    onInfoClick={onInfoClick}
                    showSubtitle
                  />
                ))}
              </div>
            )}
          {!loading &&
            search &&
            locations &&
            !!locations.length && (
              <div className="locations-search">
                <h5>Locations</h5>
                {locations.map(loc => (
                  <button
                    className={cx('location', { active: loc.active })}
                    key={loc.label}
                    onClick={() => handleClickLocation(loc)}
                  >
                    <Icon icon={locationIcon} className="location-icon" />
                    <p>{loc.label}</p>
                  </button>
                ))}
              </div>
            )}
        </div>
      </Fragment>
    );
  };

  renderDecimalDegrees = () => {
    const { lat, lng, error } = this.state;

    return (
      <div className="decimal-search">
        <span>Lat:</span>
        <input
          value={lat}
          onChange={e => this.handleSetLatLng(e.target.value, lng)}
          className={cx({ error: lat && !this.validateLat(lat) })}
        />
        <span>Lng:</span>
        <input
          value={lng}
          onChange={e => this.handleSetLatLng(lat, e.target.value)}
          className={cx({ error: lng && !this.validateLng(lng) })}
          onKeyDown={this.handleKeyPress}
        />
        <Button onClick={this.handleSubmit} disabled={error || !lat || !lng}>
          GO TO POSITION
        </Button>
        {error && <p className="error-message">Invalid lat lng</p>}
      </div>
    );
  };

  handleKeyPress = e => {
    if (e.keyCode === 13 && !this.state.error) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const { lat, lng } = this.state;
    const { setMapSettings } = this.props;
    setMapSettings({ center: { lat, lng } });
  };

  validateLat = lat => lat <= 90 && lat >= -90;

  validateLng = lng => lng <= 180 && lng >= -180;

  handleSetLocationState = stateObj => {
    if (!this.state.error) {
      this.setState(stateObj);
    }
  };

  handleSetLatLng = (lat, lng) => {
    this.setState({ lat, lng });
    if (lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180) {
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { searchType, setMenuSettings } = this.props;

    return (
      <div className="c-map-menu-search">
        <h3>Search</h3>
        <div className="search-type">
          Search for a
          <Dropdown
            className="search-type-select"
            theme="theme-dropdown-button-small"
            value={searchType}
            options={[
              {
                label: 'dataset or location',
                value: 'dataset'
              },
              {
                label: 'coordinates',
                value: 'coordinates'
              },
              {
                label: 'decimal degress',
                value: 'decimals'
              },
              {
                label: 'UTM coordinates',
                value: 'utm'
              }
            ]}
            onChange={value => setMenuSettings({ searchType: value.value })}
          />
        </div>
        {searchType === 'dataset' && this.renderDatasetSearch()}
        {searchType === 'decimals' && this.renderDecimalDegrees()}
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  datasets: PropTypes.array,
  locations: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  search: PropTypes.string,
  searchType: PropTypes.string,
  setMenuSettings: PropTypes.func,
  setMenuLoading: PropTypes.func,
  handleClickLocation: PropTypes.func,
  setMapSettings: PropTypes.func,
  loading: PropTypes.bool
};

export default MapMenuSearch;
