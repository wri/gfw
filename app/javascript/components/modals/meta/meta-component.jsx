import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import ReactHtmlParser from 'react-html-parser';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Modal from '../modal';

import './meta-styles.scss';

class ModalMeta extends PureComponent {
  getContent() {
    const { metaData, tableData, loading, error } = this.props;
    const {
      title,
      subtitle,
      overview,
      citation,
      map_service,
      learn_more,
      download_data,
      amazon_link
    } =
      metaData || {};

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
              <h3 className="title">{title}</h3>
              <p
                className="subtitle"
                dangerouslySetInnerHTML={{ __html: subtitle }} // eslint-disable-line
              />
              <div className="meta-table">
                {tableData &&
                  Object.keys(tableData).map(
                    key =>
                      tableData[key] ? (
                        <div key={key} className="table-row">
                          <div
                            className="title-column"
                            dangerouslySetInnerHTML={{ __html: lowerCase(key) }} // eslint-disable-line
                          />
                          <div className="description-column">
                            {this.parseContent(tableData[key])}
                          </div>
                        </div>
                      ) : null
                  )}
              </div>
              {overview && (
                <div className="overview">
                  <h4>Overview</h4>
                  <div className="body">{this.parseContent(overview)}</div>
                </div>
              )}
              {citation && (
                <div className="citation">
                  <h5>Citation</h5>
                  <div className="body">{this.parseContent(citation)}</div>
                </div>
              )}
              {(learn_more || download_data || map_service || amazon_link) && (
                <div className="ext-actions">
                  {learn_more && (
                    <Button theme="theme-button-medium" extLink={learn_more}>
                      LEARN MORE
                    </Button>
                  )}
                  {download_data && (
                    <Button theme="theme-button-medium" extLink={download_data}>
                      DOWNLOAD DATA
                    </Button>
                  )}
                  {(map_service || amazon_link) && (
                    <Button
                      theme="theme-button-medium"
                      extLink={map_service || amazon_link}
                    >
                      OPEN IN ARCGIS
                    </Button>
                  )}
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
          transform: node => {
            // eslint-disable-line
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
    const { open, setModalMetaClosed, metaData } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel={`Metadata: ${metaData && metaData.title}`}
        onRequestClose={() => setModalMetaClosed(false)}
      >
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
