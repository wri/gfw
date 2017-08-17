import React from 'react';
import PropTypes from 'prop-types';

const AboutHow = (props) => {
  return (
    <div className="c-about-how">
      <div className="row">
        <div className="small-12 large-6 columns">
          <div className="c-about-how__content">
            <div className="c-about-how__title text -title-xs -color-3">HOW DOES GFW CREATE CHANGE?</div>
            <div className="c-about-how__subtitle text -paragraph -color-2"><span></span>Radical Transparency</div>
            <div className="c-about-how__summary text -paragraph -color-2">Global Forest Watch aims to safeguard forests by creating radical transparency around deforestation and forest degradation globally.<br/><br/>By making the best available data on forests available to anyone, GFW empowers governments and companies to make sustainable and equitable decisions about forest management and land use, while also equipping members of civil society such as NGOs and journalists with the information they need to play an active role in protecting forests.</div>
            <div className="c-about-how__text-list text -paragraph -color-2"><span></span>Feedback Loop</div>
            <div className="c-about-how__text-list text -paragraph -color-2"><span></span>Connecting people who care</div>
          </div>
        </div>
        <div className="c-about-how__cover">
          <div className="c-about-how__cover-credits">Bangkukuk, Nicaragua</div>
        </div>
      </div>
    </div>

  );
};

export default AboutHow;
