import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuTile from '../menu-tile';

class MenuMobile extends PureComponent {
  render() {
    const { className, sections, onToggleMenu } = this.props;

    return (
      <ul className={cx('c-menu-mobile', className)}>
        {sections &&
          sections
            .filter((s) => !s.hidden)
            .map((s) => (
              <MenuTile
                small
                key={s.slug}
                {...s}
                highlight={s.highlight}
                onClick={() => onToggleMenu(s.active ? '' : s.slug)}
              />
            ))}
      </ul>
    );
  }
}

MenuMobile.propTypes = {
  sections: PropTypes.array,
  onToggleMenu: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default MenuMobile;
