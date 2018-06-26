import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuFlap from 'pages/map/menu/components/menu-flap';

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
          <div className="c-map-menu__item-badge">3</div>
        </button>
      </li>
    );
  };

  render() {
    const {
      sections,
      selectedSection,
      selectedSectionData,
      setSelectedSection
    } = this.props;

    return (
      <div>
        <div className="c-map-menu">
          <img
            className="c-map-menu__logo"
            src={gfwLogo}
            alt="Global Forest Watch"
          />
          {sections && (
            <ul
              className={`c-map-menu__buttons-group ${
                selectedSection ? '--has-selection' : ''
              }`}
            >
              {Object.keys(sections).map(key =>
                this.renderMenuItem(key, sections[key])
              )}
            </ul>
          )}
        </div>
        <MenuFlap
          section={selectedSection}
          Component={selectedSectionData ? selectedSectionData.Component : null}
          data={selectedSectionData ? selectedSectionData.data : null}
          isBig={
            selectedSectionData && selectedSectionData.bigFlap
              ? selectedSectionData.bigFlap
              : false
          }
          onClickClose={() => setSelectedSection(null)}
        />
      </div>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.object,
  selectedSection: PropTypes.string,
  selectedSectionData: PropTypes.object,
  setSelectedSection: PropTypes.func.isRequired
};

export default Menu;
