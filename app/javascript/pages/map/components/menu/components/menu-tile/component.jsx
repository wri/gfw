import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import './styles.scss';

class MenuTile extends PureComponent {
  render() {
    const {
      slug,
      label,
      active,
      small,
      onClick,
      loading,
      icon,
      layerCount,
      highlight
    } = this.props;

    return (
      <li
        className={cx('c-map-menu-tile', { active }, { small })}
        key={`menu_${slug}`}
      >
        <button className="item-button" onClick={onClick} disabled={loading}>
          <Icon icon={icon} className="tile-icon" />
          <span>{label}</span>
          {(!!layerCount || highlight) && (
            <div className="item-badge">{layerCount || (highlight && '1')}</div>
          )}
        </button>
      </li>
    );
  }
}

MenuTile.propTypes = {
  slug: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  active: PropTypes.bool,
  small: PropTypes.bool,
  highlight: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.object,
  layerCount: PropTypes.number
};

export default MenuTile;
