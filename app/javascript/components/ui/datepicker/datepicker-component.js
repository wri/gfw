import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import cx from 'classnames';

import moment from 'moment';
import Dropdown from 'components/ui/dropdown';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './datepicker-styles.scss';
import './themes/datepicker-small.scss';

class Datepicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  render() {
    const { className, date, handleOnDateChange, settings, theme } = this.props;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return (
      <div className={cx('c-datepicker', theme, className)}>
        <SingleDatePicker
          date={date}
          onDateChange={d => {
            handleOnDateChange(d, 0);
          }}
          focused={this.state.focused}
          onFocusChange={({ focused }) => this.setState({ focused })}
          // renderCaption={(e) => console.log(e)}
          navPrev={<div />}
          navNext={<div />}
          renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div>
                {/* <select
                  value={month.month()}
                  onChange={e => {
                    onMonthSelect(month, e.target.value);
                  }}
                >
                  {moment
                    .months()
                    .map((label, value) => (
                      <option value={value}>{label}</option>
                    ))}
                </select> */}
                <Dropdown
                  className="c-date-dropdown"
                  theme="theme-dropdown-button theme-dropdown-button-small -short"
                  placeholder={months[month.month()]}
                  noItemsFound="No months found"
                  noSelectedValue={month.month().toString()}
                  options={moment.months().map((m, i) => ({ value: i, label: m }))}
                  onChange={e => {
                    onMonthSelect(month, e.value);
                  }}
                />
              </div>
              <div>
                {/* <select
                  value={month.year()}
                  onChange={e => {
                    onYearSelect(month, e.target.value);
                  }}
                >
                  <option value={moment().year() - 1}>Last year</option>
                  <option value={moment().year()}>{moment().year()}</option>
                  <option value={moment().year() + 1}>Next year</option>
                </select> */}
                <Dropdown
                  className="c-date-dropdown"
                  theme="theme-dropdown-button theme-dropdown-button-small -short"
                  placeholder={month.year().toString()}
                  noItemsFound="No years found"
                  noSelectedValue={month.year().toString()}
                  options={
                    // [...Array(3).keys()]
                    // .map(n => ({value:moment().year()-n, label: moment().year()-n}))
                    // .reverse()
                    []
                  } // temporal
                  onChange={e => {
                    onYearSelect(month, e.value);
                  }}
                />
              </div>
            </div>
          )}
          {...settings}
        />
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
