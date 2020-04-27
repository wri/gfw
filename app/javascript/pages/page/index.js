import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initGA, logPageView, logEvent } from 'app/analytics';
import checkBrowser from 'utils/browser';
import cx from 'classnames';
import useRouter from 'app/router';
import { MediaContextProvider } from 'utils/responsive';

import Meta from 'layouts/meta';
import NavLink from 'components/nav-link';
import Header from 'components/header';
import Footer from 'components/footer';
import ContactUsModal from 'components/modals/contact-us';
import ClimateModal from 'components/modals/climate';
import Cookies from 'components/cookies';

import { setContactUsModalOpen } from 'components/modals/contact-us/actions';
import { setSearchQuery } from 'layouts/search/actions';

import './styles.scss';

class Layout extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    keywords: PropTypes.string,
    children: PropTypes.node.isRequired,
    hideHeader: PropTypes.bool,
    hideFooter: PropTypes.bool,
    fullScreen: PropTypes.bool,
    loggedIn: PropTypes.bool,
    loggingIn: PropTypes.bool,
    setSearchQuery: PropTypes.func.isRequired,
    setContactUsModalOpen: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();

    const isValidBrowser = checkBrowser();
    if (!isValidBrowser) {
      useRouter().push('/browser-support');
    }
  }

  render() {
    const {
      title,
      description,
      keywords,
      hideFooter,
      hideHeader,
      fullScreen,
      loggedIn,
      loggingIn,
      setSearchQuery: setSearch,
      setContactUsModalOpen: setContactUsOpen,
    } = this.props;
    const router = useRouter();

    return (
      <div className="l-page">
        <MediaContextProvider>
          <Meta title={title} description={description} keywords={keywords} />
          {!hideHeader && (
            <Header
              className="header"
              setQueryToUrl={(query) => {
                router.push('/search');
                setSearch(query);
              }}
              openContactUsModal={() => setContactUsOpen(true)}
              loggedIn={loggedIn}
              loggingIn={loggingIn}
              NavLinkComponent={({ children, className, ...props }) => (
                <NavLink {...props}>
                  <a className={className}>{children}</a>
                </NavLink>
              )}
            />
          )}
          <div className={cx('page-container', { 'full-screen': fullScreen })}>
            {this.props.children}
          </div>
          {!hideFooter && !fullScreen && (
            <Footer
              NavLinkComponent={({ href, children, className }) => (
                <NavLink href={href}>
                  <a className={className}>{children}</a>
                </NavLink>
              )}
              openContactUsModal={() => setContactUsOpen(true)}
            />
          )}
          <Cookies onClose={() => logEvent('acceptCookies')} />
          <ContactUsModal />
          <ClimateModal />
        </MediaContextProvider>
      </div>
    );
  }
}

export default connect(
  ({ myGfw }) => ({
    loggedIn: myGfw?.data?.loggedIn,
    loggingIn: myGfw?.loading,
  }),
  { setContactUsModalOpen, setSearchQuery }
)(Layout);
