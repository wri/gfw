import PropTypes from 'prop-types';

import { Button } from 'gfw-components';

import { logout } from 'services/user';

import Icon from 'components/ui/icon';
import ProfileModal from 'components/modals/profile';

import pencilIcon from 'assets/icons/pencil.svg?sprite';
import logoutIcon from 'assets/icons/logout.svg?sprite';

import './styles.module.scss';

const UserProfile = ({ userData, setProfileModalOpen }) => {
  const { fullName, email, firstName, lastName } = userData || {};

  return (
    <div className="c-user-profile">
      {!lastName && fullName && <p className="name">{fullName}</p>}
      {(firstName || lastName) && (
        <p className="name">
          {firstName} 
          {' '}
          {lastName}
        </p>
      )}
      {email && (
        <p className="email">
          <i>{email}</i>
        </p>
      )}
      <Button
        className="user-btn"
        clear
        size="small"
        onClick={() => setProfileModalOpen(true)}
      >
        Update profile
        <Icon className="user-btn-icon" icon={pencilIcon} />
      </Button>
      <Button className="user-btn" clear size="small" onClick={logout}>
        Logout
        <Icon className="user-btn-icon" icon={logoutIcon} />
      </Button>
      <ProfileModal />
    </div>
  );
};

UserProfile.propTypes = {
  userData: PropTypes.object,
  setProfileModalOpen: PropTypes.func,
};

export default UserProfile;
