import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';
import './styles.scss';

const Button = props => {
  const { label, onRemove } = props;

  return (
    <div className="c-pill">
      {label}
      <Icon icon={closeIcon} onClick={onRemove} />
    </div>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onRemove: PropTypes.func
};

export default Button;
