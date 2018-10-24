import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import startCase from 'lodash/startCase';

import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';
import posed, { PoseGroup } from 'react-pose';

import './styles.scss';

const PanelMobile = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 200,
    transition: { duration: 200 }
  },
  exit: {
    y: 50,
    opacity: 0,
    delay: 200,
    transition: { duration: 200 }
  }
});

const PanelDesktop = posed.div({
  enter: {
    x: 66,
    opacity: 1,
    delay: 300
  },
  exit: {
    x: 0,
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
      label,
      category,
      large,
      onClose,
      children,
      loading,
      setMenuSettings
    } = this.props;
    const Panel = isDesktop ? PanelDesktop : PanelMobile;

    return (
      <PoseGroup>
        {active && (
          <Panel
            key="menu-container"
            className={cx('c-menu-panel', { large }, className)}
          >
            {!isDesktop ? (
              <div className="panel-header">
                <div className="panel-label">
                  {category ? (
                    <button
                      onClick={() => setMenuSettings({ datasetCategory: '' })}
                    >
                      <Icon icon={arrowIcon} className="icon-return" />
                      <span>{startCase(category)}</span>
                    </button>
                  ) : (
                    <span>{label}</span>
                  )}
                </div>
                <button className="panel-close" onClick={onClose}>
                  <Icon icon={arrowIcon} className="icon-close-panel" />
                </button>
              </div>
            ) : (
              <button className="close-menu" onClick={onClose}>
                <Icon icon={closeIcon} className="icon-close-panel" />
              </button>
            )}
            <div className="panel-body">{children}</div>
            {loading && <Loader className="map-menu-loader" />}
          </Panel>
        )}
      </PoseGroup>
    );
  }
}

MenuPanel.propTypes = {
  children: PropTypes.node,
  large: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  setMenuSettings: PropTypes.func,
  isDesktop: PropTypes.bool,
  label: PropTypes.string,
  category: PropTypes.string,
  active: PropTypes.bool,
  loading: PropTypes.bool
};

export default MenuPanel;
