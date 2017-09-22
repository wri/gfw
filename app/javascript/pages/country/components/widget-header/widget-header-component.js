import React from 'react';
import PropTypes from 'prop-types';

const WidgetHeader = (props) => {
  const { title, noMap } = props;

  return (
    <div className="c-widget-header">
      <div className="c-widget-header__title">{title}</div>
      <ul className="c-widget-header__options">
        { noMap === null || !noMap ? <li className="c-widget-header__option-button">VIEW ON MAP</li> : null }
        <li className="c-widget-header__option-circle c-widget-header__option-circle--green"></li>
        <li className="c-widget-header__option-circle c-widget-header__option-circle--green"></li>
        <li className="c-widget-header__option-circle c-widget-header__option-circle--white"></li>
      </ul>
    </div>
  );
};

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  noMap: PropTypes.bool
};

export default WidgetHeader;
