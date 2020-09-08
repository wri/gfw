import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import VerticalMenu from 'components/ui/vertical-menu';

import DatasetsLocationsSearch from './components/datasets-locations';
import Coords from './components/coords';
import DecimalDegreeSearch from './components/decimal-degrees';
import UTMCoords from './components/utm-coords';

import './styles.scss';

class MapMenuSearch extends PureComponent {

  searchTypeBtns() {
    const { searchType: currentSearchType, setMenuSettings } = this.props;

    const menu = [
      { label: 'Locations', value: 'dataset' },
      { label: 'Datasets', value: 'dataset' },
      { label: 'Coordinates', value: 'coords' },
      { label: 'Decimal degrees', value: 'decimals' },
      { label: 'UTM coordinates', value: 'utm' }
    ];

    return (
      <VerticalMenu
        className="search-menu"
        value={currentSearchType}
        menu={menu}
        onClick={value => setMenuSettings({ searchType: value })}
      />
    )
  }

  render() {
    const { searchType, isDesktop } = this.props;

    return (
      <div className="c-map-menu-search">
        {isDesktop && <h3>Search</h3>}
        <div className="search-container">
          {this.searchTypeBtns()}
          {/* <div className="search-type">
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
                  label: 'decimal degrees',
                  value: 'decimals'
                },
                {
                  label: 'UTM coordinates',
                  value: 'utm'
                }
              ]}
              onChange={value => setMenuSettings({ searchType: value.value })}
            />
          </div> */}
          <div className="search-active-type">
            {searchType === 'dataset' && (
              <DatasetsLocationsSearch {...this.props} />
            )}
            {searchType === 'coords' && <Coords {...this.props} />}
            {searchType === 'decimals' && <DecimalDegreeSearch {...this.props} />}
            {searchType === 'utm' && <UTMCoords {...this.props} />}
          </div>
        </div>
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
