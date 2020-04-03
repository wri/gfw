import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';
import LoginForm from 'components/forms/login';
import AreaOfInterestForm from 'components/forms/area-of-interest';

import Modal from '../modal';

import './styles.scss';

class AreaOfInterestModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    canDelete: PropTypes.bool,
    setAreaOfInterestModalSettings: PropTypes.func,
    setMenuSettings: PropTypes.func,
    viewAfterSave: PropTypes.bool
  };

  componentWillUnmount() {
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    const { setAreaOfInterestModalSettings, setMenuSettings } = this.props;
    setAreaOfInterestModalSettings({ open: false, activeAreaId: null });
    setMenuSettings({ menuSection: 'my-gfw' });
  };

  render() {
    const { open, loading, loggedIn, canDelete, viewAfterSave } = this.props;

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
          {!loading &&
            loggedIn && (
            <AreaOfInterestForm
              canDelete={canDelete}
              closeForm={this.handleCloseModal}
              viewAfterSave={viewAfterSave}
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default AreaOfInterestModal;
