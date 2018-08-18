import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';

import './styles.scss';

class MyGFW extends PureComponent {
  render() {
    const {
      className
    } = this.props;

    return (
      <div className={`c-my-gfw ${className || ''}`}>
        <p>
          Log in is required so you can view, manage, and delete your subscriptions. Questions?
          <a href="mailto:gfw@wri.org">Contact us</a>
        </p>
        <Button>
          Login with Twitter
        </Button>
        <Button>
          Login with Google
        </Button>
        <Button>
          Login with Facebook
        </Button>
      </div>
    );
  }
}

MyGFW.propTypes = {
  className: PropTypes.string
};

export default MyGFW;
