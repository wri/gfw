import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Desktop, Mobile } from 'gfw-components';

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

const Datepicker = ({ lang, withPortal, ...props }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [position, setPosition] = useState(null);
  const inputEl = useRef();

  const getPosition = () => {
    const coords = inputEl?.current?.getBoundingClientRect();

    if (coords && coords.x + 290 > window.innerWidth) {
      coords.x -= 195;
    }

    setPosition(coords);
  };

  useEffect(() => {
    getPosition();
  }, []);

  const CustomInput = ({ value, onClick }) => (
    <button className="datepicker-input" onClick={onClick}>
      {value}
    </button>
  );

  const calendarContainer = ({ className, children }) => (
    <>
      <Desktop>
        <div
          className="c-datepicker-popper"
          style={{
            transform: `translate(${position?.x}px, calc(${position?.y}px + 1.75rem))`,
          }}
        >
          <div className="react-datepicker__triangle" />
          <CalendarContainer className={className}>
            {children}
          </CalendarContainer>
        </div>
      </Desktop>
      <Mobile>
        <div className="c-datepicker-popper">
          <CalendarContainer className={className}>
            {children}
          </CalendarContainer>
        </div>
      </Mobile>
    </>
  );

  return (
    <div className="c-datepicker notranslate" ref={inputEl}>
      <ReactDatePicker
        dateFormat="dd MMM yyyy"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        onCalendarOpen={getPosition}
        customInput={<CustomInput />}
        popperClassName="c-datepicker-popper"
        calendarClassName="datepicker-calendar"
        renderCustomHeader={(headerProps) => (
          <DatepickerHeader
            {...headerProps}
            minDate={props?.minDate}
            maxDate={props?.maxDate}
          />
        )}
        locale={lang || 'en'}
        {...(withPortal && {
          calendarContainer,
          withPortal: true,
        })}
        {...props}
      />
    </div>
  );
};

Datepicker.propTypes = {
  lang: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  withPortal: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

export default Datepicker;
