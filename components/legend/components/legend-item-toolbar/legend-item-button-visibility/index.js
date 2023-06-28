import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'vizzuality-components';
import '../styles-button.scss';

class LegendItemButtonVisibility extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object,
    visibility: PropTypes.bool,
    onChangeVisibility: PropTypes.func,
    iconShow: PropTypes.string,
    iconHide: PropTypes.string,
    focusStyle: PropTypes.object,
    defaultStyle: PropTypes.object,
    tooltipOpened: PropTypes.bool,
    tooltipText: PropTypes.string,
    scrolling: PropTypes.bool
  }

  static defaultProps = {
    activeLayer: {},
    visibility: true,
    iconShow: '',
    iconHide: '',
    focusStyle: {},
    defaultStyle: {},
    tooltipOpened: false,
    tooltipText: '',
    scrolling: false,

    onChangeVisibility: () => {}
  }

  state = {
    visible: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { scrolling } = nextProps;

    if (scrolling) {
      this.setState({ visible: false });
    }
  }

  render() {
    const { activeLayer, visibility, tooltipOpened, iconShow, iconHide, focusStyle, defaultStyle, tooltipText } = this.props;
    const { visible } = this.state;

    const showIcon = iconShow || 'icon-show';
    const hideIcon = iconHide || 'icon-hide';
    const activeIcon = visibility ? hideIcon : showIcon;

    return (
      <Tooltip
        overlay={tooltipText || (visibility ? 'Hide layer' : 'Show layer')}
        overlayClassName="c-rc-tooltip -default"
        placement="top"
        trigger={tooltipOpened ? '' : 'hover'}
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        onVisibleChange={v => this.setState({ visible: v })}
        visible={visible}
      >
        <button
          type="button"
          styleName="c-legend-button toggle"
          onClick={() => this.props.onChangeVisibility(activeLayer, !visibility)}
          aria-label="Toggle the visibility"
        >
          <Icon name={activeIcon} className="-small" style={visible ? focusStyle : defaultStyle} />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonVisibility;
