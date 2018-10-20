import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';

import MenuPanel from 'pages/map/components/menu/components/menu-panel';

import MenuDesktop from './components/menu-desktop';
import MenuMobile from './components/menu-mobile';

import './menu-styles.scss';

class MapMenu extends PureComponent {
  componentDidUpdate(prevProps) {
    const {
      showAnalysis,
      setMenuSettings,
      setRecentImagerySettings,
      location,
      recentVisible,
      menuSection
    } = this.props;
    if (
      location &&
      location.type &&
      location.adm0 &&
      !isEqual(location, prevProps.location)
    ) {
      showAnalysis();
    }
    if (recentVisible) {
      setMenuSettings({ menuSection: 'recent-imagery' });
    }

    if (!menuSection && !isEqual(menuSection, prevProps.menuSection)) {
      setRecentImagerySettings({ visible: false });
    }
  }

  render() {
    const {
      className,
      datasetSections,
      searchSections,
      mobileSections,
      activeSection,
      setMenuSettings,
      menuSection,
      ...props
    } = this.props;
    const { Component, label, category, large, icon, ...rest } =
      activeSection || {};

    return (
      <MediaQuery minDeviceWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-map-menu', className)}>
            <div className="menu-tiles">
              {isDesktop ? (
                <MenuDesktop
                  className="menu-desktop"
                  datasetSections={datasetSections}
                  searchSections={searchSections}
                  setMenuSettings={setMenuSettings}
                />
              ) : (
                <MenuMobile
                  sections={mobileSections}
                  setMenuSettings={setMenuSettings}
                />
              )}
            </div>
            <MenuPanel
              className="menu-panel"
              label={label}
              category={category}
              active={!!menuSection}
              large={large}
              isDesktop={isDesktop}
              setMenuSettings={setMenuSettings}
              onClose={() =>
                setMenuSettings({ menuSection: '', datasetCategory: '' })
              }
            >
              {Component && (
                <Component
                  menuSection={menuSection}
                  isDesktop={isDesktop}
                  setMenuSettings={setMenuSettings}
                  {...props}
                  {...rest}
                />
              )}
            </MenuPanel>
          </div>
        )}
      </MediaQuery>
    );
  }
}

MapMenu.propTypes = {
  sections: PropTypes.array,
  className: PropTypes.string,
  datasetSections: PropTypes.array,
  searchSections: PropTypes.array,
  mobileSections: PropTypes.array,
  activeSection: PropTypes.object,
  setMenuSettings: PropTypes.func,
  layers: PropTypes.array,
  onToggleLayer: PropTypes.func,
  setModalMeta: PropTypes.func,
  loading: PropTypes.bool,
  countries: PropTypes.array,
  selectedCountries: PropTypes.array,
  countriesWithoutData: PropTypes.array,
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  handleClickLocation: PropTypes.func,
  getLocationFromSearch: PropTypes.func,
  exploreSection: PropTypes.string,
  menuSection: PropTypes.string,
  datasetCategory: PropTypes.string,
  showAnalysis: PropTypes.func,
  location: PropTypes.object,
  setRecentImagerySettings: PropTypes.func,
  recentVisible: PropTypes.bool
};

export default MapMenu;
