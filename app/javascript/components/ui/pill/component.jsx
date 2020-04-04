import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg?sprite';
import './styles.scss';

const Button = props => {
  const { active, className, label, onRemove, onClick } = props;

  return (
    <div
      className={cx('c-pill', {
        '-removable': onRemove,
        '-active': active,
        '-clickable': onClick,
        [className]: className
      })}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : ''}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove}>
          <Icon icon={closeIcon} />
        </button>
      )}
    </div>
  );
};

Button.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  onRemove: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
