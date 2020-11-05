import { getMonth, getYear } from 'date-fns';
import range from 'lodash/range';
import PropTypes from 'prop-types';

import { Button } from 'gfw-components';

import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';

import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';

import './styles.scss';

const DatepickerHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const years = range(1990, getYear(new Date()) + 1, 1);
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
    'December',
  ];

  return (
    <div className="c-datepicker-header">
      <Button
        className="btn-select-left"
        size="small"
        round
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <Icon icon={arrowDownIcon} className="arrow-select-left" />
      </Button>
      <Dropdown
        className="selector-month"
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={months.map((m) => ({ label: m, value: m }))}
        value={months[getMonth(date)]}
        onChange={(value) => changeMonth(months.indexOf(value))}
        native
      />
      <Dropdown
        className="selector-year"
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={years.map((m) => ({ label: m, value: m }))}
        value={getYear(date)}
        onChange={changeYear}
        native
      />
      <Button
        className="btn-select-right"
        size="small"
        round
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <Icon icon={arrowDownIcon} className="arrow-select-right" />
      </Button>
    </div>
  );
};

DatepickerHeader.propTypes = {
  date: PropTypes.object,
  changeYear: PropTypes.func,
  changeMonth: PropTypes.func,
  decreaseMonth: PropTypes.func,
  increaseMonth: PropTypes.func,
  prevMonthButtonDisabled: PropTypes.bool,
  nextMonthButtonDisabled: PropTypes.bool,
};

export default DatepickerHeader;
