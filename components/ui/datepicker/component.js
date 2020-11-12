import { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import OutsideClickHandler from 'react-outside-click-handler';

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

import './styles.scss';

registerLocale('fr', fr);
registerLocale('es_MX', es);
registerLocale('zh', zh);
registerLocale('pt_BR', ptBR);
registerLocale('id', id);

const Datepicker = ({ lang, ...props }) => {
  const [startDate, setStartDate] = useState(new Date());
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

  return (
    <div className="c-datepicker notranslate" ref={inputEl}>
      <ReactDatePicker
        open={open}
        dateFormat="dd MMM yyyy"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        onSelect={() => setOpen(false)}
        customInput={<CustomInput />}
        calendarClassName="datepicker-calendar"
        renderCustomHeader={(headerProps) => (
          <DatepickerHeader
            {...headerProps}
            minDate={props?.minDate}
            maxDate={props?.maxDate}
          />
        )}
        popperContainer={PortalContainer}
        locale={lang || 'en'}
        calendarContainer={CalendarWrapper}
        {...props}
      />
    </div>
  );
};

Datepicker.propTypes = {
  lang: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

export default Datepicker;
