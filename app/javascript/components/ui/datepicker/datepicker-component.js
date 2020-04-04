import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import cx from 'classnames';
import range from 'lodash/range';
import { Portal } from 'react-portal';
import moment from 'moment';

import { Media } from 'utils/responsive';

import Dropdown from 'components/ui/dropdown';
import Input from 'components/ui/input';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import './datepicker-styles.scss';

class Datepicker extends PureComponent {
  state = {
    position: {},
  };

  componentDidMount() {
    this.setPosition();
  }

  setPosition = () => {
    const coords = this.ref.getBoundingClientRect();

    if (coords.x + 290 > window.innerWidth) {
      coords.x -= 195;
    }
    this.setState({ position: coords });
  };

  renderCalendarHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const { settings } = this.props;
    const { minDate, maxDate } = settings;
    const maxMoment = moment(maxDate);
    const minMoment = moment(minDate);

    return (
      <div className="c-datepicker-header">
        <Button
          theme="theme-button-small square"
          className="menu-link prev-month"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          <Icon icon={arrowIcon} />
        </Button>
        <Dropdown
          className="c-date-dropdown"
          theme="theme-dropdown-native theme-dropdown-native-button"
          options={moment
            .months()
            .map((m, i) => ({ value: i, label: m }))
            .filter((m, i) => {
              if (date.getFullYear() === minMoment.year()) {
                return i >= minMoment.month();
              }
              if (date.getFullYear() === maxMoment.year()) {
                return i <= maxMoment.month();
              }
              return true;
            })}
          onChange={changeMonth}
          value={date.getMonth()}
          native
        />
        <Dropdown
          className="c-date-dropdown"
          theme="theme-dropdown-native theme-dropdown-native-button"
          options={range(
            parseInt(minMoment.year(), 10),
            parseInt(maxMoment.year(), 10) + 1
          ).map((i) => ({ value: i, label: i }))}
          onChange={changeYear}
          value={date.getFullYear()}
          native
        />
        <Button
          theme="theme-button-small square"
          className="menu-link next-month"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          <Icon icon={arrowIcon} />
        </Button>
      </div>
    );
  };

  renderCalendarContainer = ({ className, children }) => {
    const { position } = this.state;

    return (
      <Portal>
        <Media greaterThanOrEqual="md">
          <div
            className="react-datepicker-portal"
            style={{
              transform: `translate(${position.x}px, calc(${position.y}px + 1.75rem))`,
            }}
          >
            <CalendarContainer className={className}>
              {children}
            </CalendarContainer>
          </div>
        </Media>
        <Media lessThan="md">
          <div
            className="react-datepicker-portal react-datepicker-modal"
            style={{
              transform: `translate(${position.x}px, calc(${position.y}px + 1.75rem))`,
            }}
          >
            <CalendarContainer className={className}>
              {children}
            </CalendarContainer>
            <div
              className="clickable-modal"
              style={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
              }}
              role="button"
              tabIndex={-1}
              aria-label="open modal"
            />
          </div>
        </Media>
      </Portal>
    );
  };

  render() {
    const { className, handleOnDateChange, settings, theme } = this.props;
    const momentDate = this.props.date;
    const { minDate, maxDate } = settings;
    const { position } = this.state;

    return (
      <div
        ref={(ref) => {
          this.ref = ref;
        }}
        className={cx('c-datepicker', theme, className)}
      >
        {position && (
          <ReactDatePicker
            selected={momentDate.toDate()}
            onSelect={(d) => {
              handleOnDateChange(moment(d), 0);
            }}
            minDate={new Date(minDate)}
            maxDate={new Date(maxDate)}
            dateFormat="dd MMM yyyy"
            className="datepicker-input"
            onFocus={this.setPosition}
            calendarContainer={this.renderCalendarContainer}
            renderCustomHeader={this.renderCalendarHeader}
            customInput={<Input />}
          />
        )}
      </div>
    );
  }
}

Datepicker.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.object,
  handleOnDateChange: PropTypes.func.isRequired,
  settings: PropTypes.object,
};

export default Datepicker;
