import React from 'react';
import PropTypes from 'prop-types';

const AboutCover = (props) => {
  const {title, description} = props
  return (
    <div className="c-about-cover">
      <div className="row">
        <div className="small-12 columns">
          <div className="c-about-cover-texts">
            <h1 className="text -title-biggest -color-1">{title}</h1>
            <p className="c-about-cover__description text -paragraph -color-1">{description}</p>
            <div className="c-about-cover__play-button">
              <div className="c-play-button">
                <svg className="icon"><use xlinkHref="#icon-play"></use></svg>
              </div>
              <span className="text -paragraph-4 -italic -color-7">GFW in 2’</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCover;
