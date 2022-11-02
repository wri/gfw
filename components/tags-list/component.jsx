import PropTypes from 'prop-types';
import Link from 'next/link';

import cx from 'classnames';

import './styles.scss';

const TagsList = ({ title, tags, onClick }) => (
  <div className="c-tags-list">
    {title && <h5>{title}</h5>}
    <div className="c-tags-list__group">
      {tags.map(({ id, name, link, active = false } = {}) => (
        <span key={id}>
          {link ? (
            <Link href={link}>
              <a className={cx('tag', { active })}>{name}</a>
            </Link>
          ) : (
            <button
              className={cx('tag', { active })}
              onClick={() => onClick(id)}
            >
              {name}
            </button>
          )}
        </span>
      ))}
    </div>
  </div>
);

TagsList.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string,
      active: PropTypes.bool,
    })
  ).isRequired,
  onClick: PropTypes.func,
};

export default TagsList;
