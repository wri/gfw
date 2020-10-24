import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';

import { Carousel } from 'gfw-components';

import Modal from 'components/modals/modal';

import './styles.scss';

const parseBodyContent = (html, className) => {
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

const GrantsProjectsModal = ({ open, data = {}, onRequestClose }) => {
  const isFellow = data?.categories?.includes('Fellow');
  const {
    title,
    description,
    meta,
    image,
    images,
    blogLink,
    blogSentence,
    categories,
  } = data;

  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      <div className="c-grants-projects-modal">
        <div className="header">
          {title && <h1>{title}</h1>}
          <span className="subtitle">
            <p
              className="tag"
              style={{ backgroundColor: isFellow ? '#f88000' : '#97bd3d' }}
            >
              {isFellow ? 'fellow' : 'grantee'}
            </p>
            <h2>{meta}</h2>
          </span>
        </div>
        {images?.length > 1 && (
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
            {images.map((c) => (
              <div key={c} className="image">
                <div
                  style={{
                    backgroundImage: `url('${c}')`,
                  }}
                />
              </div>
            ))}
          </Carousel>
        )}
        {images?.length === 1 && (
          <div
            className="image element-fullwidth"
            style={{ backgroundImage: `url('${image}')` }}
          />
        )}
        <div className="content">
          {description && parseBodyContent(description, 'description')}
          {blogSentence && blogLink && (
            <a
              className="links"
              href={blogLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blogSentence}
            </a>
          )}
          {categories && (
            <p className="categories">
              {categories.filter((i) => i).join(', ')}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

GrantsProjectsModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object,
  onRequestClose: PropTypes.func,
};

export default GrantsProjectsModal;
