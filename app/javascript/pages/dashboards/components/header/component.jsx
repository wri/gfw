import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import DynamicSentence from 'components/ui/dynamic-sentence';
import SaveAOIModal from 'components/modals/save-aoi';

import downloadIcon from 'assets/icons/download.svg';
import './styles.scss';

class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
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
    downloadLink: PropTypes.string,
    selectorMeta: PropTypes.object,
    loggedIn: PropTypes.bool,
    shareMeta: PropTypes.string,
    setSaveAOISettings: PropTypes.func
  };

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
      downloadLink,
      selectorMeta,
      loggedIn,
      shareMeta,
      setSaveAOISettings
    } = this.props;
    const isCountryDashboard =
      location.type === 'country' || location.type === 'global';

    return (
      <div className={cx('c-dashboards-header', className)}>
        {loading && <Loader className="loader" theme="theme-loader-light" />}
        <div className="share-buttons">
          <Button
            className="theme-button-small"
            onClick={() => {
              if (location.type === 'aoi' && !loggedIn) {
                setSaveAOISettings({ open: true });
              } else {
                setShareModal(shareData);
              }
            }}
          >
            {shareMeta}
          </Button>
          <Button
            className="theme-button-medium theme-button-clear square"
            extLink={downloadLink}
            tooltip={{
              text: `Download the data${
                locationNames.adm0 ? ` for ${locationNames.adm0.label}` : ''
              }`,
              position: 'bottom'
            }}
          >
            <Icon icon={downloadIcon} />
          </Button>
        </div>
        <div className="row">
          <div className="columns small-12 medium-10">
            <div className="select-container">
              {!location.adm0 && <h3>{location.type || 'Global'}</h3>}
              {loggedIn && adm0s ? (
                <Dropdown
                  theme="theme-dropdown-dark"
                  placeholder={`Select ${selectorMeta.typeVerb}`}
                  noItemsFound={`No ${selectorMeta.typeName} found`}
                  noSelectedValue={`Select a ${selectorMeta.typeName}`}
                  value={locationNames.adm0}
                  options={adm0s}
                  onChange={adm0 =>
                    handleLocationChange({ adm0: adm0 && adm0.value })
                  }
                  searchable
                  disabled={loading}
                  tooltip={{
                    text: `Choose the ${
                      selectorMeta.typeName
                    } you want to explore`,
                    delay: 1000
                  }}
                  arrowPosition="left"
                  clearable={isCountryDashboard}
                />
              ) : (
                <h1>{locationNames.adm0 && locationNames.adm0.label}</h1>
              )}
              {isCountryDashboard &&
                location.adm0 &&
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
              {isCountryDashboard &&
                location.adm1 &&
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
          <div className="columns small-12 medium-10">
            <div className="description text -title-xs">
              {!loading && (
                <div>
                  <DynamicSentence className="sentence" sentence={sentence} />
                  {forestAtlasLink &&
                    isCountryDashboard && (
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
        <SaveAOIModal />
      </div>
    );
  }
}

export default Header;
