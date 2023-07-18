import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'components/tooltip';
import Icon from 'components/ui/icon';

import '../styles-button.scss';

class LegendItemButtonRemove extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object,
    icon: PropTypes.string,
    focusStyle: PropTypes.object,
    defaultStyle: PropTypes.object,
    tooltipOpened: PropTypes.bool,
    tooltipText: PropTypes.string,
    scrolling: PropTypes.bool,

    // ACTIONS
    onRemoveLayer: PropTypes.func,
  };

  static defaultProps = {
    activeLayer: {},
    icon: '',
    focusStyle: {},
    defaultStyle: {},
    tooltipOpened: false,
    tooltipText: '',
    scrolling: false,

    // ACTIONS
    onRemoveLayer: () => {},
  };

  state = {
    visible: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { scrolling } = nextProps;

    if (scrolling) {
      this.setState({ visible: false });
    }
  }

  render() {
    const {
      activeLayer,
      tooltipOpened,
      icon,
      focusStyle,
      defaultStyle,
      tooltipText,
    } = this.props;
    const { visible } = this.state;

    return (
      <Tooltip
        overlay={tooltipText || 'Remove layer'}
        overlayClassName="c-rc-tooltip -default"
        placement="top"
        trigger={tooltipOpened ? '' : 'hover'}
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        onVisibleChange={(v) => this.setState({ visible: v })}
        visible={visible}
      >
        <button
          type="button"
          className="c-legend-button close"
          onClick={() => this.props.onRemoveLayer(activeLayer)}
          aria-label="Remove"
        >
          <Icon
            icon={icon || 'icon-cross'}
            className="c-icon-small"
            style={visible ? focusStyle : defaultStyle}
          />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonRemove;
