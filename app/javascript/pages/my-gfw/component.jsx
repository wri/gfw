import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LoginForm from 'components/forms/login';
import MyGFWLogin from 'components/mygfw-login';
import ProfileForm from 'components/forms/profile';

import './styles.scss';

class LoginPage extends PureComponent {
  static propTypes = {
    loggedIn: PropTypes.bool
  };

  render() {
    const { loggedIn } = this.props;

    return (
      <div
        className={cx(
          'l-my-gfw-page',
          { login: !loggedIn },
          { 'old-theme': process.env.FEATURE_ENV !== 'staging' }
        )}
      >
        {loggedIn || process.env.FEATURE_ENV !== 'staging' ? (
          <Fragment>
            <div className="header-banner">
              <div className="row">
                <div className="column small-12 medium-6">
                  <h1>My GFW</h1>
                </div>
              </div>
            </div>
            <div className="profile-form">
              {loggedIn ? (
                <ProfileForm />
              ) : (
                <div className="row">
                  <div className="column small-12 medium-4 medium-offset-4">
                    <MyGFWLogin />
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ) : (
          <div className="row">
            <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
              <LoginForm />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LoginPage;
