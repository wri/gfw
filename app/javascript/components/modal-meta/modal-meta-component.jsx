import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';

import Modal from 'components/modal';
import Loader from 'components/loader';
import NoContent from 'components/no-content';

import './modal-meta-styles.scss';

class ModalMeta extends PureComponent {
  getContent() {
    const { metaData, tableData, loading, error } = this.props;

    return (
      <div className="c-modal-meta">
        {loading && <Loader />}
        {error &&
          !loading && (
            <NoContent message="There was a problem finding this info. Please try again later." />
          )}
        {!loading &&
          isEmpty(metaData) &&
          !error && (
            <NoContent message="Sorry, we cannot find what you are looking for." />
          )}
        {!loading &&
          !error &&
          !isEmpty(metaData) && (
            <div>
              <h3 className="title">{metaData.title}</h3>
              <p
                className="subtitle"
                dangerouslySetInnerHTML={{ __html: metaData.subtitle }}
              />
              <div className="meta-table">
                {tableData &&
                  Object.keys(tableData).map(
                    key =>
                      (tableData[key] ? (
                        <div key={key} className="table-row">
                          <div
                            className="title-column"
                            dangerouslySetInnerHTML={{ __html: lowerCase(key) }}
                          />
                          <div
                            className="description-column"
                            dangerouslySetInnerHTML={{ __html: tableData[key] }}
                          />
                        </div>
                      ) : null)
                  )}
              </div>
              {metaData.overview && (
                <div className="overview">
                  <h4>Overview</h4>
                  <p dangerouslySetInnerHTML={{ __html: metaData.overview }} />
                </div>
              )}
              {metaData.citation && (
                <div className="citation">
                  <h5>Citation</h5>
                  <p dangerouslySetInnerHTML={{ __html: metaData.citation }} />
                </div>
              )}
            </div>
          )}
      </div>
    );
  }

  render() {
    const { open, setModalMetaClosed } = this.props;
    return (
      <Modal isOpen={open} onRequestClose={() => setModalMetaClosed(false)}>
        {this.getContent()}
      </Modal>
    );
  }
}

ModalMeta.propTypes = {
  open: PropTypes.bool,
  setModalMetaClosed: PropTypes.func,
  metaData: PropTypes.object,
  tableData: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool
};

export default ModalMeta;
