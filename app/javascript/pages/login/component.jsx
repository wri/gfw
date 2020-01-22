import React, { PureComponent } from 'react';

import LoginForm from 'components/forms/login';

import './styles.scss';

class LoginPage extends PureComponent {
  render() {
    return (
      <div className="l-login-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
