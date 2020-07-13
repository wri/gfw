import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import closeIcon from 'assets/icons/close.svg?sprite';

import './styles.scss';

const Selector = (props) => {
  const {
    isOpen,
    className,
    arrowPosition,
    onSelectorClick,
    clearable,
    activeValue,
    activeLabel,
    searchable,
    inputProps,
    handleClearSelection,
    children,
    innerRef,
    selectorIcon,
  } = props;

  return (
    <div
      ref={innerRef}
      className={`container ${isOpen ? 'is-open' : ''} ${className || ''}`}
    >
      <div
        className={`c-selector ${arrowPosition ? 'align-left' : ''} ${
          clearable && activeValue ? 'clearable' : ''
        }`}
      >
        {arrowPosition === 'left' && (
          <button className="arrow-btn" onClick={onSelectorClick}>
            <Icon className="arrow" icon={arrowDownIcon} />
          </button>
        )}
        <span
          className={`value ${!activeValue ? 'no-value' : ''} ${
            clearable && activeValue ? 'clearable' : ''
          }`}
        >
          {(isOpen && !searchable) || !isOpen ? activeLabel : ''}
        </span>
        {selectorIcon && (
          <button className="selector-btn" onClick={onSelectorClick}>
            <Icon className="selector-icon" icon={selectorIcon} />
          </button>
        )}
        <input {...inputProps()} />
        {clearable && activeValue && (
          <button className="clear-btn" onClick={handleClearSelection}>
            <Icon icon={closeIcon} className="clear-icon" />
          </button>
        )}
        {arrowPosition !== 'left' && (
          <button className="arrow-btn" onClick={onSelectorClick}>
            <Icon className="arrow" icon={arrowDownIcon} />
          </button>
        )}
      </div>
      <div className="menu-arrow" />
      {children}
    </div>
  );
};

Selector.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  arrowPosition: PropTypes.string,
  onSelectorClick: PropTypes.func,
  clearable: PropTypes.bool,
  activeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  activeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchable: PropTypes.bool,
  inputProps: PropTypes.func,
  handleClearSelection: PropTypes.func,
  innerRef: PropTypes.func,
  className: PropTypes.string,
  selectorIcon: PropTypes.func,
};

export default Selector;
