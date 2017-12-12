import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';
import Loader from 'components/loader';

import './header-styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      locationOptions,
      locationNames,
      handleCountryChange,
      handleRegionChange,
      handleSubRegionChange,
      getHeaderDescription,
      isLoading
    } = this.props;
    return (
      <div className={`${className} c-header`}>
        {isLoading && <Loader className="loader" theme="theme-loader-light" />}
        <div className="row">
          <div className="columns small-12 large-6">
            <div className="select-container">
              <div className="select">
                <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                  <use xlinkHref="#icon-angle-arrow-down" />
                </svg>
                <Dropdown
                  theme="theme-select-dark"
                  placeholder="Country"
                  value={locationNames.country}
                  options={locationOptions.countries}
                  onChange={handleCountryChange}
                  searchable
                  disabled={isLoading}
                />
              </div>
              {locationOptions.regions &&
                locationOptions.regions.length > 1 && (
                  <div className="select">
                    <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                      <use xlinkHref="#icon-angle-arrow-down" />
                    </svg>
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Region"
                      value={locationNames.region}
                      options={locationOptions.regions}
                      onChange={region =>
                        handleRegionChange(locationNames.country, region)
                      }
                      searchable
                      disabled={isLoading}
                    />
                  </div>
                )}
              {locationNames.region &&
                locationNames.region.value &&
                locationOptions.subRegions &&
                locationOptions.subRegions.length > 1 && (
                  <div className="select">
                    <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                      <use xlinkHref="#icon-angle-arrow-down" />
                    </svg>
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Juristriction"
                      value={locationNames.subRegion}
                      options={locationOptions.subRegions}
                      onChange={subRegion =>
                        handleSubRegionChange(
                          locationNames.country,
                          locationNames.region,
                          subRegion
                        )
                      }
                      searchable
                      disabled={isLoading}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="columns large-6 medium-12 small-12">
            <div className="description text -title-xs">
              {!isLoading && getHeaderDescription()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object.isRequired,
  locationOptions: PropTypes.object.isRequired,
  handleCountryChange: PropTypes.func.isRequired,
  handleRegionChange: PropTypes.func.isRequired,
  handleSubRegionChange: PropTypes.func.isRequired,
  getHeaderDescription: PropTypes.func.isRequired
};

export default Header;
