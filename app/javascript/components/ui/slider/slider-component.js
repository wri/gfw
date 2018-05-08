import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RCSlider from 'rc-slider/lib/Slider';

import 'rc-slider/assets/index.css';
import './themes/slider-green.scss';

const defaultSettings = {
  min: 0,
  max: 100,
  defaultValue: 50,
  tipFormatter: value => `${value}%`,
  marksOnTop: false
};

class Slider extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, settings, handleOnSliderChange } = this.props;
    const sliderSettings = {
      ...defaultSettings,
      ...settings
    };

    return (
      <div
        className={`c-slider ${className || ''} ${
          sliderSettings.marksOnTop ? '-marks-on-top' : ''
        }`}
      >
        <RCSlider
          {...sliderSettings}
          onChange={d => {
            handleOnSliderChange(d);
          }}
        />
      </div>
    );
  }
}

Slider.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.object,
  handleOnSliderChange: PropTypes.func.isRequired
};

export default Slider;
