import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuTile from '../menu-tile';

import './styles.scss';

class MenuDesktop extends PureComponent {
  render() {
    const {
      className,
      datasetSections,
      searchSections,
      setMenuSettings
    } = this.props;

    return (
      <div
        className={cx('c-menu-desktop', className)}
        style={{ display: window.innerHeight >= 608 ? 'flex' : 'block' }}
      >
        {datasetSections &&
          datasetSections.map(s => (
            <MenuTile
              className="mobile-tile"
              small
              key={s.slug}
              {...s}
              onClick={() =>
                setMenuSettings({
                  datasetCategory: s.active ? '' : s.category,
                  menuSection: s.active ? '' : s.slug
                })
              }
            />
          ))}
        {searchSections &&
          searchSections.map(s => (
            <MenuTile
              className="mobile-tile"
              small
              key={s.slug}
              onClick={() =>
                setMenuSettings({
                  menuSection: s.active ? '' : s.slug,
                  datasetCategory: ''
                })
              }
              {...s}
            />
          ))}
      </div>
    );
  }
}

MenuDesktop.propTypes = {
  datasetSections: PropTypes.array,
  searchSections: PropTypes.array,
  setMenuSettings: PropTypes.func,
  className: PropTypes.string
};

export default MenuDesktop;
