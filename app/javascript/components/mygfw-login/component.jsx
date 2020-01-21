import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

const AUTH_URL = `${process.env.GFW_API}/auth`;

const socialButtons = [
  {
    label: 'Twitter',
    value: 'twitter'
  },
  {
    label: 'Facebook',
    value: 'facebook'
  },
  {
    label: 'Google',
    value: 'google'
  }
];

class MyGFWLogin extends PureComponent {
  render() {
    const { className, plain } = this.props;

    return (
      <div className={cx('c-my-gfw', { '-plain': plain }, className)}>
        <p>
          Log in is required so you can view, manage, and delete your
          subscriptions. Questions? <a href="mailto:gfw@wri.org">Contact us</a>
        </p>
        <div className="login-form">
          <div className="social-btns">
            {socialButtons.map(s => (
              <a
                key={s.value}
                className={`social-btn -${s.value}`}
                href={`${AUTH_URL}/${s.value}?applications=gfw&callbackUrl=${
                  window.location.href
                }`}
              >
                Login with {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

MyGFWLogin.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool
};

export default MyGFWLogin;
