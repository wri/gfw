import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import ReactHtmlParser from 'react-html-parser';

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
                dangerouslySetInnerHTML={{ __html: metaData.subtitle }} // eslint-disable-line
              />
              <div className="meta-table">
                {tableData &&
                  Object.keys(tableData).map(
                    key =>
                      (tableData[key] ? (
                        <div key={key} className="table-row">
                          <div
                            className="title-column"
                            dangerouslySetInnerHTML={{ __html: lowerCase(key) }} // eslint-disable-line
                          />
                          <div className="description-column">
                            {this.parseContent(tableData[key])}
                          </div>
                        </div>
                      ) : null)
                  )}
              </div>
              {metaData.overview && (
                <div className="overview">
                  <h4>Overview</h4>
                  <div className="body">
                    {this.parseContent(metaData.overview)}
                  </div>
                </div>
              )}
              {metaData.citation && (
                <div className="citation">
                  <h5>Citation</h5>
                  <div className="body">
                    {this.parseContent(metaData.citation)}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    );
  }

  parseContent(html) {
    return (
      <div>
        {ReactHtmlParser(html, {
          transform: node => { // eslint-disable-line
            if (node.name === 'a') {
              return (
                <a
                  key={node.attribs.href}
                  href={node.attribs.href}
                  target="_blank"
                  rel="noopener"
                >
                  {node.children[0].data}
                </a>
              );
            }
          }
        })}
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
