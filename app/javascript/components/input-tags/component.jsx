import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './styles.scss';

function InputTags(props) {
  const { tags, onChange: setTags, className } = props;
  const inputRef = useRef(null);

  const removeTag = i => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const inputKeyDown = e => {
    const val = e.target.value;

    if ((e.key === 'Enter' || e.key === ',') && val) {
      if (e.key === ',' && val) {
        e.preventDefault();
      }
      if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else if (e.key === 'Backspace' && !val) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={cx('c-input-tags', className)}>
      <ul className="tags">
        {tags &&
          tags.map((tag, i) => (
            <li key={tag}>
              {tag}
              <button
                type="button"
                onClick={() => {
                  removeTag(i);
                }}
              >
                +
              </button>
            </li>
          ))}
        <li className="tags-input">
          <input type="text" onKeyDown={inputKeyDown} ref={inputRef} />
        </li>
      </ul>
    </div>
  );
}

InputTags.propTypes = {
  tags: PropTypes.array,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default InputTags;
