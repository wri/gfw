import React, { PureComponent } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';

import Button from 'components/ui/button';
// import Icon from 'components/ui/icon';

import './styles.scss';

const logout = () =>
  axios
    .get(`${process.env.GFW_API}/auth/logout`, { withCredentials: true })
    .then(response => {
      if (response.status < 400) {
        localStorage.removeItem('mygfw_token');
        window.location.reload();
      } else {
        console.warn('Failed to logout');
      }
    });

class UserProfile extends PureComponent {
  render() {
    // const { loggedIn, myGfwLoading } = this.props;
    return (
      <div className="c-user-profile">
        <p>Jane Doe</p>
        <p>
          <i>jane@doe.org</i>
        </p>
        <Button theme="theme-button-clear theme-button-small">
          Update profile
          {/* <Icon /> */}
        </Button>
        <Button theme="theme-button-clear theme-button-small" onClick={logout}>
          Logout
          {/* <Icon /> */}
        </Button>
      </div>
    );
  }
}

// UserProfile.propTypes = {
// };

export default UserProfile;
