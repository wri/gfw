import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import startCase from 'lodash/startCase';

import { Media } from 'utils/responsive';

import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg?sprite';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import posed, { PoseGroup } from 'react-pose';

import './styles.scss';

const PanelMobile = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 200,
    transition: { duration: 200 },
  },
  exit: {
    y: 50,
    opacity: 0,
    delay: 200,
    transition: { duration: 200 },
  },
});

const PanelDesktop = posed.div({
  enter: {
    x: 66,
    opacity: 1,
    delay: 300,
  },
  exit: {
    x: 0,
    opacity: 0,
    transition: { duration: 200 },
  },
});

class MenuPanel extends PureComponent {
  render() {
    const {
      active,
      className,
      label,
      category,
      large,
      onClose,
      onOpen,
      children,
      loading,
      setMenuSettings,
      collapsed,
    } = this.props;

    return (
      <PoseGroup>
        {active && (
          <Fragment>
            <Media greaterThanOrEqual="md">
              <PanelDesktop
                key="menu-container"
                className={cx(
                  'c-menu-panel',
                  'map-tour-menu-panel',
                  { large },
                  className
                )}
              >
                <button className="close-menu" onClick={onClose}>
                  <Icon icon={closeIcon} className="icon-close-panel" />
                </button>
                {!loading && <div className="panel-body">{children}</div>}
                {loading && <Loader className="map-menu-loader" />}
              </PanelDesktop>
            </Media>
            <Media lessThan="md">
              <PanelMobile
                key="menu-container"
                className={cx(
                  'c-menu-panel',
                  'map-tour-menu-panel',
                  { large },
                  className
                )}
              >
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
                  <Button
                    className="panel-close"
                    theme="theme-button-clear"
                    onClick={collapsed ? onOpen : onClose}
                  >
                    <Icon
                      icon={arrowIcon}
                      className={cx('icon-close-panel', { collapsed })}
                    />
                  </Button>
                </div>
                {!loading && <div className="panel-body">{children}</div>}
                {loading && <Loader className="map-menu-loader" />}
              </PanelMobile>
            </Media>
          </Fragment>
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
  label: PropTypes.string,
  category: PropTypes.string,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  collapsed: PropTypes.bool,
  onOpen: PropTypes.func,
};

export default MenuPanel;
