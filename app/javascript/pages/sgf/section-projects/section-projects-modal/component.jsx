import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/modal';
import ReactHtmlParser from 'react-html-parser';
import Carousel from 'components/ui/carousel';

import './styles.scss';

class SectionProjectsModal extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    setSectionProjectsModalSlug: PropTypes.func,
    slug: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  parseContent = (html, className) => {
    return (
      <div className={className}>
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

  getContent() {
    const { data } = this.props;
    if (!data) return null;
    const isFellow =
      data.categories && data.categories.indexOf('Fellow') !== -1;

    return (
      <div className="c-sgf-projects-modal">
        <div className="header">
          {data.title && <h1>{data.title}</h1>}
          <span className="subtitle">
            <p
              className="tag"
              style={{ backgroundColor: isFellow ? '#f88000' : '#97bd3d' }}
            >
              {isFellow ? 'fellow' : 'grantee'}
            </p>
            <h2>{data.meta}</h2>
          </span>
        </div>
        {data.images && data.images.length > 1 && (
          <Carousel
            className="modal-image-slider element-fullwidth"
            settings={{
              slidesToShow: 1,
              arrows: false,
              dots: true,
              infinite: false,
              lazyLoad: true,
            }}
          >
            {data.images &&
              data.images.map((c) => (
                <div key={c} className="image">
                  <div
                    style={{
                      backgroundImage: `url("${c}")`,
                    }}
                  />
                </div>
              ))}
          </Carousel>
        )}
        {data.image && data.images.length === 1 && (
          <div
            className="image element-fullwidth"
            style={{
              backgroundImage: `url(${data.image})`,
            }}
          />
        )}
        <div className="content">
          {data.description &&
            this.parseContent(data.description, 'description')}
          {data.blogSentence && data.blogLink && (
            <a
              className="links"
              href={data.blogLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.blogSentence}
            </a>
          )}
          {data.categories && (
            <p className="categories">
              {data.categories.filter((i) => i).join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  handleClose = () => {
    this.props.setSectionProjectsModalSlug('');
  };

  render() {
    const { slug } = this.props;
    return (
      <Modal isOpen={!!slug} onRequestClose={this.handleClose}>
        {this.getContent()}
      </Modal>
    );
  }
}

export default SectionProjectsModal;
