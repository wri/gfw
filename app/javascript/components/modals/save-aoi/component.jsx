import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SaveAOIForm from './components/save-aoi-form';

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

  renderMessage = message => <p>{message}</p>;

  render() {
    const { open, userData, loading, saved, deleted, activeArea } = this.props;

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
              !saved &&
              !deleted && <SaveAOIForm {...this.props} />}
            {!loading &&
              !isEmpty(userData) &&
              saved &&
              this.renderMessage('Area saved, you can now close this modal.')}
            {!loading && deleted && this.renderMessage('Area deleted.')}
          </div>
        </div>
      </Modal>
    );
  }
}

ModalSaveAOI.propTypes = {
  saved: PropTypes.bool,
  deleted: PropTypes.bool,
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
