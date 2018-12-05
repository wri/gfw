import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import DatasetsLocationsSearch from './components/datasets-locations';
import Coords from './components/coords';
import DecimalDegreeSearch from './components/decimal-degrees';
import UTMCoords from './components/utm-coords';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  render() {
    const { searchType, setMenuSettings, isDesktop } = this.props;

    return (
      <div className="c-map-menu-search">
        {isDesktop && <h3>Search</h3>}
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
                value: 'coords'
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
        {searchType === 'dataset' && (
          <DatasetsLocationsSearch {...this.props} />
        )}
        {searchType === 'coords' && <Coords {...this.props} />}
        {searchType === 'decimals' && <DecimalDegreeSearch {...this.props} />}
        {searchType === 'utm' && <UTMCoords {...this.props} />}
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
  loading: PropTypes.bool,
  isDesktop: PropTypes.bool
};

export default MapMenuSearch;
