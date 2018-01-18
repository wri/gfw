import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

import Modal from 'components/modal';
import Loader from 'components/loader';
import NoContent from 'components/no-content';

import './modal-meta-styles.scss';

class ModalMeta extends PureComponent {
  getContent() {
    const { data, loading, error } = this.props;
    const tableData = pick(data, [
      'function',
      'resolution',
      'geographic_coverage',
      'source',
      'frequency_of_updates',
      'date_of_content',
      'cautions',
      'license'
    ]);

    return (
      <div className="c-modal-meta">
        {loading && <Loader />}
        {error &&
          !loading && (
            <NoContent message="There was a problem finding this info. Please try again later." />
          )}
        {!loading &&
          isEmpty(data) &&
          !error && (
            <NoContent message="Sorry, we cannot find what you are looking for." />
          )}
        {!loading &&
          !error &&
          !isEmpty(data) && (
            <div>
              <h3 className="title">{data.title}</h3>
              <p
                className="tags"
                dangerouslySetInnerHTML={{ __html: data.tags }}
              />
              <div className="meta-table">
                {tableData &&
                  Object.keys(tableData).map(
                    key =>
                      (tableData[key] ? (
                        <div key={key} className="table-row">
                          <div
                            className="title-column"
                            dangerouslySetInnerHTML={{ __html: key }}
                          />
                          <div
                            className="description-column"
                            dangerouslySetInnerHTML={{ __html: tableData[key] }}
                          />
                        </div>
                      ) : null)
                  )}
              </div>
              {data.overview && (
                <div className="overview">
                  <h4>Overview</h4>
                  <p dangerouslySetInnerHTML={{ __html: data.overview }} />
                </div>
              )}
              {data.citation && (
                <div className="citation">
                  <h5>Citation</h5>
                  <p dangerouslySetInnerHTML={{ __html: data.citation }} />
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
      <Modal
        isOpen={open}
        onRequestClose={() => setModalMetaClosed(false)}
        customStyles={{
          overlay: {
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
            backgroundColor: 'rgba(17, 55, 80, 0.4)'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            padding: '0',
            border: 'none',
            borderRadius: 0
          }
        }}
        closeClass="c-modal-meta-close"
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalMeta.propTypes = {
  open: PropTypes.bool,
  setModalMetaClosed: PropTypes.func,
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool
};

export default ModalMeta;
