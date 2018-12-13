import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import moment from 'moment';

import Icon from 'components/ui/icon';
import Slider from 'components/ui/slider';
import Datepicker from 'components/ui/datepicker';

import PlayIcon from 'assets/icons/play.svg';
import PauseIcon from 'assets/icons/pause.svg';

import './styles.scss';

class Timeline extends Component {
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
      marks,
      customColor,
      formatDateString,
      step,
      canPlay,
      minDate,
      maxDate,
      startDate,
      trimEndDate,
      handleOnDateChange,
      dateFormat,
      interval
    } = this.props;

    return (
      <div className={`c-timeline ${className || ''}`}>
        {dateFormat === 'YYYY-MM-DD' &&
          interval !== 'years' && (
            <div className="date-pickers">
              From
              <Datepicker
                className="datepicker start-date"
                theme="datepicker-small"
                date={moment(startDate)}
                handleOnDateChange={date => handleOnDateChange(date, 0)}
                settings={{
                  appendToBody: true,
                  displayFormat: 'DD MMM YYYY',
                  numberOfMonths: 1,
                  minDate,
                  maxDate: trimEndDate,
                  isOutsideRange: d =>
                    d.isAfter(moment(trimEndDate)) ||
                    d.isBefore(moment(minDate)),
                  hideKeyboardShortcutsPanel: true,
                  noBorder: true,
                  readOnly: true
                }}
              />
              to
              <Datepicker
                className="datepicker"
                theme="datepicker-small"
                date={moment(trimEndDate)}
                handleOnDateChange={date => handleOnDateChange(date, 2)}
                settings={{
                  appendToBody: true,
                  displayFormat: 'DD MMM YYYY',
                  numberOfMonths: 1,
                  minDate: startDate,
                  maxDate,
                  isOutsideRange: d =>
                    d.isAfter(moment(maxDate)) || d.isBefore(moment(startDate)),
                  hideKeyboardShortcutsPanel: true,
                  noBorder: true,
                  readOnly: true
                }}
              />
            </div>
          )}
        <div className="range-slider">
          {canPlay && (
            <button className="control-btn" onClick={handleTogglePlay}>
              <Icon
                className={isPlaying ? 'pause' : 'play'}
                icon={isPlaying ? PauseIcon : PlayIcon}
              />
            </button>
          )}
          <Slider
            className={`range ${canPlay ? 'can-play' : ''}`}
            marks={marks}
            disabled={isPlaying}
            min={min}
            max={max}
            value={canPlay ? [start, end, trim] : [start, end]}
            trackColors={[customColor, chroma(customColor).darken(1.3)]}
            step={step}
            onChange={handleOnChange}
            onAfterChange={handleOnAfterChange}
            formatValue={formatDateString}
            showTooltip={index => isPlaying && index === 1}
            range
          />
        </div>
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
  marks: PropTypes.object,
  formatDateString: PropTypes.func,
  customColor: PropTypes.string,
  step: PropTypes.number,
  canPlay: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  startDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  handleOnDateChange: PropTypes.func,
  dateFormat: PropTypes.string,
  interval: PropTypes.string
};

export default Timeline;
