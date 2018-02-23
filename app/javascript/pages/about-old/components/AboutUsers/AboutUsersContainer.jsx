import { connect } from 'react-redux'
import {
  setUserData,
  setUserGroup,
  showModal,
  hideModal
} from '../../actions/globe'
import AboutUsersComponent from './AboutUsers'

const mapStateToProps = state => {
  return {
    selectedUserData: state.globe.userData,
    selectedUserGroup: state.globe.userGroup,
    isModalVisible: state.globe.isVisible
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setUserData: data => {
      dispatch(setUserData(data));
      dispatch(showModal());
    },
    setUserGroup: group => {
      dispatch(setUserGroup(group));
    },
    hideModal: () => {
      dispatch(hideModal());
    }
  }
};

const AboutUsers = connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUsersComponent);

export default AboutUsers;
