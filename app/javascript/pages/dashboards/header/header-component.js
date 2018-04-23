import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/dropdown';
import Loader from 'components/loader';
import Icon from 'components/icon';
import Button from 'components/button';

import shareIcon from 'assets/icons/share.svg';
import downloadIcon from 'assets/icons/download.svg';
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
      error,
      setShareModal,
      shareData,
      location,
      forestAtlasLink
    } = this.props;

    return (
      <div className={`${className} c-header`}>
        {loading && <Loader className="loader" theme="theme-loader-light" />}
        <div className="share-buttons">
          <Button
            className="theme-button-small theme-button-grey square"
            extLink={`http://gfw2-data.s3.amazonaws.com/country/umd_country_stats/iso/tree_cover_stats_2016_${
              location.country
            }.xlsx`}
            trackingData={{
              title: 'download',
              ...location
            }}
            tooltip={{
              text: `Download the country data${
                locationNames.country
                  ? ` for ${locationNames.country.label}`
                  : ''
              }`,
              position: 'bottom'
            }}
          >
            <Icon icon={downloadIcon} />
          </Button>
          <Button
            className="theme-button-small theme-button-grey square"
            onClick={() => setShareModal(shareData)}
            tooltip={{
              text: 'Share this page',
              position: 'bottom'
            }}
          >
            <Icon icon={shareIcon} />
          </Button>
        </div>
        <div className="row">
          <div className="columns small-12 large-6">
            <div className="select-container">
              {!location.country && <h3>Global</h3>}
              <Dropdown
                theme="theme-dropdown-dark"
                placeholder="Country"
                noItemsFound="No country found"
                noSelectedValue="Select a country"
                value={locationNames.country}
                options={locationOptions.countries}
                onChange={handleCountryChange}
                searchable
                disabled={loading}
                tooltip={{
                  text: 'Choose the country you want to explore',
                  delay: 1000
                }}
                arrowPosition="left"
                clearable
              />
              {location.country &&
                locationOptions.regions &&
                locationOptions.regions.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.region}
                    options={locationOptions.regions}
                    onChange={region =>
                      handleRegionChange(locationNames.country, region)
                    }
                    searchable
                    disabled={loading}
                    tooltip={{
                      text: 'Choose the region you want to explore',
                      delay: 1000
                    }}
                    arrowPosition="left"
                    clearable
                  />
                )}
              {location.region &&
                locationNames.region &&
                locationNames.region.value &&
                locationOptions.subRegions &&
                locationOptions.subRegions.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
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
                    tooltip={{
                      text: 'Choose the region you want to explore',
                      delay: 1000
                    }}
                    arrowPosition="left"
                    clearable
                  />
                )}
            </div>
          </div>
          <div className="columns large-6 medium-12 small-12">
            <div className="description text -title-xs">
              {!loading && (
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: error
                        ? 'An error occured while fetching data. Please try again later.'
                        : getHeaderDescription()
                    }}
                  />
                  {forestAtlasLink && (
                    <Button
                      className="forest-atlas-btn"
                      extLink={forestAtlasLink.url}
                    >
                      EXPLORE FOREST ATLAS
                    </Button>
                  )}
                </div>
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
  getHeaderDescription: PropTypes.func.isRequired,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  forestAtlasLink: PropTypes.object
};

export default Header;
