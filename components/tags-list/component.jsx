import PropTypes from 'prop-types';
import Link from 'next/link';

import cx from 'classnames';

const TagsList = ({ title, tags, onClick }) => (
  <div className="c-tags-list">
    {title && <h5>{title}</h5>}
    <div className="c-tags-list__group">
      {tags.map(
        ({
          id,
          name,
          link,
          active = false,
          shallow = false,
          replace = false,
          scroll = false,
        } = {}) => (
          <span key={id}>
            {link ? (
              <Link
                href={link}
                shallow={shallow}
                replace={replace}
                scroll={scroll}
              >
                <a
                  role="button"
                  tabIndex={0}
                  className={cx('tag', { active })}
                  onClick={() => onClick && onClick(id)}
                >
                  {name}
                </a>
              </Link>
            ) : (
              <button
                className={cx('tag', { active })}
                onClick={() => onClick && onClick(id)}
              >
                {name}
              </button>
            )}
          </span>
        )
      )}
    </div>
  </div>
);

TagsList.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      active: PropTypes.bool,
      // Link specific
      link: PropTypes.string,
      shallow: PropTypes.bool,
      replace: PropTypes.bool,
      scroll: PropTypes.bool,
    })
  ).isRequired,
  onClick: PropTypes.func,
};

export default TagsList;
