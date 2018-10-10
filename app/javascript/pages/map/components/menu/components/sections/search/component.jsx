import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import LayerToggle from 'components/map-v2/components/legend/components/layer-toggle';

import locationIcon from 'assets/icons/location.svg';
import './styles.scss';

class MapMenuSearch extends PureComponent {
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
  loading: PropTypes.bool
};

export default MapMenuSearch;
