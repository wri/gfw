import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';
import posed, { PoseGroup } from 'react-pose';

import './styles.scss';

const PanelContainer = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 300
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 200 }
  }
});

class MenuPanel extends PureComponent {
  render() {
    const {
      active,
      className,
      isDesktop,
      name,
      title,
      isBig,
      onClose,
      children
    } = this.props;

    return (
      <PoseGroup>
        {active && (
          <PanelContainer
            key="menu-container"
            className={cx('c-menu-panel', { big: isBig }, className)}
          >
            <div className="panel-header">
              {title || name}
              <button className="close-menu" onClick={onClose}>
                <Icon
                  icon={isDesktop ? closeIcon : arrowIcon}
                  className="icon-close-panel"
                />
              </button>
            </div>
            <div className="panel-body">{children}</div>
          </PanelContainer>
        )}
      </PoseGroup>
    );
  }
}

MenuPanel.propTypes = {
  children: PropTypes.node,
  isBig: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  isDesktop: PropTypes.bool,
  name: PropTypes.string,
  active: PropTypes.bool,
  title: PropTypes.string
};

export default MenuPanel;
