import React from 'react';
import PropTypes from 'prop-types';

const AboutModalWorld= (props) => {
  return (
    <div className="c-about-modal-world">
      <div className="c-about-modal-world__image"></div>
      <div className="c-about-modal-world__text">
        <svg className="icon-close"><use xlink:href="#icon-close"></use></svg>
        <div>
          <h2 className="text -title -color-2">Democratic Republic of Congo's Ministry of Environment and Sustainable Development</h2>
          <p className="text -title-xs -color-2">Democratic Republic of Congo's Ministry of Environment and Sustainable Development is using GFW data to calculate deforestation taxes due by companies, clearing forests for mining, logging and agriculture.</p>
        </div>
        <div className="contain-buttons">
          <a href="#" className="c-regular-button -green ">LEARN MORE</a>
          <a href="#" className="text -color-2 button-round">$</a>
        </div>
      </div>
    </div>

  );
};

export default AboutModalWorld;
