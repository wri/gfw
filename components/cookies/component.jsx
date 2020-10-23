import React, { PureComponent } from 'react';
import Head from 'next/head';

import { track, initAnalytics, handlePageTrack } from 'analytics';
import Button from 'components/ui/button';

import './styles.scss';

class Cookies extends PureComponent {
  state = {
    open: false,
    accepted: false,
  };

  componentDidMount() {
    const agreeCookies = JSON.parse(localStorage.getItem('agreeCookies'));
    this.setState({ open: !agreeCookies, accepted: agreeCookies });
  }

  agreeCookies = () => {
    this.setState({ open: false, accepted: true });
    localStorage.setItem('agreeCookies', true);
    initAnalytics();
    handlePageTrack();
    track('acceptCookies');
  };

  render() {
    const { open, accepted } = this.state;

    return (
      <>
        {open && (
          <div className="c-cookies">
            <div className="row">
              <div className="column small-12 medium-8 medium-offset-1">
                <p className="cookies-text">
                  This website uses cookies to provide you with an improved user
                  experience. By continuing to browse this site, you consent to
                  the use of cookies and similar technologies. Please visit our
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {' '}
                    privacy policy
                    {' '}
                  </a>
                  {' '}
                  for further details.
                </p>
              </div>
              <div className="column small-12 medium-2 cookies-button">
                <Button
                  className="cookies-btn"
                  theme="theme-button-grey theme-button-small"
                  onClick={() => this.agreeCookies()}
                >
                  I agree
                </Button>
              </div>
            </div>
          </div>
        )}
        {accepted && (
          <Head>
            <script
              key="hotjar"
              type="text/javascript"
              src="/scripts/hotjar.js"
            />
            <script
              key="crazyegg"
              type="text/javascript"
              src="//script.crazyegg.com/pages/scripts/0027/6897.js"
            />
          </Head>
        )}
      </>
    );
  }
}

export default Cookies;
