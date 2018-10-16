import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import gfwLogo from 'assets/logos/gfw.png';
import MenuTile from '../menu-tile';

import './styles.scss';

class MenuMobile extends PureComponent {
  render() {
    const { className, sections, setMenuSettings } = this.props;

    return (
      <div className={cx('c-menu-mobile', className)}>
        <a href="/">
          <img src={gfwLogo} alt="Global Forest Watch" width="50" height="50" />
        </a>
        <ul className="menu-tiles">
          {sections &&
            sections.map(s => (
              <MenuTile
                className="mobile-tile"
                small
                key={s.slug}
                {...s}
                onClick={() =>
                  setMenuSettings({
                    menuSection: s.active ? '' : s.slug,
                    datasetCategory: s.slug === 'layers' ? 'forestChange' : ''
                  })
                }
              />
            ))}
        </ul>
      </div>
    );
  }
}

MenuMobile.propTypes = {
  sections: PropTypes.array,
  setMenuSettings: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool
};

export default MenuMobile;
