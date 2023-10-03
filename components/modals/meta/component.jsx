import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import { trackEvent } from 'utils/analytics';

import { Button, NoContent } from '@worldresources/gfw-components';

import Modal from 'components/modal';

class ModalMeta extends PureComponent {
  static propTypes = {
    setModalMetaClosed: PropTypes.func,
    metaData: PropTypes.object,
    getModalMetaData: PropTypes.func,
    metaType: PropTypes.string,
    metakey: PropTypes.string,
    tableData: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    locationName: PropTypes.string,
  };

  componentDidMount() {
    const { getModalMetaData, metakey, metaType } = this.props;
    if (metakey) {
      getModalMetaData({metakey, metaType});
    }
  }

  componentDidUpdate(prevProps) {
    const { getModalMetaData, metakey, metaData, metaType } = this.props;
    if (metakey && metakey !== prevProps.metakey) {
      getModalMetaData({metakey, metaType});
    }

    if (
      metaData &&
      metaData.title &&
      metaData.title !== prevProps.metaData.title
    ) {
      trackEvent({
        category: 'Open modal',
        action: 'Click to open',
        label: `Metadata: ${metaData && metaData.title}`,
      });
    }
  }

  getContent() {
    const { metaData, tableData, loading, error, locationName } = this.props;
    const {
      subtitle,
      overview,
      citation,
      map_service,
      learn_more,
      download_data,
      amazon_link,
    } = metaData || {};

    const parsedCitation =
      citation &&
      citation
        .replaceAll('[selected area name]', locationName)
        .replaceAll('[date]', moment().format('DD/MM/YYYY'));

    return (
      <div className="modal-meta-content">
        {error && !loading && (
          <NoContent message="There was a problem finding this info. Please try again later." />
        )}
        {!loading && isEmpty(metaData) && !error && (
          <NoContent message="Sorry, we cannot find what you are looking for." />
        )}
        {!loading && !error && !isEmpty(metaData) && (
          <div>
            <p
              className="subtitle"
              dangerouslySetInnerHTML={{ __html: subtitle }} // eslint-disable-line
            />
            <div className="meta-table element-fullwidth">
              {tableData &&
                Object.keys(tableData).map((key) =>
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
            {parsedCitation && (
              <div className="citation">
                <h5>Citation</h5>
                <div className="body">{this.parseContent(parsedCitation)}</div>
              </div>
            )}
            {(learn_more || download_data || map_service || amazon_link) && (
              <div className="ext-actions">
                {learn_more && (
                  <a
                    href={learn_more}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="medium">LEARN MORE</Button>
                  </a>
                )}
                {download_data && (
                  <a
                    href={download_data}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="medium">DOWNLOAD DATA</Button>
                  </a>
                )}
                {(map_service || amazon_link) && (
                  <a
                    href={map_service || amazon_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="medium">OPEN IN ARCGIS</Button>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  parseContent = (html) => {
    return (
      <div>
        {ReactHtmlParser(html, {
          transform: (node) =>
            node.name === 'a' ? (
              <a
                key={node.attribs.href}
                href={node.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {node.children[0].data}
              </a>
            ) : (
              ''
            ),
        })}
      </div>
    );
  };

  render() {
    const { metakey, setModalMetaClosed, metaData, loading } = this.props;
    const { title } = metaData || {};

    return (
      <Modal
        open={!!metakey}
        onRequestClose={() => setModalMetaClosed()}
        className="c-modal-meta"
        title={title}
        loading={loading}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

export default ModalMeta;
