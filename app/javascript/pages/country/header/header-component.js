import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';
import Loader from 'components/loader';
import { format } from 'd3-format';

import CountryDataProvider from 'pages/country/providers/country-data-provider';
import './header-styles.scss';

class Header extends PureComponent {
  getHeaderDescription = () => {
    const { treeCover, parcentageCover, adminsSelected } = this.props;
    return (
      <div>
        <p>
          In 2010, {adminsSelected.country && adminsSelected.country.label} had{' '}
          <b>{format('.2s')(treeCover)}ha</b> of tree cover
          {parcentageCover && ', extending over '}
          {parcentageCover && <b>{format('.0f')(parcentageCover)}%</b>}
          {parcentageCover && ' of its land area'}.
        </p>
        <p>
          In <b>2016</b>, it lost <b>{format('.2s')(1566959)}ha</b> of forest
          excluding tree plantations, equivalent to{' '}
          <b>{format('.2s')(350328700)}</b> tonnes of CO₂ of emissions.
        </p>
      </div>
    );
  };

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
        <CountryDataProvider />
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
              {!isLoading && this.getHeaderDescription()}
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
  handleSubRegionChange: PropTypes.func.isRequired,
  treeCover: PropTypes.number.isRequired,
  parcentageCover: PropTypes.number
};

export default Header;
