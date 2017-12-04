import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';
import Loader from 'components/loader';

import './header-styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      adminsOptions,
      adminsSelected,
      handleCountryChange,
      handleRegionChange,
      handleSubRegionChange,
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
                  value={adminsSelected.country}
                  options={adminsOptions.countries}
                  onChange={handleCountryChange}
                  searchable
                />
              </div>
              {adminsOptions.regions &&
                adminsOptions.regions.length > 1 && (
                  <div className="select">
                    <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                      <use xlinkHref="#icon-angle-arrow-down" />
                    </svg>
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Region"
                      value={adminsSelected.region}
                      options={adminsOptions.regions}
                      onChange={region =>
                        handleRegionChange(adminsSelected.country, region)
                      }
                      searchable
                    />
                  </div>
                )}
              {adminsSelected.region &&
                adminsSelected.region.value &&
                adminsOptions.subRegions &&
                adminsOptions.subRegions.length > 1 && (
                  <div className="select">
                    <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                      <use xlinkHref="#icon-angle-arrow-down" />
                    </svg>
                    <Dropdown
                      theme="theme-select-dark"
                      placeholder="Juristriction"
                      value={adminsSelected.subRegion}
                      options={adminsOptions.subRegions}
                      onChange={subRegion =>
                        handleSubRegionChange(
                          adminsSelected.country,
                          adminsSelected.region,
                          subRegion
                        )
                      }
                      searchable
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="columns large-6 medium-12 small-12">
            <div className="description text -title-xs">
              <p>
                In 2010, this country had <b>519 MHa</b> tree cover, that
                represents <b>61%</b> of its <b>851 Mha</b>.
              </p>
              <p>
                Excluding plantations, <b>40 MHa</b> of tree cover loss occured
                in <b>2016</b>.
              </p>
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
  adminsSelected: PropTypes.object.isRequired,
  adminsOptions: PropTypes.object.isRequired,
  handleCountryChange: PropTypes.func.isRequired,
  handleRegionChange: PropTypes.func.isRequired,
  handleSubRegionChange: PropTypes.func.isRequired
};

export default Header;
