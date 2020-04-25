import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initGA, logPageView, logEvent } from 'app/analytics';
import checkBrowser from 'utils/browser';
import cx from 'classnames';
import { withRouter } from 'next/router';
import { MediaContextProvider } from 'utils/responsive';

import Meta from 'layouts/meta';
import NavLink from 'components/nav-link';
import Header from 'components/header';
import Footer from 'components/footer';
import ContactUsModal from 'components/modals/contact-us';
import ClimateModal from 'components/modals/climate';
import Cookies from 'components/cookies';

import './styles.scss';

class Layout extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    children: PropTypes.node.isRequired,
    router: PropTypes.object.isRequired,
    hideHeader: PropTypes.bool,
    hideFooter: PropTypes.bool,
    fullScreen: PropTypes.bool,
    loggedIn: PropTypes.bool,
    loggingIn: PropTypes.bool
  };

  componentDidMount() {
    const { router } = this.props;

    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();

    const isValidBrowser = checkBrowser();
    if (!isValidBrowser) {
      router.push('/browser-support');
    }
  }

  render() {
    const {
      title,
      description,
      keywords,
      router,
      hideFooter,
      hideHeader,
      fullScreen,
      loggedIn,
      loggingIn
    } = this.props;
    const { pathname, query } = router;

    return (
      <div className="l-page">
        <MediaContextProvider>
          <Meta
            title={title}
            description={description}
            keywords={keywords}
          />
          {!hideHeader && (
            <Header
              className="header"
              setQueryToUrl={(searchQuery) => {
                router.pushDynamic({
                  pathname: '/search',
                  query: { query: searchQuery },
                });
              }}
              openContactUsModal={() => {
                router.pushDynamic({
                  pathname,
                  query: { ...query, contactUs: true },
                  hash:
                    typeof window !== 'undefined' ? window.location.hash : null,
                });
              }}
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
              openContactUsModal={() => {
                router.pushDynamic({
                  pathname,
                  query: { ...query, contactUs: true },
                  hash:
                    typeof window !== 'undefined' ? window.location.hash : null,
                });
              }}
            />
          )}
          <Cookies onClose={() => logEvent('acceptCookies')} />
          <ContactUsModal
            open={!!query.contactUs}
            onClose={() => {
              delete query.contactUs;
              router.pushDynamic({
                pathname,
                query,
                hash:
                  typeof window !== 'undefined' ? window.location.hash : null,
              });
            }}
          />
          <ClimateModal
            open={!!query.gfwclimate}
            onClose={() => {
              delete query.gfwclimate;
              router.pushDynamic({
                pathname,
                query,
                hash:
                  typeof window !== 'undefined' ? window.location.hash : null,
              });
            }}
            openContactUsModal={() => {
              router.pushDynamic({
                pathname,
                query: { ...query, contactUs: true },
                hash:
                  typeof window !== 'undefined' ? window.location.hash : null,
              });
            }}
          />
        </MediaContextProvider>
      </div>
    );
  }
}

export default withRouter(
  connect(({ myGfw }) => ({
    loggedIn: myGfw?.data?.loggedIn,
    loggingIn: myGfw?.loading,
  }))(Layout)
);
