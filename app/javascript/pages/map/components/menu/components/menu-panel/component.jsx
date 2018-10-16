import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';

import './styles.scss';

class MenuFlap extends PureComponent {
  render() {
    const { className, isBig, onClose, children } = this.props;

    return (
      <div className={cx('c-menu-panel', { big: isBig }, className)}>
        <button className="close-menu" onClick={onClose}>
          <Icon icon={closeIcon} className="icon-close-panel" />
          {name}
        </button>
        {children}
      </div>
    );
  }
}

MenuFlap.propTypes = {
  children: PropTypes.node,
  isBig: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func
};

export default MenuFlap;
