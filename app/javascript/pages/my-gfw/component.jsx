import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LoginForm from 'components/forms/login';
import ProfileForm from 'components/forms/profile';

import './styles.scss';

class LoginPage extends PureComponent {
  static propTypes = {
    loggedIn: PropTypes.bool
  };

  render() {
    const { loggedIn } = this.props;

    return (
      <div className={cx('l-my-gfw-page', { login: !loggedIn })}>
        {loggedIn ? (
          <Fragment>
            <div className="header-banner">
              <div className="row">
                <div className="column small-12 medium-6">
                  <h1>My GFW</h1>
                </div>
              </div>
            </div>
            <div className="profile-form">
              <ProfileForm />
            </div>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    );
  }
}

export default LoginPage;
