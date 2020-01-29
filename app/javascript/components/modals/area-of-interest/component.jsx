import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';
import LoginForm from 'components/mygfw-login';
import AreaOfInterestForm from 'components/forms/area-of-interest';

import Modal from '../modal';

import './styles.scss';

class AreaOfInterestModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    setAreaOfInterestModalSettings: PropTypes.func
  };

  componentWillUnmount() {
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    const { setAreaOfInterestModalSettings } = this.props;
    setAreaOfInterestModalSettings({ open: false, activeAreaId: null });
  };

  render() {
    const { open, loading, loggedIn } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Area of interest"
        onRequestClose={this.handleCloseModal}
        className="c-area-of-interest-modal"
      >
        <div className="save-aoi-body">
          {loading && <Loader />}
          {!loading && !loggedIn && <LoginForm />}
          {!loading && loggedIn && <AreaOfInterestForm />}
        </div>
      </Modal>
    );
  }
}

export default AreaOfInterestModal;
