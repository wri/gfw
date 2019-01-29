import React, { PureComponent } from 'react';

import wri from 'assets/logos/wri.svg';
import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Button from 'components/ui/button';
import arrowIcon from 'assets/icons/arrow-down.svg';
import facebook from 'assets/icons/social/facebook.svg';
import googleplus from 'assets/icons/social/google-plus.svg';
import instagram from 'assets/icons/social/instagram.svg';
import twitter from 'assets/icons/social/twitter.svg';
import youtube from 'assets/icons/social/youtube.svg';
import partners from 'data/partners.json';
import './footer-styles.scss';

class Footer extends PureComponent {
  render() {
    return (
      <div className="footerGfw">
        <div className="footer-subscribe">
          <Button className="footer-subscribe-button footer-newsletter">
            STAY UPDATED
          </Button>
        </div>
        <div className="wrapper">
          <div className="footer-list">
            <div className="footer-links">
              <ul className="footer-links-texts">
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
              <ul className="footer-links-social">
                <li>
                  <a
                    href="https://twitter.com/globalforests"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon={twitter} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon={facebook} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon={instagram} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCAsamYre1KLulf4FD-xJfLA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon={youtube} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://groups.google.com/forum/#!forum/globalforestwatch"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon={googleplus} />
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-links -links-contact-sitemap">
              <a className="text-button" href="/sitemap">
                SITEMAP
              </a>
              <div className="text-button footer-links__contact js-footer-contact-us">
                CONTACT US
              </div>
            </div>
          </div>
          <div className="footer-info">
            <div className="footer-partner">
              <p>A partnership convened by</p>
              <a
                href="http://www.wri.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon={wri} />
              </a>
            </div>
            <div id="my-gfw-slider" className="footer-logos slider js_slider">
              <p>Partners</p>
              <Carousel
                className="timeline"
                settings={{
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  centerMode: false,
                  dots: false,
                  nextArrow: (
                    <Button theme="theme-button-clear square">
                      <Icon icon={arrowIcon} />
                    </Button>
                  ),
                  prevArrow: (
                    <Button theme="theme-button-clear square">
                      <Icon icon={arrowIcon} />
                    </Button>
                  )
                }}
              >
                {partners.map((p, i) => (
                  <li className="slide" key={`${p.name}${i}`}>
                    <a target="_blank" hrel="noopener noreferrer" href={p.url}>
                      <img
                        onMouseEnter={e => {
                          e.currentTarget.src = e.currentTarget.src.replace(
                            '.png',
                            'hover.png'
                          );
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.src = e.currentTarget.src.replace(
                            'hover',
                            ''
                          );
                        }}
                        src={`assets/logos/${p.name}.png`}
                        alt={p.name}
                      />
                    </a>
                  </li>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="footer-terms">
            <a href="/terms">Terms of Service</a>
            {' · '}
            <a href="/privacy-policy">Privacy Policy</a>
            {' · '}
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
