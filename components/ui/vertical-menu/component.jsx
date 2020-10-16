import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import arrowIcon from 'assets/icons/arrow-down.svg?sprite';

import './styles.scss';

class VerticalMenu extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })),
    onClick: PropTypes.func
  }

  render() {
    const {
      menu,
      value: currentValue,
      onClick,
      className = '',
      ...props
    } = this.props;

    return (
      <ul
        className={`c-vertical-menu ${className}`}
        {...props}
      >
        {menu.map(({ label, value }) => (
          <li className="menu-item" key={label}>
            <Button
              theme=""
              active={value === currentValue}
              onClick={() => onClick(value)}
            >
              {label}
              <Icon icon={arrowIcon} className="arrow-icon" />
            </Button>
          </li>
        ))}
      </ul>
    )
  }
}

export default VerticalMenu;
