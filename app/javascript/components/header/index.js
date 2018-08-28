import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import config from './config';
import Component from './component';

class HeaderContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { showPanel, showMyGfw, showLangSelector } = props;

    const txData = JSON.parse(localStorage.getItem('txlive:languages'));
    const txLang = JSON.parse(localStorage.getItem('txlive'));
    const languages = [txData.source].concat(txData.translation);

    this.state = {
      showPanel,
      showMyGfw,
      showLangSelector,
      showHeader: false,
      languages,
      lang: txLang,
      loggedIn: false
    };
  }

  componentDidMount() {
    axios.get(`${process.env.GFW_API}/auth/check-logged`).then(response => {
      if (response.status < 400) {
        this.setState({ loggedIn: true });
      }
    });
  }

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
      showPanel: false,
      showLangSelector: false
    });
  };

  setShowLangSelector = showLangSelector => {
    this.setState({
      showLangSelector,
      showPanel: false,
      showMyGfw: false
    });
  };

  handleLangSelect = lang => {
    localStorage.setItem('txlive', `"${lang}"`);
    this.setState({ lang });
    this.setShowLangSelector(false);
  };

  render() {
    const { languages, lang } = this.state;
    const activeLang = languages && languages.find(l => l.code === lang);
    return createElement(Component, {
      ...this.state,
      ...this.props,
      setShowPanel: this.setShowPanel,
      setShowMyGfw: this.setShowMyGfw,
      setShowLangSelector: this.setShowLangSelector,
      handleLangSelect: this.handleLangSelect,
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
