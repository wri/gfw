import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/dropdown';
import Loader from 'components/loader';
import Icon from 'components/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg';

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
      loading,
      error
    } = this.props;
    return (
      <div className={`${className} c-header`}>
        {loading && <Loader className="loader" theme="theme-loader-light" />}
        <div className="row">
          <div className="columns small-12 large-6">
            <div className="select-container">
              <div className="select">
                <Icon icon={arrowDownIcon} className="icon" />
                <Dropdown
                  theme="theme-select-dark"
                  placeholder="Country"
                  noItemsFound="No country found"
                  value={locationNames.country}
                  options={locationOptions.countries}
                  onChange={handleCountryChange}
                  searchable
                  disabled={loading}
                />
              </div>
              {locationOptions.regions &&
                locationOptions.regions.length > 1 && (
                  <div className="select">
                    <Icon icon={arrowDownIcon} className="icon" />
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Region"
                      noItemsFound="No region found"
                      value={locationNames.region}
                      options={locationOptions.regions}
                      onChange={region =>
                        handleRegionChange(locationNames.country, region)
                      }
                      searchable
                      disabled={loading}
                    />
                  </div>
                )}
              {locationNames.region &&
                locationNames.region.value &&
                locationOptions.subRegions &&
                locationOptions.subRegions.length > 1 && (
                  <div className="select">
                    <Icon
                      icon={arrowDownIcon}
                      className="icon c-header__select-arrow"
                    />
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Region"
                      noItemsFound="No region found"
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
                      disabled={loading}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="columns large-6 medium-12 small-12">
            <div className="description text -title-xs">
              {!loading && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: error
                      ? 'An error occured while fetching data. Please try again later.'
                      : getHeaderDescription()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  locationNames: PropTypes.object.isRequired,
  locationOptions: PropTypes.object.isRequired,
  handleCountryChange: PropTypes.func.isRequired,
  handleRegionChange: PropTypes.func.isRequired,
  handleSubRegionChange: PropTypes.func.isRequired,
  getHeaderDescription: PropTypes.func.isRequired
};

export default Header;
