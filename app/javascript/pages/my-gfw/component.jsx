import React, { PureComponent } from 'react';

import LoginForm from 'components/forms/login';

import './styles.scss';

class LoginPage extends PureComponent {
  render() {
    return (
      <div className="l-login-page">
        <LoginForm />
      </div>
    );
  }
}

export default LoginPage;
