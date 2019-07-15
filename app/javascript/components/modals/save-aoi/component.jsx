import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SubscriptionForm from './components/subscription-form';

import './styles.scss';

class ModalSaveAOI extends PureComponent {
  handleCloseModal = () => {
    const { setSaveAOISettings, resetSaveAOI, saving } = this.props;
    if (!saving) {
      setSaveAOISettings({ open: false });
      resetSaveAOI();
    }
  };

  renderUserLoginForm = () => <MyGFWLogin className="mygfw-save-aoi" />;

  renderSaved = () => <h1>Subscription saved!</h1>;

  render() {
    const { open, userData, loading, saved, activeArea } = this.props;

    let title;
    if (saved) {
      title = 'Area saved';
    } else if (activeArea) {
      title = 'Edit Area of Interest';
    } else {
      title = 'Save Area of Interest';
    }

    return (
      <Modal
        isOpen={open}
        contentLabel={
          activeArea ? 'Edit Area of Interest' : 'Save Area of Interest'
        }
        onRequestClose={this.handleCloseModal}
        title={title}
      >
        <div className="c-modal-save-aoi">
          <div className="save-aoi-body">
            {loading && <Loader />}
            {!loading && isEmpty(userData) && this.renderUserLoginForm()}
            {!loading &&
              !isEmpty(userData) &&
              !saved && <SubscriptionForm {...this.props} />}
            {!loading && !isEmpty(userData) && saved && this.renderSaved()}
          </div>
        </div>
      </Modal>
    );
  }
}

ModalSaveAOI.propTypes = {
  saved: PropTypes.bool,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  setSaveAOISettings: PropTypes.func,
  resetSaveAOI: PropTypes.func,
  userData: PropTypes.object,
  datasets: PropTypes.array,
  activeArea: PropTypes.object,
  locationName: PropTypes.string,
  activeDatasets: PropTypes.array,
  saving: PropTypes.bool
};

export default ModalSaveAOI;
