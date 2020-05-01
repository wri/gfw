import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { LegendItemTimeStep } from 'vizzuality-components';

import { track } from 'app/analytics';

import Datepicker from 'components/ui/datepicker';

import './styles.scss';

export const Timeline = (props) => {
  const {
    className,
    minDate,
    maxDate,
    startDate,
    trimEndDate,
    handleOnDateChange,
    dateFormat,
    interval,
    activeLayer,
    marks,
  } = props;

  return (
    <div className={`c-timeline ${className || ''}`}>
      {dateFormat === 'YYYY-MM-DD' && interval !== 'years' && (
        <div className="date-pickers">
          From
          <Datepicker
            className="datepicker start-date"
            theme="datepicker-small"
            date={moment(startDate)}
            handleOnDateChange={(date) => handleOnDateChange(date, 0)}
            settings={{
              numberOfMonths: 1,
              minDate,
              maxDate: trimEndDate,
              isOutsideRange: (d) =>
                d.isAfter(moment(trimEndDate)) || d.isBefore(moment(minDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
          />
          to
          <Datepicker
            className="datepicker"
            theme="datepicker-small"
            date={moment(trimEndDate)}
            handleOnDateChange={(date) => handleOnDateChange(date, 2)}
            settings={{
              numberOfMonths: 1,
              minDate: startDate,
              maxDate,
              isOutsideRange: (d) =>
                d.isAfter(moment(maxDate)) || d.isBefore(moment(startDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
          />
        </div>
      )}
      <div className="range-slider">
        <LegendItemTimeStep
          {...props}
          activeLayer={{
            ...activeLayer,
            timelineParams: {
              ...activeLayer.timelineParams,
              marks,
              handleStyle: {
                backgroundColor: 'white',
                borderRadius: '2px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
                border: '0px',
                zIndex: 2,
              },
            },
          }}
          handleOnPlay={(p) => {
            if (p) {
              track('legendTimelinePlay', { label: activeLayer.id });
            }
          }}
        />
      </div>
    </div>
  );
};

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
  interval: PropTypes.string,
  activeLayer: PropTypes.object,
};

export default Timeline;
