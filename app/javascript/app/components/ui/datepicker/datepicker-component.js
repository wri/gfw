import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import cx from 'classnames';

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
