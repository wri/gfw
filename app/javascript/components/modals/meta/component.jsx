import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import ReactHtmlParser from 'react-html-parser';
import { track } from 'app/analytics';

import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Modal from '../modal';

import './styles.scss';

class ModalMeta extends PureComponent {
  componentDidMount() {
    const { getModalMetaData, metakey } = this.props;
    if (metakey) {
      getModalMetaData(metakey);
    }
  }

  componentDidUpdate(prevProps) {
    const { getModalMetaData, metakey, metaData } = this.props;
    if (metakey && metakey !== prevProps.metakey) {
      getModalMetaData(metakey);
    }

    if (
      metaData &&
      metaData.title &&
      metaData.title !== prevProps.metaData.title
    ) {
      track('openModal', { label: `Metadata: ${metaData && metaData.title}` });
    }
  }

  getContent() {
    const { metaData, tableData, loading, error } = this.props;
    const {
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
      <div className="modal-meta-content">
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
            <p
              className="subtitle"
                dangerouslySetInnerHTML={{ __html: subtitle }} // eslint-disable-line
            />
            <div className="meta-table element-fullwidth">
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
          transform: node =>
            (node.name === 'a' ? (
              <a
                key={node.attribs.href}
                href={node.attribs.href}
                target="_blank"
                rel="noopener"
              >
                {node.children[0].data}
              </a>
            ) : (
              ''
            ))
        })}
      </div>
    );
  }

  render() {
    const { metakey, setModalMetaSettings, metaData, loading } = this.props;
    const { title } = metaData || {};
    return (
      <Modal
        isOpen={!!metakey}
        track={false}
        onRequestClose={() => setModalMetaSettings('')}
        className="c-modal-meta"
        title={title}
        loading={loading}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalMeta.propTypes = {
  setModalMetaSettings: PropTypes.func,
  metaData: PropTypes.object,
  getModalMetaData: PropTypes.func,
  metakey: PropTypes.string,
  tableData: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool
};

export default ModalMeta;
