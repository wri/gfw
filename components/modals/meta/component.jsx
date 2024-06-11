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
      getModalMetaData({ metakey, metaType });
    }
  }

  componentDidUpdate(prevProps) {
    const { getModalMetaData, metakey, metaData, metaType } = this.props;
    if (metakey && metakey !== prevProps.metakey) {
      getModalMetaData({ metakey, metaType });
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
    const { subtitle, overview, citation, learn_more, download_data } =
      metaData || {};

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
                        <p>{this.parseMarkdownURLToHTML(tableData[key])}</p>
                      </div>
                    </div>
                  ) : null
                )}
            </div>
            {overview && (
              <div className="overview">
                <h4>Overview</h4>
                <div className="body">
                  <p>{this.parseMarkdownURLToHTML(overview)}</p>
                </div>
              </div>
            )}
            {parsedCitation && (
              <div className="citation">
                <h5>Citation</h5>
                <div className="body">
                  <p>{this.parseMarkdownURLToHTML(parsedCitation)}</p>
                </div>
              </div>
            )}
            {(learn_more || download_data) && (
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
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  parseMarkdownURLToHTML = (markdown) => {
    const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    const htmlAnchor = markdown.replace(
      markdownRegex,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return <>{ReactHtmlParser(htmlAnchor)}</>;
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
