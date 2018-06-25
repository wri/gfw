import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import gfwLogo from 'assets/logos/gfw.png';
import closeIcon from 'assets/icons/close.svg';

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
          <div className="c-map-menu__item-badge">3</div>
        </button>
      </li>
    );
  };

  renderMenuFlapComponent = () => {
    const { selectedSectionData } = this.props;
    if (!selectedSectionData) return null;

    const { Component, data } = selectedSectionData;
    return <Component data={data} />;
  };

  render() {
    const { sections, selectedSection, setSelectedSection } = this.props;

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
          {sections &&
            sections.map((block, i) => (
              <ul key={`map-menu-block-${i}`}>
                {Object.keys(block).map(key =>
                  this.renderMenuItem(key, block[key])
                )}
              </ul>
            ))}
        </div>
        <div
          className={`c-map-menu__flap ${selectedSection ? '--showed' : ''}`}
        >
          <button
            className="c-map-menu__flap__close"
            onClick={() => {
              setSelectedSection(null);
            }}
          >
            <Icon icon={closeIcon} />
            {name}
          </button>
          {this.renderMenuFlapComponent()}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.array,
  selectedSection: PropTypes.string,
  selectedSectionData: PropTypes.object,
  setSelectedSection: PropTypes.func.isRequired
};

export default Menu;
