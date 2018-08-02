import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Range, Handle } from 'rc-slider';
import Icon from 'components/ui/icon';
import { Tooltip } from 'wri-api-components';

import PlayIcon from 'assets/icons/play.svg';
import PauseIcon from 'assets/icons/pause.svg';

import './styles.scss';

class Timeline extends Component {
  renderHandle = props => {
    const { minDate, isPlaying, dateFormat } = this.props;
    const { value, dragging, index, ...restProps } = props;
    const date = moment(minDate)
      .add(value, 'days')
      .format(dateFormat);
    return (
      <Tooltip
        key={index}
        overlay={date}
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{ color: '#fff' }}
        placement="top"
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        visible={dragging || (isPlaying && index === 1)}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  render() {
    const {
      className,
      isPlaying,
      handleTogglePlay,
      min,
      max,
      start,
      end,
      trim,
      handleOnChange,
      handleOnAfterChange,
      startDate,
      endDate,
      trimEndDate,
      color,
      formatDate,
      marks,
      customColor,
      trackStyle,
      ...props
    } = this.props;

    return (
      <div className={`c-timeline ${className}`}>
        <button className="play-btn" onClick={handleTogglePlay}>
          <Icon icon={isPlaying ? PauseIcon : PlayIcon} />
        </button>
        <Range
          className="range"
          marks={marks}
          disabled={isPlaying}
          handle={this.renderHandle}
          min={min}
          max={max}
          value={[start, end, trim]}
          trackStyle={[
            { ...trackStyle[0], backgroundColor: customColor },
            trackStyle[1],
            trackStyle[2]
          ]}
          {...props}
          onChange={handleOnChange}
          onAfterChange={handleOnAfterChange}
        />
      </div>
    );
  }
}

Timeline.propTypes = {
  className: PropTypes.string,
  isPlaying: PropTypes.bool,
  handleTogglePlay: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  trim: PropTypes.number,
  handleOnChange: PropTypes.func,
  handleOnAfterChange: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  color: PropTypes.string,
  formatDate: PropTypes.string,
  marks: PropTypes.object,
  value: PropTypes.number,
  minDate: PropTypes.string,
  dragging: PropTypes.bool,
  dateFormat: PropTypes.string,
  index: PropTypes.number,
  customColor: PropTypes.string,
  trackStyle: PropTypes.array
};

export default Timeline;
