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

import './styles.scss';

class DatasetsLocationsSearch extends PureComponent {
  render() {
    const {
      search,
      loading,
      type,
      onToggleLayer,
      handleClickLocation,
      handleSearchChange,
      onInfoClick,
      datasets,
      locations,
    } = this.props;

    const isLocationSearch = type === 'locations';
    const hasDatasets = datasets && !isLocationSearch && !!datasets.length;
    const hasLocations = locations && isLocationSearch && !!locations.length;

    return (
      <div className="c-datasets-locations">
        <Search
          className="side-menu-search"
          placeholder={`Find ${type === 'datasets' ? 'datasets' : 'locations'}`}
          input={search}
          onChange={(value) => handleSearchChange(value)}
        />
        <div className="search-container">
          {loading && <Loader />}
          {!loading && !search && (
            <NoContent
              className="empty-search"
            >
              <Icon icon={isLocationSearch ? locationIcon : layersIcon} className="location-icon" />
              <span>
                Use this to find
                {isLocationSearch && ' any'}
                {' '}
                <b>{isLocationSearch ? 'location' : 'datasets'}</b>
                {' '}
                {isLocationSearch && 'on the map. Search for political boundaries, landmarks and natural features.'}
                {!isLocationSearch && 'to add to the map.'}
              </span>
            </NoContent>
          )}
          {!loading &&
            search &&
            ((!hasDatasets && !isLocationSearch) ||
            (!hasLocations && isLocationSearch)) && (
              <NoContent
                className="empty-search"
                message={`No ${type} found`}
              />
            )}
          {!loading && search && (hasDatasets || hasLocations) && (
            <div className="search-results">
              {hasDatasets && (
                <div
                  className={cx('datasets-search', {
                    'show-border': locations && locations.length,
                  })}
                >
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
                      key={loc.label}
                      onClick={() => handleClickLocation(loc)}
                    >
                      <Icon icon={isLocationSearch ? locationIcon : layersIcon} className="location-icon" />
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
