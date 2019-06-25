import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';
import { NavLink } from 'redux-first-router-link';

import MediaQuery from 'react-responsive';
import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Button from 'components/ui/button';
import Newsletter from 'components/modals/newsletter';

import wri from 'assets/logos/wri.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';
import facebook from 'assets/icons/social/facebook.svg';
import googleplus from 'assets/icons/social/google-plus.svg';
import instagram from 'assets/icons/social/instagram.svg';
import twitter from 'assets/icons/social/twitter.svg';
import youtube from 'assets/icons/social/youtube.svg';

import partners from 'data/partners.json';

import './styles.scss';

class Footer extends PureComponent {
  render() {
    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-footer">
            <div className="footer-subscribe">
              <div className="row">
                <div className="column small-12">
                  <div className="footer-subscribe-wrapper">
                    <Button
                      onClick={() => this.props.setModalNewsletterOpen(true)}
                      className="footer-subscribe-button"
                    >
                      STAY UPDATED
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-main">
              <div className="row footer-links">
                <div className="column small-12 medium-6">
                  <ul className="footer-links-texts">
                    <li>
                      <a href="https://www.globalforestwatch.org/">GFW</a>
                    </li>
                    <li>
                      <a href="https://blog.globalforestwatch.org/">Blog</a>
                    </li>
                    <li>
                      <a href="https://www.globalforestwatch.org/howto/">
                        How to portal
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="column small-12 medium-6">
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
                <div className="column small-12">
                  <div className="footer-contact-us">
                    <button
                      onClick={() => this.props.setModalContactUsOpen(true)}
                    >
                      CONTACT US
                    </button>
                  </div>
                </div>
              </div>
              <div className="row footer-partners">
                <div className="column small-12 medium-3">
                  <div className="footer-wri">
                    <p>A partnership convened by</p>
                    <a
                      href="https://www.wri.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="wri-logo" icon={wri} />
                    </a>
                  </div>
                </div>
                <div className="column small-12 medium-9">
                  <div className="footer-partners-slide">
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
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div className="footer-terms">
                    <NavLink className="terms" to="/terms">
                      Terms of Service
                    </NavLink>
                    {' · '}
                    <NavLink className="terms" to="/privacy-policy">
                      Privacy Policy
                    </NavLink>
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
            </div>
            <Newsletter />
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
