import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';

import './styles.scss';

class Cookies extends PureComponent {
  render() {
    const { agreeCookies } = this.props;
    return (
      <div className="c-cookies">
        <div className="row">
          <div className="column small-12 medium-6 cookies-text">
            This website uses cookies to provide you with an improved user
            experience. By continuing to browse this site, you consent to the
            use of cookies and similar technologies. Please visit our privacy
            policy(linked to privacy policy) for further details.
          </div>
          <div className="column small-12 medium-6 cookies-button">
            <Button
              theme="theme-button-grey theme-button-small"
              onClick={agreeCookies}
            >
              I agree
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Cookies.propTypes = {
  agreeCookies: PropTypes.func
};

export default Cookies;
