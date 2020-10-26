import React, { PureComponent } from 'react';

import { CookiesBanner } from 'gfw-components';
import { track } from 'analytics';

import './styles.scss';

class Cookies extends PureComponent {
  state = {
    open: false,
  };

  componentDidMount() {
    this.setState({ open: !JSON.parse(localStorage.getItem('agreeCookies')) });
  }

  agreeCookies = () => {
    this.setState({ open: false });
    localStorage.setItem('agreeCookies', true);
    track('acceptCookies');
  };

  render() {
    const { open } = this.state;

    return open ? (
      <div className="c-cookies-banner">
        <CookiesBanner onAccept={this.agreeCookies} />
      </div>
    ) : null;
  }
}

export default Cookies;
