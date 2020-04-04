import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { logEvent } from 'app/analytics';

import MenuTile from '../menu-tile';

import './styles.scss';

class MenuMobile extends PureComponent {
  render() {
    const { className, sections, setMenuSettings } = this.props;

    return (
      <ul className={cx('c-menu-mobile', className)}>
        {sections &&
          sections.filter(s => !s.hidden).map(s => (
            <MenuTile
              small
              key={s.slug}
              {...s}
              hightlight={s.highlight}
              onClick={() => {
                setMenuSettings({
                  menuSection: s.active ? '' : s.slug
                });
                if (!s.active) {
                  logEvent('mapMenuSection', { label: s.slug });
                }
              }}
            />
          ))}
      </ul>
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
