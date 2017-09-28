import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

class WidgetHeader extends PureComponent {

  componentDidMount() {
    this.setListeners();
  }

  setListeners() {
    const {
      children
    } = this.props;

    if (children !== undefined) {
      for (const tooltip of document.querySelectorAll(`.${children.key} [data-id='tooltip']`)) {
        tooltip.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }
  }

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
          {children !== undefined && children.props.type === 'settings' ?
            <li className={`c-widget-header__option-circle c-widget-header__option-circle--green ${children.key}`}>
              <svg
                className="icon icon-settings"
                data-tip="custom show" data-event="click">
                <use xlinkHref="#icon-settings"></use>
              </svg>
              <ReactTooltip
                globalEventOff="click"
                place="bottom"
                effect="solid">{children}</ReactTooltip>
            </li>
            : null}
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
