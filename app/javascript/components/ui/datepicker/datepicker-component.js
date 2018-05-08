import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './datepicker-styles.scss';

class Datepicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  render() {
    const { className, date, handleOnDateChange, settings } = this.props;
    return (
      <div className={`c-datepicker ${className || ''}`}>
        <SingleDatePicker
          date={date}
          onDateChange={d => {
            handleOnDateChange(d);
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
  date: PropTypes.object,
  handleOnDateChange: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default Datepicker;
