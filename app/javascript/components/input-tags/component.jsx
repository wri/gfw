import React, { useState, useRef } from 'react';
import './styles.scss';

function InputTags() {
  const [tags, setTags] = useState([]);
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
      // this.tagInput.value = null;
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else if (e.key === 'Backspace' && !val) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="input-tag">
      <ul className="input-tag__tags">
        {tags.map((tag, i) => (
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
        <li className="input-tag__tags__input">
          <input type="text" onKeyDown={inputKeyDown} ref={inputRef} />
        </li>
      </ul>
    </div>
  );
}

export default InputTags;
