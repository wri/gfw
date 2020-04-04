import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { logout } from 'services/user';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import pencilIcon from 'assets/icons/pencil.svg';
import logoutIcon from 'assets/icons/logout.svg';

import './styles.scss';

class UserProfile extends PureComponent {
  static propTypes = {
    userData: PropTypes.object,
    setProfileModalOpen: PropTypes.func
  };

  render() {
    const { userData, setProfileModalOpen } = this.props;
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
          onClick={() => setProfileModalOpen(true)}
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

export default UserProfile;
