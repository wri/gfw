import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';

import MenuPanel from 'pages/map/components/menu/components/menu-panel';

import MenuDesktop from './components/menu-desktop';
import MenuMobile from './components/menu-mobile';

import './menu-styles.scss';

class Menu extends PureComponent {
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
    const { Component, label, large, icon, ...rest } = activeSection || {};

    return (
      <MediaQuery minDeviceWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-map-menu">
            <div className={cx('menu-tiles', className)}>
              {isDesktop ? (
                <MenuDesktop
                  sections={datasetSections}
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
              active={!!menuSection}
              large={large}
              isDesktop={isDesktop}
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

Menu.propTypes = {
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
  datasetCategory: PropTypes.string
};

export default Menu;
