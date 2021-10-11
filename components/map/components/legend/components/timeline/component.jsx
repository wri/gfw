import PropTypes from 'prop-types';
import moment from 'moment';
import { LegendItemTimeStep } from 'vizzuality-components';

import { trackEvent } from 'utils/analytics';

import Datepicker from 'components/ui/datepicker';

import './styles.scss';

const Timeline = (props) => {
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
    maxRange,
    startDateAbsolute,
    endDateAbsolute,
    description,
  } = props;

  return (
    <div className={`c-timeline ${className || ''}`}>
      {description && <p className="description">{description}</p>}
      {dateFormat === 'YYYY-MM-DD' && interval !== 'years' && (
        <div className="date-pickers">
          From
          <Datepicker
            selected={new Date(maxRange ? startDateAbsolute : startDate)}
            onChange={(date) => handleOnDateChange(moment(date), 0, !!maxRange)}
            minDate={new Date(minDate)}
            maxDate={maxRange ? new Date(maxDate) : new Date(trimEndDate)}
            isOutsideRange={(d) =>
              d.isAfter(moment(maxRange ? maxDate : trimEndDate)) ||
              d.isBefore(moment(minDate))}
          />
          to
          <Datepicker
            selected={new Date(maxRange ? endDateAbsolute : trimEndDate)}
            onChange={(date) => handleOnDateChange(moment(date), 2, !!maxRange)}
            minDate={maxRange ? new Date(minDate) : new Date(startDate)}
            maxDate={new Date(maxDate)}
            isOutsideRange={(d) =>
              d.isAfter(moment(maxRange ? maxDate : trimEndDate)) ||
              d.isBefore(moment(minDate))}
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
              ...(maxRange && {
                minDate: activeLayer.timelineParams.startDateAbsolute,
                maxDate: activeLayer.timelineParams.endDateAbsolute,
              }),
              ...(!maxRange && {
                marks: props.marks,
              }),
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
              trackEvent({
                category: 'Map legend',
                action: 'User animates data',
                label: activeLayer.id,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

Timeline.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  isPlaying: PropTypes.bool,
  handleTogglePlay: PropTypes.func,
  dynamic: PropTypes.bool,
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
  startDateAbsolute: PropTypes.string,
  endDateAbsolute: PropTypes.string,
  handleOnDateChange: PropTypes.func,
  dateFormat: PropTypes.string,
  interval: PropTypes.string,
  activeLayer: PropTypes.object,
  maxRange: PropTypes.number,
};

export default Timeline;
