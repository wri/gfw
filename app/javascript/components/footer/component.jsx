import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Media } from 'utils/responsive';
import { HOWTO_URL, BLOG_URL } from 'utils/constants';

import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Button from 'components/ui/button';

import wri from 'assets/logos/wri.svg?sprite';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import facebook from 'assets/icons/social/facebook.svg?sprite';
import googleplus from 'assets/icons/social/google-plus.svg?sprite';
import instagram from 'assets/icons/social/instagram.svg?sprite';
import twitter from 'assets/icons/social/twitter.svg?sprite';
import youtube from 'assets/icons/social/youtube.svg?sprite';

import partners from 'data/partners.json';

import './styles.scss';

const images = require.context('assets/logos', true);

class Footer extends PureComponent {
  static propTypes = {
    NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    setModalContactUsOpen: PropTypes.func,
  };

  renderCarousel = (slidesToShow) => (
    <Carousel
      className="partners-slide"
      settings={{
        slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: true,
        nextArrow: (
          <Button
            theme="theme-button-clear square"
            ariaLabel="next partners logos"
          >
            <Icon icon={arrowIcon} />
          </Button>
        ),
        prevArrow: (
          <Button
            theme="theme-button-clear square"
            ariaLabel="prev partners logos"
          >
            <Icon icon={arrowIcon} />
          </Button>
        ),
        lazyLoad: true,
      }}
    >
      {partners.map((p, i) => (
        <div className="carousel-slide" key={`${p.name}${i}`}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={p.url}
            aria-label={p.name}
          >
            <img
              className="logo-grey"
              src={images(`./${p.name}.png`)}
              alt={p.name}
            />
            <img
              className="logo-color"
              src={images(`./${p.name}hover.png`)}
              alt={p.name}
            />
          </a>
        </div>
      ))}
    </Carousel>
  );

  render() {
    const { NavLinkComponent, setModalContactUsOpen } = this.props;

    return (
      <div className="c-footer">
        <div className="footer-main">
          <div className="row footer-links">
            <div className="column small-12 medium-6">
              <ul className="footer-links-texts">
                <li>
                  <a href="/">GFW</a>
                </li>
                <li>
                  <a href={BLOG_URL}>Blog</a>
                </li>
                <li>
                  <a href={HOWTO_URL}>How to portal</a>
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
                    aria-label="twitter"
                  >
                    <Icon icon={twitter} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="facebook"
                  >
                    <Icon icon={facebook} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/globalforests/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="instagram"
                  >
                    <Icon icon={instagram} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCAsamYre1KLulf4FD-xJfLA"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="youtube"
                  >
                    <Icon icon={youtube} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://groups.google.com/forum/#!forum/globalforestwatch"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="google groups forum"
                  >
                    <Icon icon={googleplus} />
                  </a>
                </li>
              </ul>
            </div>
            <div className="column small-12">
              <div className="footer-contact-us">
                <button
                  className="contact-btn"
                  onClick={() => setModalContactUsOpen(true)}
                >
                  CONTACT US
                </button>
                {NavLinkComponent ? (
                  <NavLinkComponent href="/subscribe">
                    <Button className="subscribe-btn">
                      Subscribe to the GFW newsletter
                    </Button>
                  </NavLinkComponent>
                ) : (
                  <a href="https://globalforestwatch.org/subscribe">
                    <Button className="subscribe-btn">
                      Subscribe to the GFW newsletter
                    </Button>
                  </a>
                )}
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
                  aria-label="world resource institute"
                >
                  <Icon className="wri-logo" icon={wri} />
                </a>
              </div>
            </div>
            <div className="column small-12 medium-9">
              <div className="footer-partners-slide">
                <div className="footer-logos">
                  <p>Partners</p>
                  <Media greaterThanOrEqual="md">
                    {this.renderCarousel(4)}
                  </Media>
                  <Media lessThan="md">{this.renderCarousel(1)}</Media>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12">
              <div className="footer-terms">
                {NavLinkComponent ? (
                  <NavLinkComponent href="/terms" className="terms">
                    Terms of Service
                  </NavLinkComponent>
                ) : (
                  <a className="terms">Terms of Service</a>
                )}
                {' · '}
                {NavLinkComponent ? (
                  <NavLinkComponent href="/privacy-policy" className="terms">
                    Privacy Policy
                  </NavLinkComponent>
                ) : (
                  <a className="terms">Privacy Policy</a>
                )}
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
      </div>
    );
  }
}

export default Footer;
