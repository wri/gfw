import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';
import './styles.scss';

const Button = props => {
  const { label, onRemove, active } = props;

  return (
    <div
      className={`c-pill ${onRemove ? '-removable' : ''} ${
        active ? '-active' : ''
      }`}
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
  label: PropTypes.string,
  onRemove: PropTypes.func,
  active: PropTypes.bool
};

export default Button;
