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
    const maxYear = moment(maxDate).year();
    const minYear = moment(minDate).year();
    return (
      <div className={cx('c-datepicker', theme, className)}>
        <SingleDatePicker
          date={date}
          onDateChange={d => {
            handleOnDateChange(d, 0);
          }}
          focused={this.state.focused}
          onFocusChange={({ focused }) => this.setState({ focused })}
          navPrev={
            <div className="c-navigation-button c-button-left">
              <svg
                id="c-arrow-left"
                width="7px"
                height="10px"
                viewBox="0 0 7 10"
                version="1.1"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-812.000000, -72.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g
                      id="scroll"
                      transform="translate(816.000000, 77.000000) scale(-1, 1) rotate(-180.000000) translate(-816.000000, -77.000000) translate(806.000000, 67.000000)"
                    >
                      <polygon
                        id="arrow"
                        points="12.7071068 13.2928932 11.2928932 14.7071068 6.58578644 10 11.2928932 5.29289322 12.7071068 6.70710678 9.41421356 10"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          }
          navNext={
            <div className="c-navigation-button c-button-right">
              <svg
                id="c-arrow-left"
                width="7px"
                height="10px"
                viewBox="0 0 7 10"
                version="1.1"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-812.000000, -72.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g
                      id="scroll"
                      transform="translate(816.000000, 77.000000) scale(-1, 1) rotate(-180.000000) translate(-816.000000, -77.000000) translate(806.000000, 67.000000)"
                    >
                      <polygon
                        id="arrow"
                        points="12.7071068 13.2928932 11.2928932 14.7071068 6.58578644 10 11.2928932 5.29289322 12.7071068 6.70710678 9.41421356 10"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          }
          renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
            <div className="c-date-month-selector">
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
                  noItemsFound="No years found"
                  noSelectedValue={month.year().toString()}
                  options={range(
                    parseInt(minYear, 10),
                    parseInt(maxYear, 10) + 1
                  ).map(i => ({ value: i, label: i }))}
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
