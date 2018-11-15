import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import cx from 'classnames';

import moment from 'moment';

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
          renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div>
                <select
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
                </select>
              </div>
              <div>
                <select
                  value={month.year()}
                  onChange={e => {
                    onYearSelect(month, e.target.value);
                  }}
                >
                  <option value={moment().year() - 1}>Last year</option>
                  <option value={moment().year()}>{moment().year()}</option>
                  <option value={moment().year() + 1}>Next year</option>
                </select>
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
