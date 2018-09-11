import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuFlap from 'pages/map-v2/menu/components/menu-flap';

import Icon from 'components/ui/icon';
import Loader from 'components/ui/loader';

import gfwLogo from 'assets/logos/gfw.png';

import './menu-styles.scss';

class Menu extends PureComponent {
  render() {
    const {
      sections,
      activeSection,
      selectedSection,
      onToggleLayer,
      setModalMeta,
      activeDatasets,
      loading,
      countries,
      setMenuSettings,
      setMapSettings,
      toggleMenu,
      selectedCountries,
      countriesWithoutData
    } = this.props;
    const { Component } = activeSection || {};

    return (
      <div>
        <div className="c-map-menu">
          <button onClick={toggleMenu}>
            <img
              className="c-map-menu__logo"
              src={gfwLogo}
              alt="Global Forest Watch"
            />
          </button>
          {sections && (
            <ul
              className={`c-map-menu__buttons-group ${
                selectedSection ? '--has-selection' : ''
              }`}
            >
              {sections.map(section => {
                const { slug, name, icon, layerCount } = section;
                return (
                  <li
                    key={`menu_${slug}`}
                    className={`c-map-menu__item ${
                      selectedSection === slug ? '--selected' : ''
                    }`}
                  >
                    <button
                      className="c-map-menu__item-button"
                      onClick={() =>
                        setMenuSettings({
                          selectedSection: slug === selectedSection ? '' : slug
                        })
                      }
                      disabled={loading}
                    >
                      <Icon icon={icon} className="icon" />
                      {name}
                      {!!layerCount && (
                        <div className="c-map-menu__item-badge">
                          {layerCount}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <MenuFlap
          section={selectedSection}
          isBig={activeSection && activeSection.large}
          onClickClose={() => setMenuSettings({ selectedSection: '' })}
        >
          {Component &&
            !loading && (
              <Component
                {...activeSection}
                onToggleLayer={onToggleLayer}
                onInfoClick={setModalMeta}
                countries={countries}
                setMenuSettings={setMenuSettings}
                setMapSettings={setMapSettings}
                selectedCountries={selectedCountries}
                countriesWithoutData={countriesWithoutData}
                activeDatasets={activeDatasets}
              />
            )}
          {loading && <Loader />}
        </MenuFlap>
      </div>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.array,
  selectedSection: PropTypes.string,
  activeSection: PropTypes.object,
  setMenuSettings: PropTypes.func,
  layers: PropTypes.array,
  onToggleLayer: PropTypes.func,
  setModalMeta: PropTypes.func,
  loading: PropTypes.bool,
  countries: PropTypes.array,
  selectedCountries: PropTypes.array,
  toggleMenu: PropTypes.func,
  countriesWithoutData: PropTypes.array,
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func
};

export default Menu;
