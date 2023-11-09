import { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import OutsideClickHandler from 'react-outside-click-handler';
import moment from 'moment';
import Spinner from 'components/spinner';

import ReactDatePicker, {
  registerLocale,
  CalendarContainer,
} from 'react-datepicker';

import es from 'date-fns/locale/es';
import fr from 'date-fns/locale/fr';
import zh from 'date-fns/locale/zh-CN';
import ptBR from 'date-fns/locale/pt-BR';
import id from 'date-fns/locale/id';

import DatepickerHeader from './datepicker-header';

registerLocale('fr', fr);
registerLocale('es_MX', es);
registerLocale('zh', zh);
registerLocale('pt_BR', ptBR);
registerLocale('id', id);

const Datepicker = ({
  lang,
  loading = false,
  selected,
  minDate,
  maxDate,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const inputEl = useRef();

  const CustomInput = forwardRef(({ value }, ref) => (
    <button
      ref={ref}
      className="datepicker-input"
      onClick={() => setOpen(!open)}
    >
      {value}
    </button>
  ));

  const LoadingInput = () => (
    <button className="datepicker-input loading">
      <Spinner
        position="relative"
        style={{
          box: { width: 12, height: 12 },
        }}
      />
    </button>
  );

  const CalendarWrapper = ({ className, children }) => (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <CalendarContainer className={className}>{children}</CalendarContainer>
    </OutsideClickHandler>
  );

  const PortalContainer = ({ children }) => (
    <Portal>
      <div className="c-datepicker-portal">{children}</div>
    </Portal>
  );

  let selectedUTC = new Date(
    selected.getTime() + selected.getTimezoneOffset() * 60000
  );
  const minDateUTC = new Date(
    minDate.getTime() + minDate.getTimezoneOffset() * 60000
  );
  const maxDateUTC = new Date(
    maxDate.getTime() + maxDate.getTimezoneOffset() * 60000
  );

  const selectedMomentDate = moment(selectedUTC);
  const minMomentDate = moment(minDateUTC);
  const maxMomentDate = moment(maxDateUTC);

  const diffFromStart = minMomentDate.diff(selectedMomentDate, 'days');
  const diffFromEnd = maxMomentDate.diff(selectedMomentDate, 'days');

  if (diffFromStart > 0) {
    // selectedDate is before minDate, hence selectedDate must be minDate minimum
    selectedUTC = minDateUTC;
  }

  if (diffFromEnd < 0) {
    // selectedDate is after maxDate, hence selectedDate must be maxDate maximum
    selectedUTC = maxDateUTC;
  }

  return (
    <div className="c-datepicker notranslate" ref={inputEl}>
      {loading ? (
        <LoadingInput />
      ) : (
        <ReactDatePicker
          open={open}
          dateFormat="dd MMM yyyy"
          onSelect={() => setOpen(false)}
          customInput={<CustomInput />}
          calendarClassName="datepicker-calendar"
          renderCustomHeader={(headerProps) => (
            <DatepickerHeader
              {...headerProps}
              minDate={minDateUTC}
              maxDate={maxDateUTC}
            />
          )}
          popperContainer={PortalContainer}
          locale={lang || 'en'}
          calendarContainer={CalendarWrapper}
          {...props}
          selected={selectedUTC}
          minDate={minDateUTC}
          maxDate={maxDateUTC}
        />
      )}
    </div>
  );
};

Datepicker.propTypes = {
  lang: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  selected: PropTypes.object,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  loading: PropTypes.bool,
};

export default Datepicker;
