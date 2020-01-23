import React, { PureComponent } from 'react';

import MyGfwLogin from 'components/mygfw-login';

import './styles.scss';

class LoginPage extends PureComponent {
  render() {
    return (
      <div className="l-login-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <h1>Login to My GFW</h1>
            <MyGfwLogin />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
