import React, { PureComponent } from 'react';

import Button from 'components/ui/button';
import './footer-styles.scss';

class Footer extends PureComponent {
  render() {
    return (
      <div className="footerGfw">
        <div className="m-footer-subscribe">
          <Button className="m-footer-subscribe-button js-footer-newsletter">
            STAY UPDATED
          </Button>
        </div>
        <div className="wrapper">
          <div className="m-footer-list">
            <div className="m-footer-links">
              <ul className="m-footer-links-texts">
                <li>
                  <a href="http://www.globalforestwatch.org/">GFW</a>
                </li>
                <li>
                  <a href="http://blog.globalforestwatch.org/">Blog</a>
                </li>
                <li>
                  <a href="http://www.globalforestwatch.org/howto/">
                    How to portal
                  </a>
                </li>
              </ul>
              <ul className="m-footer-links-social">
                <li>
                  <a
                    href="https://twitter.com/globalforests"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tw
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    fb
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ig
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCAsamYre1KLulf4FD-xJfLA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    yt
                  </a>
                </li>
                <li>
                  <a
                    href="https://groups.google.com/forum/#!forum/globalforestwatch"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    g+
                  </a>
                </li>
              </ul>
            </div>
            <div className="m-footer-links -links-contact-sitemap">
              <a className="text-button" href="/sitemap">
                SITEMAP
              </a>
              <div className="text-button m-footer-links__contact js-footer-contact-us">
                CONTACT US
              </div>
            </div>
          </div>
          <div className="m-footer-info">
            <div className="m-footer-partner">
              <p>A partnership convened by</p>
              <a
                href="http://www.wri.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                wri_icon
              </a>
            </div>
            <div id="my-gfw-slider" className="m-footer-logos slider js_slider">
              <p>Partners</p>
              {/* Carousel */}
            </div>
          </div>
          <div className="m-footer-terms">
            <a href="/terms">Terms of Service</a>
            .
            <a href="/privacy-policy">Privacy Policy</a>
            .
            <a
              href="http://stats.pingdom.com/ghabapk9rihc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Global Forest Watch System Status
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
