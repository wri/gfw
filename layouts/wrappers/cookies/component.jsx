import React, { PureComponent } from 'react';
import Head from 'next/head';

import { CookiesBanner } from 'gfw-components';

import { track, initAnalytics, handlePageTrack } from 'analytics';

import './styles.scss';

class Cookies extends PureComponent {
  state = {
    accepted: false,
  };

  componentDidMount() {
    const agreeCookies = JSON.parse(localStorage.getItem('agreeCookies'));
    this.setState({ accepted: agreeCookies });
  }

  agreeCookies = () => {
    this.setState({ accepted: true });
    localStorage.setItem('agreeCookies', true);
    initAnalytics();
    handlePageTrack();
    track('acceptCookies');
  };

  render() {
    const { accepted } = this.state;

    return (
      <>
        <div className="c-cookies">
          <CookiesBanner afterAgree={this.agreeCookies} />
        </div>
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
