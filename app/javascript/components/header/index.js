import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';

import config from './config';
import Component from './component';

class HeaderContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { showPanel, showMyGfw, showLangSelector } = props;

    const txData = JSON.parse(localStorage.getItem('txlive:languages'));
    const txLang = JSON.parse(localStorage.getItem('txlive:selectedlang'));
    const languages =
      txData &&
      txData.source &&
      [txData.source].concat(txData.translation).map(l => ({
        label: l.name,
        value: l.code
      }));

    this.state = {
      showPanel,
      showMyGfw,
      showLangSelector,
      showHeader: false,
      languages,
      lang: txLang
    };
  }

  toggleMenu = () => {
    this.setState({ showHeader: !this.state.showHeader });
  };

  setShowPanel = showPanel => {
    this.setState({
      showPanel,
      showMyGfw: false,
      showLangSelector: false
    });
  };

  setShowMyGfw = showMyGfw => {
    this.setState({
      showMyGfw,
      showLangSelector: false
    });
  };

  setShowLangSelector = showLangSelector => {
    this.setState({
      showLangSelector,
      showMyGfw: false
    });
  };

  handleLangSelect = lang => {
    localStorage.setItem('txlive:selectedlang', `"${lang}"`);
    this.setState({ lang });
    this.setShowLangSelector(false);
  };

  render() {
    const { languages, lang } = this.state;
    const activeLang = languages && languages.find(l => l.value === lang);
    return createElement(Component, {
      ...this.state,
      ...this.props,
      setShowPanel: this.setShowPanel,
      setShowMyGfw: this.setShowMyGfw,
      setShowLangSelector: this.setShowLangSelector,
      handleLangSelect: this.handleLangSelect,
      toggleMenu: this.toggleMenu,
      activeLang,
      ...config
    });
  }
}

HeaderContainer.propTypes = {
  showPanel: PropTypes.bool,
  showMyGfw: PropTypes.bool,
  showLangSelector: PropTypes.bool
};

export default HeaderContainer;
