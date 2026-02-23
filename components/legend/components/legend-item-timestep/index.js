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
import {
  buildSegments,
  mapIndexToSegment,
  getSegmentByCenterIndex,
  yearToIndex,
} from './segments';

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
    this.segments = buildSegments(timelineParams);
  }

  componentDidUpdate(prevProps) {
    const { activeLayer } = this.props;
    const { activeLayer: prevActiveLayer } = prevProps;

    const { timelineParams } = activeLayer;
    const { timelineParams: prevTimelineParams } = prevActiveLayer;

    // Should we use timelineParams directly from params instead of doing this? I think so
    if (!isEqual(timelineParams, prevTimelineParams)) {
      this.timelineParams = timelineParams;
      this.segments = buildSegments(timelineParams);
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
    const [startOriginal, endOriginal, trimOriginal] = range;
    let end = endOriginal;
    let trim = trimOriginal;

    // For segmented timelines, snap the selection to the nearest segment center
    if (this.segments && this.segments.length) {
      const hit = mapIndexToSegment(this.segments, end);
      if (hit && hit.snappedIndex != null) {
        end = hit.snappedIndex;
        trim = hit.snappedIndex;
      }
    }

    const formattedRange = this.formatRange([startOriginal, end, trim]);
    handleChange(formattedRange, activeLayer);
  };

  formatRange = (range) => {
    const { interval } = this.timelineParams;
    const minDateBase = this.getMinDateBase();

    return range.map((r, i) => {
      const toEnd = i !== 0;

      // When this position is a segment center, use the segment's datasetDate
      // so the map fetches the correct dataset reference (e.g. 1976-2002 -> 2003)
      if (this.segments && this.segments.length) {
        const segment = getSegmentByCenterIndex(this.segments, r);
        if (segment?.datasetDate != null) {
          const dataIndex = yearToIndex(
            segment.datasetDate,
            minDateBase,
            interval
          );
          if (dataIndex != null) {
            return formatDate(
              addToDate(minDateBase, dataIndex, interval, toEnd)
            );
          }
        }
      }

      return formatDate(addToDate(minDateBase, r, interval, toEnd));
    });
  };

  // Same minDate base used for marks (yearToIndex) so tooltip year matches mark position
  getMinDateBase = () => {
    const { minDate } = this.timelineParams || {};
    if (typeof minDate === 'number' && minDate >= 1000) {
      return `${minDate}-01-01`;
    }
    return minDate;
  };

  formatValue = (value) => {
    const { dateFormat, interval } = this.timelineParams;
    const minDateBase = this.getMinDateBase();
    const rawIndex =
      typeof value === 'number' && !Number.isNaN(value) ? value : Number(value);
    const index = Number.isNaN(rawIndex) ? 0 : Math.round(rawIndex);

    // Only use segment label when the index is inside a grouped range
    if (this.segments && this.segments.length) {
      const hit = mapIndexToSegment(this.segments, index);
      if (hit && hit.segment) {
        return hit.segment.label;
      }
    }

    // Linear zone: show year/date for this index so it matches the mark at this position
    return formatDatePretty(
      addToDate(minDateBase, index, interval),
      dateFormat
    );
  };

  setMarks = ({ marks, customTimelineMarks, minDate, interval }) => {
    // customTimelineMarks is used only to set the marks (labels) on the slider
    if (customTimelineMarks?.length > 0) {
      let minDateBase = minDate;
      if (minDate != null && typeof minDate === 'number' && minDate >= 1000) {
        minDateBase = `${minDate}-01-01`;
      }
      return customTimelineMarks.reduce((acc, item) => {
        // datasetDate as calendar year -> same scale as formatValue (index from minDateBase)
        const key =
          typeof item.datasetDate === 'number' &&
          item.datasetDate >= 1000 &&
          minDateBase != null
            ? yearToIndex(item.datasetDate, minDateBase, interval)
            : item.datasetDate;
        if (key != null) acc[key] = item.label;
        return acc;
      }, {});
    }

    if (
      customTimelineMarks &&
      typeof customTimelineMarks === 'object' &&
      !Array.isArray(customTimelineMarks)
    ) {
      return customTimelineMarks;
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
