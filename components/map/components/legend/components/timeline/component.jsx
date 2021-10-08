import PropTypes from 'prop-types';
import moment from 'moment';
import { LegendItemTimeStep } from 'vizzuality-components';

import { trackEvent } from 'utils/analytics';

import Datepicker from 'components/ui/datepicker';

import './styles.scss';

const Timeline = (props) => {
  const {
    className,
    handleOnDateChange,
    dateFormat,
    interval,
    activeLayer,
    maxRange,
    description,
    minDate,
    maxDate,
    from,
    to,
    dynamic,
  } = props;

  return (
    <div className={`c-timeline ${className || ''}`}>
      {description && <p className="description">{description}</p>}
      {dateFormat === 'YYYY-MM-DD' && interval !== 'years' && (
        <div className="date-pickers">
          From
          {from && (
            <Datepicker
              selected={from.selected}
              onChange={(date) =>
                handleOnDateChange(moment(date), 0, !!maxRange)}
              minDate={new Date(minDate)}
              maxDate={new Date(maxDate)}
              isOutsideRange={(d) =>
                d.isAfter(moment(from.max)) || d.isBefore(moment(from.min))}
            />
          )}
          to
          {to && (
            <Datepicker
              selected={to.selected}
              onChange={(date) =>
                handleOnDateChange(moment(date), 2, !!maxRange)}
              minDate={new Date(minDate)}
              maxDate={new Date(maxDate)}
              isOutsideRange={(d) => d.isAfter(to.max) || d.isBefore(to.min)}
            />
          )}
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
                minDate: from?.min
                  ? from.min
                  : activeLayer.timelineParams.startDate,
                maxDate: to?.max ? to.max : activeLayer.timelineParams.endDate,
              }),
              ...(dynamic &&
                from.selected &&
                to.selected && {
                  startDate: from.selected,
                  endDate: to.selected,
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
  from: PropTypes.object,
  to: PropTypes.object,
  dynamic: PropTypes.bool,
};

export default Timeline;
