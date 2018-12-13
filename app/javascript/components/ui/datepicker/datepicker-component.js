import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import cx from 'classnames';
import range from 'lodash/range';
import { Portal } from 'react-portal';

import moment from 'moment';
import Dropdown from 'components/ui/dropdown';

import Input from 'components/ui/input';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import arrowIcon from 'assets/icons/arrow-down.svg';
import './datepicker-styles.scss';
// import './themes/datepicker-small.scss'; //TODO: recent imagery styles

class Datepicker extends PureComponent {
  state = {
    position: {}
  };

  componentDidMount() {
    this.setPosition();
  }

  setPosition = () => {
    this.setState({ position: this.ref.getBoundingClientRect() });
  };

  renderCalendarContainer = ({ className, children }) => {
    const { position } = this.state;

    return (
      <Portal>
        <div
          style={{
            transform: `translate(${position.x}px, calc(${
              position.y
            }px + 1.75rem))`
          }}
        >
          <CalendarContainer className={className}>
            {children}
          </CalendarContainer>
        </div>
      </Portal>
    );
  };

  render() {
    const { className, handleOnDateChange, settings, theme } = this.props;
    const momentDate = this.props.date;
    const { minDate, maxDate } = settings;
    const { position } = this.state;
    const maxYear = moment(maxDate).year();
    const minYear = moment(minDate).year();

    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
        className={cx('c-datepicker', theme, className)}
      >
        {position && (
          <ReactDatePicker
            selected={momentDate.toDate()}
            onSelect={d => {
              handleOnDateChange(moment(d), 0);
            }}
            minDate={new Date(minDate)}
            maxDate={new Date(maxDate)}
            dateFormat="dd MMM yyyy"
            className="datepicker-input"
            onFocus={this.setPosition}
            calendarContainer={this.renderCalendarContainer}
            customInput={<Input />}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => (
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
                    .map((m, i) => ({ value: i, label: m }))}
                  onChange={changeMonth}
                  value={date.getMonth()}
                  native
                />
                <Dropdown
                  className="c-date-dropdown"
                  theme="theme-dropdown-native theme-dropdown-native-button"
                  options={range(
                    parseInt(minYear, 10),
                    parseInt(maxYear, 10) + 1
                  ).map(i => ({ value: i, label: i }))}
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
            )}
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
  settings: PropTypes.object
};

export default Datepicker;
