import React from 'react';
import PropTypes from 'prop-types';

const WidgetHeader = (props) => {
  const { title } = props;

  return (
    <div className="c-widget-header">
      <div className="c-widget-header__title">{title}</div>
      <ul className="c-widget-header__options">
        <li className="c-widget-header__option-button">VIEW ON MAP</li>
        <li className="c-widget-header__option-circle c-widget-header__option-circle--green"></li>
        <li className="c-widget-header__option-circle c-widget-header__option-circle--green"></li>
        <li className="c-widget-header__option-circle c-widget-header__option-circle--white"></li>
      </ul>
    </div>
  );
};

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default WidgetHeader;
