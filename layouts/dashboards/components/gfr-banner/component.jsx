import React, { PureComponent } from 'react';
import './styles.scss';
import GFRLogoWebP from './assets/gfr-logo.webp';
import GFRLogoPNG from './assets/gfr-logo.png';

class GFRBanner extends PureComponent {
  render() {
    return (
      <div className="c-widgets dashboard-widgets gfr-banner">
        <a
          href="https://research.wri.org/gfr/global-forest-review"
          target="_blank"
          rel="noreferrer"
          className="gfr-banner-content"
        >
          <div>
            For more in-depth analysis and insights on the status of the
            world&apos;s forests, check out the
          </div>
          <div className="gfr-logo">
            <picture>
              <source srcSet={GFRLogoWebP} type="image/webp" />
              <source srcSet={GFRLogoPNG} type="image/png" />
              <img src={GFRLogoPNG} alt="Global Forest Review" />
            </picture>
          </div>
        </a>
      </div>
    );
  }
}

export default GFRBanner;
