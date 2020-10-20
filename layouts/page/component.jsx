import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { initAnalytics, handlePageTrack } from 'analytics';
import { MediaContextProvider } from 'utils/responsive';
import useRouter from 'utils/router';
import moment from 'moment';

import { Footer, Header } from 'gfw-components';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import { getMomentLangCode } from 'utils/lang';

import Cookies from 'components/cookies';
import ContactUsModal from 'components/modals/contact-us';
import NavLink from 'components/nav-link';
import ClimateModal from 'components/modals/climate';
import FiresModal from 'components/modals/fires';

import Head from 'layouts/head';

import 'styles/styles.scss';
import './styles.scss';

class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    router: PropTypes.object,
    fullScreen: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    noIndex: PropTypes.bool,
    embed: PropTypes.bool,
    setSearchQuery: PropTypes.func,
    lang: PropTypes.string,
  };

  static defaultProps = {
    showHeader: true,
    showFooter: true,
  };

  componentDidMount() {
    if (!window.ANALYTICS_INITIALIZED) {
      initAnalytics();
      window.ANALYTICS_INITIALIZED = true;
    }
    handlePageTrack();

    moment.locale(getMomentLangCode(this.props.lang));
  }

  handleLangSelect = (lang) => {
    moment.locale(getMomentLangCode(lang));
  };

  render() {
    const {
      children,
      fullScreen,
      showHeader,
      showFooter,
      title,
      description,
      keywords,
      noIndex,
      setSearchQuery,
    } = this.props;
    const { push } = useRouter();

    return (
      <>
        <Head
          title={title}
          description={description}
          keywords={keywords}
          noIndex={noIndex}
        />
        <MediaContextProvider>
          <div className={cx('l-root', { '-full-screen': fullScreen })}>
            {showHeader && (
              <Header
                className="header-wrapper"
                NavLinkComponent={({
                  children: headerChildren,
                  className,
                  ...props
                }) =>
                  props?.href ? (
                    <NavLink {...props}>
                      <a className={className}>{headerChildren}</a>
                    </NavLink>
                  ) : null}
                openContactUsModal={() => setModalContactUsOpen(true)}
                setQueryToUrl={(query) => {
                  push('/search/', `/search/?query=${query}`);
                  setSearchQuery(query);
                }}
                fullScreen={fullScreen}
              />
            )}
            <div className="page">{children}</div>
            <FiresModal />
            <ClimateModal />
            <ContactUsModal />
            {showFooter && (
              <div className="page-footer">
                <Footer
                  openContactUsModal={() => setModalContactUsOpen(true)}
                />
              </div>
            )}
            <Cookies />
          </div>
        </MediaContextProvider>
      </>
    );
  }
}

export default App;
