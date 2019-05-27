import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { track } from 'app/analytics';
import Button from 'components/ui/button';

import './styles.scss';

class Cookies extends PureComponent {
  render() {
    const { agreeCookies, open } = this.props;
    return open ? (
      <div className="c-cookies">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-1">
            <p className="cookies-text">
              This website uses cookies to provide you with an improved user
              experience. By continuing to browse this site, you consent to the
              use of cookies and similar technologies. Please visit our
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                privacy policy{' '}
              </a>{' '}
              for further details.
            </p>
          </div>
          <div className="column small-12 medium-2 cookies-button">
            <Button
              className="cookies-btn"
              theme="theme-button-grey theme-button-small"
              onClick={() => {
                agreeCookies();
                track('acceptCookies');
              }}
            >
              I agree
            </Button>
          </div>
        </div>
      </div>
    ) : null;
  }
}

Cookies.propTypes = {
  open: PropTypes.bool,
  agreeCookies: PropTypes.func
};

export default Cookies;
