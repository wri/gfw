import React from 'react';
import PropTypes from 'prop-types';

const Footer = props => (
  <div className="c-footer">
    <div className="row">
      <div className="small-12 medium-6 large-3 columns c-footer__alert">
        <span>Alerts and Data Bulletin</span>
        <a href="#" className="c-regular-button -green">
            SUSCRIBE
        </a>
      </div>
      <div className="small-12 medium-6 large-3 columns c-footer__alert">
        <span>Alerts and Data Bulletin</span>
        <a href="#" className="c-regular-button -green">
            BROWSE
        </a>
      </div>
      <div className="small-12 medium-6 large-3 columns c-footer__alert">
        <span>Alerts and Data Bulletin</span>
        <a href="#" className="c-regular-button -green">
            DOWNLOAD
        </a>
      </div>
      <div className="small-12 medium-6 large-3 columns c-footer__alert">
        <span>Alerts and Data Bulletin</span>
        <a href="#" className="c-regular-button -green">
            ANALIZE
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
