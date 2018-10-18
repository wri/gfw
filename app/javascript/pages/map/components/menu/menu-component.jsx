import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';

import MenuPanel from 'pages/map/components/menu/components/menu-panel';
import Loader from 'components/ui/loader';

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
      loading,
      setModalMeta,
      menuSection,
      ...rest
    } = this.props;
    const { Component } = activeSection || {};

    return (
      <MediaQuery minDeviceWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-map-menu">
            <div className={cx('menu-tiles', className)}>
              {isDesktop ? (
                <MenuDesktop
                  className="desktop-menu"
                  sections={datasetSections}
                  searchSections={searchSections}
                />
              ) : (
                <MenuMobile
                  className="mobile-menu"
                  sections={mobileSections}
                  setMenuSettings={setMenuSettings}
                />
              )}
            </div>
            <MenuPanel
              active={!!menuSection}
              className="menu-panel"
              onClose={() =>
                setMenuSettings({ menuSection: '', datasetCategory: '' })
              }
              isBig={activeSection && activeSection.large}
              name={activeSection && activeSection.name}
              isDesktop={isDesktop}
            >
              {Component &&
                !loading && (
                  <Component
                    datasets={activeSection.datasets}
                    subCategories={activeSection.subCategories}
                    setMenuSettings={setMenuSettings}
                    onInfoClick={setModalMeta}
                    isDesktop={isDesktop}
                    {...rest}
                  />
                )}
              {loading && <Loader />}
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
  menuSection: PropTypes.string
};

export default Menu;
