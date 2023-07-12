import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import  Tooltip  from 'components/tooltip';
import  Icon  from 'components/ui/icon';

import LegendOpacityTooltip from './legend-item-button-opacity-tooltip';
import styles from '../styles-button.scss';

class LegendItemButtonOpacity extends PureComponent {
  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({})),
    activeLayer: PropTypes.object,
    visibility: PropTypes.bool,
    tooltipOpened: PropTypes.bool,
    icon: PropTypes.string,
    className: PropTypes.string,
    focusStyle: PropTypes.shape({}),
    defaultStyle: PropTypes.shape({}),
    enabledStyle: PropTypes.shape({}),
    disabledStyle: PropTypes.shape({}),
    tooltipText: PropTypes.string,
    scrolling: PropTypes.bool,

    onChangeOpacity: PropTypes.func,
    onTooltipVisibilityChange: PropTypes.func
  }

  static defaultProps = {
    layers: [],
    activeLayer: {},
    visibility: true,
    icon: '',
    className: '',
    focusStyle: {},
    defaultStyle: {},
    enabledStyle: {},
    disabledStyle: {},
    tooltipOpened: false,
    tooltipText: '',
    scrolling: false,

    onChangeOpacity: () => {},
    onTooltipVisibilityChange: () => {}
  }

  state = {
    visibilityHover: false,
    visibilityClick: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { scrolling } = nextProps;

    if (scrolling) {
      this.onTooltipVisibilityChange(false);
    }
  }

  onTooltipVisibilityChange = (v) => {
    const { visibility, onTooltipVisibilityChange } = this.props;

    if (visibility) {
      this.setState({
        visibilityHover: false,
        visibilityClick: v
      });

      onTooltipVisibilityChange(v);
    }

  }

  setHoverText = (tooltipText, opacity, visibility) => {
    if (tooltipText) return tooltipText;

    if (!visibility) return 'Opacity (disabled)';

    return `Opacity ${(typeof opacity !== 'undefined') ? `(${Math.round(opacity * 100)}%)` : ''}`;
  }

  render() {
    const {
      layers,
      visibility,
      activeLayer,
      tooltipOpened,
      icon,
      className,
      enabledStyle,
      defaultStyle,
      disabledStyle,
      focusStyle,
      tooltipText,
      scrolling,
      onChangeOpacity,
      ...rest
    } = this.props;

    const { visibilityClick, visibilityHover } = this.state;
    const { opacity } = activeLayer;
    let iconStyle = visibility ? defaultStyle : disabledStyle;
    if (visibility && (visibilityHover || visibilityClick)) {
      iconStyle = focusStyle;
    }
    if (visibility && opacity < 1) iconStyle = enabledStyle;

    return (
      <Tooltip
        overlay={
          visibility && (
          <LegendOpacityTooltip
            layers={layers}
            activeLayer={activeLayer}
            onChangeOpacity={onChangeOpacity}
            {...rest}
          />
        )
}
        visible={visibility && visibilityClick}
        overlayClassName={`c-rc-tooltip ${classnames({ '-default': visibility })} ${className || ''}`}
        placement="top"
        trigger={['click']}
        onVisibleChange={this.onTooltipVisibilityChange}
        destroyTooltipOnHide
      >
        <Tooltip
          visible={visibilityHover && !visibilityClick}
          overlay={this.setHoverText(tooltipText, opacity, visibility)}
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={tooltipOpened ? '' : 'hover'}
          onVisibleChange={v => this.setState({ visibilityHover: v })}
          destroyTooltipOnHide
          style={styles.tooltip}
        >
          <button
            type="button"
            className={`c-legend-button opacity ${classnames({ '-disabled': !visibility })}`}
            aria-label="Change opacity"
          >
            <Icon icon={icon || 'icon-opacity'} className="-small" style={iconStyle} />
          </button>
        </Tooltip>

      </Tooltip>
    );
  }
}

export default LegendItemButtonOpacity;
