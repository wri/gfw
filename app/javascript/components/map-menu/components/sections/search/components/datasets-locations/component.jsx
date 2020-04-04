import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import LayerToggle from 'components/map/components/legend/components/layer-toggle';

import locationIcon from 'assets/icons/location.svg?sprite';
import './styles.scss';

class DatasetsLocationsSearch extends PureComponent {
  render() {
    const {
      search,
      loading,
      onToggleLayer,
      handleClickLocation,
      handleSearchChange,
      onInfoClick,
      datasets,
      locations
    } = this.props;
    const hasDatasets = datasets && !!datasets.length;
    const hasLocations = locations && !!locations.length;

    return (
      <div className="c-datasets-locations">
        <Search
          className="side-menu-search"
          placeholder="Search"
          input={search}
          onChange={value => handleSearchChange(value)}
        />
        <div className="search-container">
          {loading && <Loader />}
          {!loading &&
            !search && (
              <NoContent
                className="empty-search"
                message="Enter a search and hit enter to find datasets or locations..."
              />
            )}
          {!loading &&
            search &&
            (!datasets || !datasets.length) &&
            (!locations || !locations.length) && (
              <NoContent
                className="empty-search"
                message="No datasets or locations found"
              />
            )}
          {!loading &&
            search &&
            (hasDatasets || hasLocations) && (
              <div className="search-results">
                {hasDatasets && (
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
                {hasLocations && (
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
            )}
        </div>
      </div>
    );
  }
}

DatasetsLocationsSearch.propTypes = {
  datasets: PropTypes.array,
  locations: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  search: PropTypes.string,
  handleSearchChange: PropTypes.func,
  handleClickLocation: PropTypes.func,
  loading: PropTypes.bool
};

export default DatasetsLocationsSearch;
