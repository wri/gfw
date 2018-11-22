import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import cx from 'classnames';
import range from 'lodash/range';

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
    const { minDate, maxDate } = settings;
    const [maxYear] = maxDate.split('-');
    const [minYear] = minDate.split('-');
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
                <Dropdown
                  className="c-date-dropdown"
                  theme="theme-dropdown-button theme-dropdown-button-small -short"
                  noItemsFound="No months found"
                  options={moment
                    .months()
                    .map((m, i) => ({ value: i, label: m }))}
                  onChange={e => {
                    onMonthSelect(month, e.value);
                  }}
                  value={month.month()}
                />
              </div>
              <div>
                <Dropdown
                  className="c-date-dropdown"
                  theme="theme-dropdown-button theme-dropdown-button-small -short"
                  placeholder={month.year().toString()}
                  noItemsFound="No years found"
                  noSelectedValue={month.year().toString()}
                  options={range(Number(minYear), Number(maxYear) + 1).map(
                    i => ({ value: i, label: i })
                  )}
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
