import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import fill from 'lodash/fill';

import RCSlider, { Range, Handle } from 'rc-slider';
import Tooltip from 'wri-api-components/dist/tooltip';

import 'rc-slider/assets/index.css';
import './styles.scss';

class Slider extends PureComponent {
  renderHandle = props => {
    const { formatValue, showTooltip } = this.props;
    const { value, dragging, index, ...restProps } = props;
    const formattedValue = formatValue(value);

    return (
      <Tooltip
        key={index}
        overlay={formattedValue}
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{ color: '#fff' }}
        placement="top"
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        visible={dragging || showTooltip(index)}
      >
        <Handle className="drag-handle" value={value} {...restProps} />
      </Tooltip>
    );
  };

  render() {
    const {
      className,
      range,
      trackColors,
      trackStyle,
      handleStyle,
      value,
      ...rest
    } = this.props;

    const Component = range ? Range : RCSlider;
    const handleNum = value.length;
    const handleStyles = fill(Array(handleNum), {
      zIndex: 0,
      width: '1px',
      height: '10px',
      backgroundColor: '#808080',
      marginLeft: '-1px',
      marginTop: '-3px',
      borderRadius: 0,
      border: 0
    });
    handleStyles[0] = handleStyle;
    handleStyles[handleNum - 1] = handleStyle;

    const trackStyles = fill(Array(handleNum - 1), trackStyle).map((t, i) => ({
      ...t,
      backgroundColor: trackColors[i] || ''
    }));

    return (
      <div className={`c-slider ${className || ''}`}>
        <Component
          handle={this.renderHandle}
          {...rest}
          handleStyle={handleStyles}
          trackStyle={trackStyles}
          value={value}
        />
      </div>
    );
  }
}

Slider.defaultProps = {
  trackStyle: { backgroundColor: '#d6d6d9', borderRadius: '0px' },
  handleStyle: {
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
    border: '0px',
    zIndex: 1
  },
  railStyle: { backgroundColor: '#d6d6d9' },
  dotStyle: { visibility: 'hidden', border: '0px' },
  pushable: true
};

Slider.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.object,
  value: PropTypes.array,
  dragging: PropTypes.bool,
  index: PropTypes.number,
  range: PropTypes.bool,
  handleStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  trackColors: PropTypes.array,
  formatValue: PropTypes.func,
  showTooltip: PropTypes.func
};

export default Slider;
