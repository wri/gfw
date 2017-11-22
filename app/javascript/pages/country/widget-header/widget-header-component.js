import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';

import './widget-header-styles.scss';

class WidgetHeader extends PureComponent {
  render() {
    const { children, title, noMap, viewOnMapCallback, openShare } = this.props;

    return (
      <div className="c-widget-header">
        <div className="c-widget-header__title">{title}</div>
        <ul className="c-widget-header__options">
          {noMap === null || !noMap ? (
            <button
              className="c-widget-header__option-button"
              onClick={viewOnMapCallback}
            >
              VIEW ON MAP
            </button>
          ) : null}
          <li className="c-widget-header__option-circle c-widget-header__option-circle--green">
            <svg className="icon icon-info">
              <use xlinkHref="#icon-info" />
            </svg>
          </li>
          <li>
            {children !== undefined && children.props.type === 'settings' ? (
              <Tooltip
                theme="light"
                position="bottom-right"
                offset={-95}
                trigger="click"
                interactive
                arrow
                html={children}
              >
                <div className="c-widget-header__option-circle c-widget-header__option-circle--green">
                  <svg className="icon icon-settings">
                    <use xlinkHref="#icon-settings" />
                  </svg>
                </div>
              </Tooltip>
            ) : null}
          </li>
          <button
            className="c-widget-header__option-circle c-widget-header__option-circle--white"
            onClick={openShare}
          >
            <svg className="icon icon-share -dark">
              <use xlinkHref="#icon-share" />
            </svg>
          </button>
        </ul>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  openShare: PropTypes.func.isRequired,
  noMap: PropTypes.bool,
  viewOnMapCallback: PropTypes.func,
  children: PropTypes.object
};

export default WidgetHeader;
