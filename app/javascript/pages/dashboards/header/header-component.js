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
      adm0s,
      adm1s,
      adm2s,
      locationNames,
      handleLocationChange,
      loading,
      setShareModal,
      shareData,
      location,
      forestAtlasLink,
      sentence,
      downloadLink
    } = this.props;

    return (
      <div className={`${className} c-header-menu`}>
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
                locationNames.adm0 ? ` for ${locationNames.adm0.label}` : ''
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
              {!location.adm0 && <h3>{location.type || 'Global'}</h3>}
              {adm0s && (
                <Dropdown
                  theme="theme-dropdown-dark"
                  placeholder="Select a country"
                  noItemsFound="No country found"
                  noSelectedValue="Select a country"
                  value={locationNames.adm0}
                  options={adm0s}
                  onChange={adm0 =>
                    handleLocationChange({ adm0: adm0 && adm0.value })
                  }
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
              {location.adm0 &&
                adm0s &&
                adm1s &&
                adm1s.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.adm1}
                    options={adm1s}
                    onChange={adm1 =>
                      handleLocationChange({
                        adm0: location.adm0,
                        adm1: adm1 && adm1.value
                      })
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
              {location.adm1 &&
                adm1s &&
                adm2s &&
                adm2s.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.adm2}
                    options={adm2s}
                    onChange={adm2 =>
                      handleLocationChange({
                        adm0: location.adm0,
                        adm1: location.adm1,
                        adm2: adm2 && adm2.value
                      })
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
  adm0s: PropTypes.array,
  adm1s: PropTypes.array,
  adm2s: PropTypes.array,
  handleLocationChange: PropTypes.func.isRequired,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  forestAtlasLink: PropTypes.object,
  sentence: PropTypes.object,
  downloadLink: PropTypes.string
};

export default Header;
