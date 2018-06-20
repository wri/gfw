import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import gfwLogo from 'assets/logos/gfw.png';

import './menu-styles.scss';

class Menu extends PureComponent {
  renderMenuItem = (key, section) => {
    const { selectedSection, setSelectedSection } = this.props;
    const { name, icon } = section;
    return (
      <li
        key={`menu_${key}`}
        className={`c-map-menu__item ${
          selectedSection === key ? '--selected' : ''
        }`}
      >
        <button
          className="c-map-menu__item-button"
          onClick={() => {
            setSelectedSection(key);
          }}
        >
          <Icon icon={icon} className="icon" />
          {name}
        </button>
      </li>
    );
  };

  renderMenuFlapComponent = () => {
    const { sections, selectedSection } = this.props;
    if (!selectedSection) return null;

    const { Component } = sections[selectedSection];
    return <Component />;
  };

  render() {
    const { sections, selectedSection } = this.props;

    return (
      <div className="c-map-menu">
        <img
          className="c-map-menu__logo"
          src={gfwLogo}
          alt="Global Forest Watch"
        />
        <div
          className={`c-map-menu__buttons-group ${
            selectedSection ? '--has-selection' : ''
          }`}
        >
          <ul>
            {Object.keys(sections).map(key =>
              this.renderMenuItem(key, sections[key])
            )}
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
          </ul>
          <ul>
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
          </ul>
        </div>
        <div
          className={`c-map-menu__item-flap ${
            selectedSection ? '--showed' : ''
          }`}
        >
          {this.renderMenuFlapComponent()}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.object,
  selectedSection: PropTypes.string,
  setSelectedSection: PropTypes.func.isRequired
};

export default Menu;
