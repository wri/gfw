import { getMonth, getYear, eachMonthOfInterval, format } from 'date-fns';
import range from 'lodash/range';
import PropTypes from 'prop-types';

import { Button } from '@worldresources/gfw-components';

import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';

import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';

const DatepickerHeader = ({
  date,
  minDate,
  maxDate,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const years = range(getYear(minDate), getYear(maxDate) + 1, 1);

  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const currentYear = getYear(date);

  const startDate =
    currentYear === minYear ? minDate : new Date(`${currentYear}/01/01`);
  const endDate =
    currentYear === maxYear ? maxDate : new Date(`${currentYear}/12/31`);

  const monthsInYear = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  });

  const months = monthsInYear.map((m) => ({
    label: format(m, 'MMMM'),
    value: getMonth(m),
  }));

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
        options={months}
        value={getMonth(date)}
        onChange={changeMonth}
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
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

export default DatepickerHeader;
