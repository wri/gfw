import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
} from 'react-tippy';

class WidgetHeader extends PureComponent {

  render() {
    const {
      children,
      title,
      noMap,
      viewOnMapCallback
    } = this.props;

    return (
      <div className="c-widget-header">
        <div className="c-widget-header__title">{title}</div>
        <ul className="c-widget-header__options">
          { noMap === null || !noMap ?
            <li className="c-widget-header__option-button" onClick={viewOnMapCallback}>VIEW ON MAP</li> : null }
          <li className="c-widget-header__option-circle c-widget-header__option-circle--green">
            <svg className="icon icon-info">
              <use xlinkHref="#icon-info"></use>
            </svg>
          </li>
          <li>
            {children !== undefined && children.props.type === 'settings' ?
              <Tooltip
                theme="light"
                position="bottom-right"
                offset={-95}
                trigger="click"
                interactive={true}
                arrow={true}
                html={children}>
                <div className={`c-widget-header__option-circle c-widget-header__option-circle--green`}>
                  <svg className="icon icon-settings"><use xlinkHref="#icon-settings"></use></svg>
                </div>
              </Tooltip>
              : null}
          </li>
          <li className="c-widget-header__option-circle c-widget-header__option-circle--white">
            <svg className="icon icon-share -dark">
              <use xlinkHref="#icon-share"></use>
            </svg>
          </li>
        </ul>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  noMap: PropTypes.bool,
  viewOnMapCallback: PropTypes.func
};

export default WidgetHeader;
