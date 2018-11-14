import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Modal from '../modal';

import './styles.scss';

class ModalMeta extends PureComponent {
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

  getContent() {
    const { data: { title, body } } = this.props;

    return (
      <div className="c-modal-sources">
        <h3>{title}</h3>
        <div className="body">{this.parseContent(body)}</div>
      </div>
    );
  }

  render() {
    const { open, setModalSources, data } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel={`Sources: ${data && data.title}`}
        onRequestClose={() => setModalSources({ open: false })}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalMeta.propTypes = {
  open: PropTypes.bool,
  setModalSources: PropTypes.func,
  data: PropTypes.object
};

export default ModalMeta;
