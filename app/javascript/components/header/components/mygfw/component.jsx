import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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

class MyGFW extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={`c-my-gfw ${className || ''}`}>
        <p>
          Log in is required so you can view, manage, and delete your
          subscriptions. Questions? <a href="mailto:gfw@wri.org">Contact us</a>
        </p>
        {socialButtons.map(s => (
          <a
            key={s.value}
            className={`social-btn -${s.value}`}
            href={`${AUTH_URL}/${s.value}?applications=gfw`}
          >
            Login with {s.label}
          </a>
        ))}
      </div>
    );
  }
}

MyGFW.propTypes = {
  className: PropTypes.string
};

export default MyGFW;
