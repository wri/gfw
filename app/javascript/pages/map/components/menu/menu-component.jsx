import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuFlap from 'pages/map/components/menu/components/menu-flap';

import Icon from 'components/ui/icon';
import Loader from 'components/ui/loader';

import './menu-styles.scss';

class Menu extends PureComponent {
  renderMenu = sections => {
    const { selectedSection, setMenuSettings, loading } = this.props;
    return (
      <ul className=" buttons-group">
        {sections.map(section => {
          const { slug, name, icon, layerCount } = section;
          return (
            <li
              key={`menu_${slug}`}
              className={`item ${selectedSection === slug ? '--selected' : ''}`}
            >
              <button
                className="item-button"
                onClick={() =>
                  setMenuSettings({
                    selectedSection: slug === selectedSection ? '' : slug
                  })
                }
                disabled={loading}
              >
                <Icon icon={icon} className="icon" />
                {name}
                {!!layerCount && <div className="item-badge">{layerCount}</div>}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const {
      sections,
      bottomSections,
      activeSection,
      selectedSection,
      setMenuSettings,
      loading,
      setModalMeta,
      ...rest
    } = this.props;
    const { Component } = activeSection || {};

    return (
      <div>
        <div className="c-map-menu">
          <div
            className="menu-tabs"
            style={{ display: window.innerHeight >= 608 ? 'flex' : 'block' }}
          >
            {sections && this.renderMenu(sections)}
            {bottomSections && this.renderMenu(bottomSections)}
          </div>
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
                setMenuSettings={setMenuSettings}
                onInfoClick={setModalMeta}
                {...rest}
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
  countriesWithoutData: PropTypes.array,
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  handleClickLocation: PropTypes.func,
  getLocationFromSearch: PropTypes.func,
  exploreSection: PropTypes.string,
  bottomSections: PropTypes.array
};

export default Menu;
