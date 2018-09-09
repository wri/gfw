import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import DynamicSentence from 'components/ui/dynamic-sentence';

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
      loading,
      setShareModal,
      shareData,
      location,
      forestAtlasLink,
      sentence,
      query,
      downloadLink
    } = this.props;

    return (
      <div className={`${className} c-header`}>
        {loading && <Loader className="loader" theme="theme-loader-light" />}
        <div className="share-buttons">
          <Button
            className="theme-button-small theme-button-grey square"
            extLink={downloadLink}
            trackingData={{
              title: 'download',
              ...location
            }}
            tooltip={{
              text: `Download the data${
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
              {!location.country && <h3>{location.type || 'Global'}</h3>}
              {locationOptions.countries && (
                <Dropdown
                  theme="theme-dropdown-dark"
                  placeholder="Select a country"
                  noItemsFound="No country found"
                  noSelectedValue="Select a country"
                  value={locationNames.country}
                  options={locationOptions.countries}
                  onChange={country => handleCountryChange(country, query)}
                  searchable
                  disabled={loading}
                  tooltip={{
                    text: 'Choose the country you want to explore',
                    delay: 1000
                  }}
                  arrowPosition="left"
                  clearable
                />
              )}
              {location.country &&
                locationOptions.countries &&
                locationOptions.regions &&
                locationOptions.regions.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.region}
                    options={locationOptions.regions}
                    onChange={region =>
                      handleRegionChange(locationNames.country, region, query)
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
                locationOptions.regions &&
                locationNames.region &&
                locationNames.region.value &&
                locationOptions.subRegions &&
                locationOptions.subRegions.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.subRegion}
                    options={locationOptions.subRegions}
                    onChange={subRegion =>
                      handleSubRegionChange(
                        locationNames.country,
                        locationNames.region,
                        subRegion,
                        query
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
          <div className="columns small-12 large-6">
            <div className="description text -title-xs">
              {!loading && (
                <div>
                  <DynamicSentence className="sentence" sentence={sentence} />
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
  locationNames: PropTypes.object.isRequired,
  locationOptions: PropTypes.object.isRequired,
  handleCountryChange: PropTypes.func.isRequired,
  handleRegionChange: PropTypes.func.isRequired,
  handleSubRegionChange: PropTypes.func.isRequired,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  forestAtlasLink: PropTypes.object,
  sentence: PropTypes.object,
  query: PropTypes.object,
  downloadLink: PropTypes.string
};

export default Header;
