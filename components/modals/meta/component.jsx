import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import moment from 'moment';
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

  /**
   * We have 3 different properties to display the content date:
   * content_date_description, content_date_range and content_date, in this order of priority
   * @returns An object cointaing metadata rows with the correct content_date
   */
  setContentDate() {
    const {
      tableData: {
        resolution_description,
        content_date_range = {},
        content_date_description,
        content_date,
        ...rest
      },
    } = this.props;

    const entries = Object.entries(rest);
    const { start_date = null, end_date = null } = content_date_range;

    let contentDate = content_date;

    if (start_date && end_date) {
      contentDate = `${start_date.slice(0, 4)}-${end_date.slice(0, 4)}`;
    }

    if (content_date_description) {
      contentDate = content_date_description;
    }

    entries.splice(1, 0, ['resolution', resolution_description]);
    entries.splice(-2, 0, ['content_date', contentDate]);

    return Object.fromEntries(entries);
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

    const tableDataWithContentDate = this.setContentDate(tableData);

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
              {tableDataWithContentDate &&
                Object.keys(tableDataWithContentDate).map((key) =>
                  tableDataWithContentDate[key] ? (
                    <div key={key} className="table-row">
                      <div
                        className="title-column"
                        dangerouslySetInnerHTML={{ __html: lowerCase(key) }} // eslint-disable-line
                      />
                      <div className="description-column">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {tableDataWithContentDate[key]}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : null
                )}
            </div>
            {overview && (
              <div className="overview">
                <h4>Overview</h4>
                <div className="body">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {overview}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            {parsedCitation && (
              <div className="citation">
                <h5>Citation</h5>
                <div className="body">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {parsedCitation}
                  </ReactMarkdown>
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
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

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
