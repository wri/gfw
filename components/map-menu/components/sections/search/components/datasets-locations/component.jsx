import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import LayerToggle from 'components/map/components/legend/components/layer-toggle';

import locationIcon from 'assets/icons/location.svg?sprite';
import layersIcon from 'assets/icons/layers.svg?sprite';

import './styles.module.scss';

class DatasetsLocationsSearch extends PureComponent {
  searchConditions() {
    const { datasets, locations, type } = this.props;
    const isLocationSearch = type === 'locations';
    return {
      isLocationSearch,
      hasDatasets: datasets && !isLocationSearch && !!datasets.length,
      hasLocations: locations && isLocationSearch && !!locations.length,
    };
  }

  searchIsEmpty() {
    const { loading, search } = this.props;
    const { hasDatasets, hasLocations, isLocationSearch } =
      this.searchConditions();

    return (
      !loading &&
      search &&
      ((!hasDatasets && !isLocationSearch) ||
        (!hasLocations && isLocationSearch))
    );
  }

  searchNoResults() {
    const { loading, search } = this.props;
    return !loading && !search;
  }

  searchHasResults() {
    const { loading, search } = this.props;
    const { hasDatasets, hasLocations } = this.searchConditions();
    return !loading && search && (hasDatasets || hasLocations);
  }

  viewDefault() {
    const { type } = this.props;
    const isLocationSearch = type === 'locations';
    return (
      <NoContent className="empty-search">
        <Icon
          icon={isLocationSearch ? locationIcon : layersIcon}
          className="location-icon"
        />
        <span>
          Use this to find
          {isLocationSearch && ' any'}
          {' '}
          <b>{isLocationSearch ? 'location' : 'datasets'}</b>
          {' '}
          {isLocationSearch &&
            'on the map. Search for political boundaries, landmarks and natural features.'}
          {!isLocationSearch && 'to add to the map.'}
        </span>
      </NoContent>
    );
  }

  viewNoResults() {
    const { type } = this.props;
    return <NoContent className="empty-search" message={`No ${type} found`} />;
  }

  viewSearchResults() {
    const {
      locations,
      datasets,
      onToggleLayer,
      onInfoClick,
      handleClickLocation,
    } = this.props;

    const { hasDatasets, hasLocations } = this.searchConditions();

    return (
      <div className="search-results">
        {hasDatasets && (
          <div className="datasets-search">
            {datasets.map((d) => (
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
            {locations.map((loc) => (
              <button
                className={cx('location', { active: loc.active })}
                key={loc.place_name}
                onClick={() => handleClickLocation(loc)}
              >
                <p>{loc.place_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { search, loading, type, handleSearchChange } = this.props;

    return (
      <div className="c-datasets-locations">
        <Search
          className="side-menu-search"
          placeholder={`Find ${type === 'datasets' ? 'datasets' : 'locations'}`}
          input={search}
          onChange={(value) => handleSearchChange(value)}
        />
        <div className="search-results-wrapper">
          {loading && <Loader />}
          {this.searchNoResults() && this.viewDefault()}
          {this.searchIsEmpty() && this.viewNoResults()}
          {this.searchHasResults() && this.viewSearchResults()}
        </div>
      </div>
    );
  }
}

DatasetsLocationsSearch.propTypes = {
  type: PropTypes.oneOf(['datasets', 'locations']),
  datasets: PropTypes.array,
  locations: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  search: PropTypes.string,
  handleSearchChange: PropTypes.func,
  handleClickLocation: PropTypes.func,
  loading: PropTypes.bool,
};

export default DatasetsLocationsSearch;
