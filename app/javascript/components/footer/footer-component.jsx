import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MediaQuery from 'react-responsive';
import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Button from 'components/ui/button';
import ContactUs from 'components/modals/contact-us';
import Newsletter from 'components/modals/newsletter';
import wri from 'assets/logos/wri.svg';
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
      <MediaQuery minWidth={850}>
        {isDesktop => (
          <div className="c-footer">
            <ContactUs />
            <Newsletter />
            <div className="footer-subscribe">
              <Button
                onClick={() => this.props.setModalNewsletterOpen(true)}
                className="footer-subscribe-button footer-newsletter"
              >
                STAY UPDATED
              </Button>
            </div>
            <div className="footer-main">
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
                  <button
                    onClick={() => this.props.setModalContactUsOpen(true)}
                    className="text-button footer-links__contact"
                  >
                    CONTACT US
                  </button>
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
                <div className="footer-logos">
                  <p>Partners</p>
                  <Carousel
                    className="partners-slide"
                    settings={{
                      slidesToShow: isDesktop ? 4 : 1,
                      slidesToScroll: isDesktop ? 4 : 1,
                      infinite: true,
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
                      <li className="carousel-slide" key={`${p.name}${i}`}>
                        <a
                          target="_blank"
                          hrel="noopener noreferrer"
                          href={p.url}
                        >
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
                            src={`/assets/logos/${p.name}.png`}
                            alt={p.name}
                          />
                        </a>
                      </li>
                    ))}
                  </Carousel>
                </div>
              </div>
              <div className="footer-terms">
                <a className="terms" href="/terms">
                  Terms of Service
                </a>
                {' · '}
                <a className="terms" href="/privacy-policy">
                  Privacy Policy
                </a>
                {' · '}
                <a
                  className="terms"
                  href="http://stats.pingdom.com/ghabapk9rihc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Global Forest Watch System Status
                </a>
              </div>
            </div>
          </div>
        )}
      </MediaQuery>
    );
  }
}

Footer.propTypes = {
  setModalContactUsOpen: PropTypes.func,
  setModalNewsletterOpen: PropTypes.func
};

export default Footer;
