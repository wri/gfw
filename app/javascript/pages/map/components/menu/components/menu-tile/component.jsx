import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import './styles.scss';

class MenuTile extends PureComponent {
  render() {
    const {
      label,
      active,
      small,
      onClick,
      loading,
      icon,
      layerCount,
      highlight,
      className
    } = this.props;

    return (
      <li className={cx('c-map-menu-tile', { active }, { small }, className)}>
        <button className="item-button" onClick={onClick} disabled={loading}>
          <div className="button-wrapper">
            <Icon icon={icon} className="tile-icon" />
            <span>{label}</span>
            {(!!layerCount || highlight) && (
              <div className="item-badge">
                {layerCount || (highlight && '1')}
              </div>
            )}
          </div>
        </button>
      </li>
    );
  }
}

MenuTile.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  active: PropTypes.bool,
  small: PropTypes.bool,
  highlight: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.object,
  layerCount: PropTypes.number,
  className: PropTypes.string
};

export default MenuTile;
