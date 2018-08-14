import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';
import './styles.scss';

const Button = props => {
  const { label, onRemove } = props;

  return (
    <div className={`c-pill ${onRemove ? '-removable' : ''}`}>
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
  onRemove: PropTypes.func
};

export default Button;
