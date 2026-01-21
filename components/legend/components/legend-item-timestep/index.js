import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

import Timestep from 'components/timestep';

import {
  addToDate,
  dateDiff,
  gradientConverter,
  formatDatePretty,
  formatDate,
  getTicks,
} from './utils';

export class TimestepContainer extends PureComponent {
  timelineParams = null;

  static propTypes = {
    defaultStyles: PropTypes.shape({}),
    activeLayer: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
  };

  static defaultProps = { defaultStyles: {}, activeLayer: {} };

  constructor(props) {
    super(props);
    const { activeLayer } = props;
    const { timelineParams } = activeLayer;

    this.timelineParams = timelineParams;
  }

  componentDidUpdate(prevProps) {
    const { activeLayer } = this.props;
    const { activeLayer: prevActiveLayer } = prevProps;

    const { timelineParams } = activeLayer;
    const { timelineParams: prevTimelineParams } = prevActiveLayer;

    // Should we use timelineParams directly from params instead of doing this? I think so
    if (!isEqual(timelineParams, prevTimelineParams)) {
      this.timelineParams = timelineParams;
      this.forceUpdate();
    }
  }

  getTrackStyle = () => {
    const { minDate, interval, trackStyle } = this.timelineParams;

    if (Array.isArray(trackStyle)) {
      return trackStyle.map((t) => {
        const { gradient } = t || {};

        if (!gradient) return t;

        const styles = {
          ...t,
          gradient: gradientConverter(gradient, minDate, interval),
        };

        return styles;
      });
    }

    const { gradient } = trackStyle || {};

    if (gradient) {
      return {
        ...trackStyle,
        gradient: gradientConverter(gradient, minDate, interval),
      };
    }

    return trackStyle;
  };

  handleOnAfterChange = (range) => {
    const { activeLayer, handleChange } = this.props;

    const formattedRange = this.formatRange([range[0], range[1], range[2]]);
    handleChange(formattedRange, activeLayer);
  };

  formatRange = (range) => {
    const { minDate, interval } = this.timelineParams;
    return range.map((r, i) => {
      // if date is not the start date we should select the end of the interval
      const toEnd = i !== 0;

      return formatDate(addToDate(minDate, r, interval, toEnd));
    });
  };

  formatValue = (value) => {
    const { minDate, dateFormat, interval } = this.timelineParams;

    return formatDatePretty(addToDate(minDate, value, interval), dateFormat);
  };

  setMarks = ({ marks, customTimelineMarks }) => {
    if (customTimelineMarks?.length > 0) {
      return customTimelineMarks.reduce((acc, item) => {
        acc[item.datasetDate] = item.label;
        return acc;
      }, {});
    }

    return marks || getTicks(this.timelineParams);
  };

  render() {
    if (!this.timelineParams) return null;
    const { defaultStyles } = this.props;
    const {
      maxDate,
      maxAbsoluteDate,
      minDate,
      minAbsoluteDate,
      interval,
      startDate,
      endDate,
      trimEndDate,
      canPlay,
    } = this.timelineParams;

    const startIndex = dateDiff(startDate, minDate, interval);
    const endIndex = dateDiff(endDate, minDate, interval);
    const trimIndex = dateDiff(trimEndDate, minDate, interval);

    return (
      <div
        className={classnames({
          'c-legend-timestep': true,
          '-can-play': canPlay,
        })}
      >
        <Timestep
          {...this.props}
          {...defaultStyles}
          {...this.timelineParams}
          trackStyle={this.getTrackStyle()}
          min={0}
          minAbs={dateDiff(
            minAbsoluteDate || minDate,
            minDate,
            interval,
            false
          )}
          max={dateDiff(maxDate, minDate, interval)}
          maxAbs={dateDiff(maxAbsoluteDate || maxDate, minDate, interval)}
          start={startIndex}
          end={endIndex}
          trim={trimIndex}
          marks={this.setMarks(this.timelineParams)}
          formatValue={this.formatValue}
          handleOnAfterChange={this.handleOnAfterChange}
        />
      </div>
    );
  }
}

export default TimestepContainer;
