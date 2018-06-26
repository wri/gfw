import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';

import './menu-flap-styles.scss';

class MenuFlap extends PureComponent {
  render() {
    const { section, Component, data, isBig, onClickClose } = this.props;

    return (
      <div
        className={`c-menu-flap ${section ? '--showed' : ''} ${
          isBig ? '--big' : ''
        }`}
      >
        <button className="c-menu-flap__close" onClick={onClickClose}>
          <Icon icon={closeIcon} />
          {name}
        </button>
        {Component && data && <Component data={data} />}
      </div>
    );
  }
}

MenuFlap.propTypes = {
  section: PropTypes.string,
  Component: PropTypes.func,
  data: PropTypes.array,
  isBig: PropTypes.bool,
  onClickClose: PropTypes.func
};

export default MenuFlap;
