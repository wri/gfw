import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

import Loader from 'components/loader/loader';
import './header-styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      adminsLists,
      adminsSelected,
      handleCountryChange,
      handleRegionChange,
      handleSubRegionChange,
      isLoading
    } = this.props;
    return (
      <div className={`${className} c-header`}>
        {isLoading && <Loader isAbsolute />}
        <div className="row">
          <div className="columns large-6 medium-12 small-12">
            <div className="select-container">
              <div className="select">
                <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                  <use xlinkHref="#icon-angle-arrow-down" />
                </svg>
                <Select
                  placeholder="Country"
                  value={adminsSelected.country}
                  options={adminsLists.countries}
                  onChange={handleCountryChange}
                />
              </div>
              <div className="select">
                <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                  <use xlinkHref="#icon-angle-arrow-down" />
                </svg>
                <Select
                  placeholder="Region"
                  value={adminsSelected.region}
                  options={adminsLists.regions}
                  onChange={region =>
                    handleRegionChange(adminsSelected.country, region)
                  }
                />
              </div>
              {adminsSelected.region &&
                adminsLists.subRegions &&
                adminsLists.subRegions.length > 0 && (
                  <div className="select">
                    <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                      <use xlinkHref="#icon-angle-arrow-down" />
                    </svg>
                    <Select
                      placeholder="Juristriction"
                      value={adminsSelected.subRegion}
                      options={adminsLists.subRegions}
                      onChange={subRegion =>
                        handleSubRegionChange(
                          adminsSelected.country,
                          adminsSelected.region,
                          subRegion
                        )
                      }
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
  adminsLists: PropTypes.object.isRequired,
  handleCountryChange: PropTypes.func.isRequired,
  handleRegionChange: PropTypes.func.isRequired,
  handleSubRegionChange: PropTypes.func.isRequired
};

export default Header;
