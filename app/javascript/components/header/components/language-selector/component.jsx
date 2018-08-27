import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import './styles.scss';

class LangSelector extends PureComponent {
  handleClickOutside = () => {
    const { setShowLangSelector } = this.props;
    setShowLangSelector(false);
  };

  render() {
    const { className, languages, handleLangSelect } = this.props;

    return (
      <ul className={`c-lang-selector ${className || ''}`}>
        {languages.map(l => (
          <li key={l.code}>
            <button onClick={() => handleLangSelect(l.code)}>{l.name}</button>
          </li>
        ))}
      </ul>
    );
  }
}

LangSelector.propTypes = {
  className: PropTypes.string,
  languages: PropTypes.array,
  handleLangSelect: PropTypes.func,
  setShowLangSelector: PropTypes.func
};

export default onClickOutside(LangSelector);
