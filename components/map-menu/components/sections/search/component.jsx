import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import VerticalMenu from 'components/ui/vertical-menu';

import DatasetsLocationsSearch from './components/datasets-locations';
import Coords from './components/coords';
import DecimalDegreeSearch from './components/decimal-degrees';
import UTMCoords from './components/utm-coords';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  static propTypes = {
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
  }

  menu = [
    { label: 'Locations', value: 'location' },
    { label: 'Datasets', value: 'dataset' },
    { label: 'Coordinates', value: 'coords' },
    { label: 'Decimal degrees', value: 'decimals' },
    { label: 'UTM coordinates', value: 'utm' }
  ]

  searchCategoryMenu() {
    const { menu } = this;
    const { isDesktop, searchType: currentSearchType, setMenuSettings } = this.props;

    // Hide menu if mobile and we have a search type active
    if (!isDesktop && currentSearchType.length > 0) {
      return null;
    }

    // Mobile does not care about active, as its not shown on interaction
    // Desktop always needs a active value, if none present (on resize) show the first menu item as active
    const currentValue = isDesktop && currentSearchType.length === 0 ? menu[0].value : currentSearchType;

    return (
      <VerticalMenu
        className="search-menu"
        value={currentValue}
        menu={menu}
        onClick={value => setMenuSettings({ searchType: value })}
      />
    )
  }

  render() {
    const { searchType, isDesktop } = this.props;

    // Mobile view displays either menu or container depending on current action
    // Desktop always shows both
    const showSearchResults = !isDesktop && searchType.length > 0 || isDesktop;

    return (
      <div className="c-map-menu-search">
        {isDesktop && <h3>Search</h3>}

        <div className="search-wrapper">
          {this.searchCategoryMenu()}
          {showSearchResults && (
            <div className="search-container">
              {(searchType === 'location' || searchType.length === 0) && (
                <DatasetsLocationsSearch type="locations" {...this.props} />
              )}
              {searchType === 'dataset' && (
                <DatasetsLocationsSearch type="datasets" {...this.props} />
              )}
              {searchType === 'coords' && <Coords {...this.props} />}
              {searchType === 'decimals' && <DecimalDegreeSearch {...this.props} />}
              {searchType === 'utm' && <UTMCoords {...this.props} />}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MapMenuSearch;
