import React from 'react';
import Button from 'components/ui/button';

import './footer-styles.scss';

const Footer = () => (
  <div id="c-footer" className="c-footer">
    <div className="row">
      <div className="small-12 medium-6 large-3 columns">
        <div className="alert">
          <span>Alerts and Data Bulletin</span>
          <Button className="action" disabled>
            SUSCRIBE
          </Button>
        </div>
      </div>
      <div className="small-12 medium-6 large-3 columns">
        <div className="alert">
          <span>Alerts and Data Bulletin</span>
          <Button className="action" disabled>
            BROWSE
          </Button>
        </div>
      </div>
      <div className="small-12 medium-6 large-3 columns">
        <div className="alert">
          <span>Alerts and Data Bulletin</span>
          <Button className="action" disabled>
            DOWNLOAD
          </Button>
        </div>
      </div>
      <div className="small-12 medium-6 large-3 columns">
        <div className="alert">
          <span>Alerts and Data Bulletin</span>
          <Button className="action" disabled>
            ANALIZE
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
