import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Slider } from 'components/slider';

import './styles.scss';

class LegendOpacityTooltip extends PureComponent {
  static propTypes = {
    // Layers
    activeLayer: PropTypes.object.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    // Callback to call when the layer changes with
    // the ID of the dataset and the ID of the layer
    onChangeOpacity: PropTypes.func.isRequired
  };

  static defaultProps = {
    min: 0,
    max: 1,
    step: 0.01
  }

  constructor(props) {
    super(props);

    const { activeLayer = {} } = this.props;
    const { opacity } = activeLayer;

    this.state = {
      opacity: typeof opacity !== 'undefined' ? opacity : 1
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeLayer: { opacity } } = this.props;
    const { activeLayer: { opacity: prevOpacity } } = prevProps;
    const { opacity: stateOpacity } = this.state
    const { opacity: prevStateOpacity } = prevState;

    if (opacity !== prevOpacity && stateOpacity === prevStateOpacity) {
      this.setState({ opacity }); // eslint-disable-line
    }
  }

  onChange = (v) => {
    const { activeLayer, onChangeOpacity } = this.props;
    onChangeOpacity(activeLayer, v);
  }

  render() {
    const { min, max, step, ...rest } = this.props;
    const { opacity } = this.state;

    return (
      <div className="c-legend-item-button-opacity-tooltip" ref={(node) => { this.el = node; }}>
        Opacity

        <div className="slider-tooltip-container">
          <Slider
            marks={{
              [min]: '0%',
              [max]: '100%'
            }}
            min={min}
            max={max}
            step={step}
            value={opacity}
            formatValue={perc => `${Math.round(perc * 100)}%`}
            onChange={value => this.setState({ opacity: value })}
            onAfterChange={this.onChange}
            trackStyle={{
              backgroundColor: '#c32d7b',
              borderRadius: '0px'
            }}
            {...rest}
          />
        </div>
      </div>
    );
  }
}

export default LegendOpacityTooltip;
