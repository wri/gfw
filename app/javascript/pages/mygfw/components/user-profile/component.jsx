import React, { PureComponent } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import pencilIcon from 'assets/icons/pencil.svg';
import logoutIcon from 'assets/icons/logout.svg';

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
    const { userData } = this.props;
    const { fullName, email } = userData || {};

    return (
      <div className="c-user-profile">
        {fullName && <p className="name">{fullName}</p>}
        {email && (
          <p className="email">
            <i>{email}</i>
          </p>
        )}
        <Button
          className="user-btn"
          theme="theme-button-clear theme-button-small"
        >
          Update profile
          <Icon className="user-btn-icon" icon={pencilIcon} />
        </Button>
        <Button
          className="user-btn"
          theme="theme-button-clear theme-button-small"
          onClick={logout}
        >
          Logout
          <Icon className="user-btn-icon" icon={logoutIcon} />
        </Button>
      </div>
    );
  }
}

UserProfile.propTypes = {
  userData: PropTypes.object
};

export default UserProfile;
