import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { initGA, handlePageTrack } from 'analytics';
import { checkBrowser } from 'utils/browser';
import { MediaContextProvider } from 'utils/responsive';

import Button from 'components/ui/button';
import gfwLogo from 'assets/logos/gfw.png';

import Head from 'layouts/head';

import 'styles/styles.scss';
import './styles.scss';

class App extends PureComponent {
  static propTypes = {
    fullScreen: PropTypes.bool,
    children: PropTypes.node,
    router: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    exploreLink: PropTypes.string,
    isGFW: PropTypes.bool,
    isTrase: PropTypes.bool,
  };

  componentDidMount() {
    const { router } = this.props;

    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    handlePageTrack();

    const isValidBrowser = checkBrowser();
    if (!isValidBrowser) {
      router.push('/browser-support');
    }
  }

  render() {
    const {
      fullScreen,
      children,
      title,
      description,
      keywords,
      exploreLink,
      isGFW,
      isTrase,
    } = this.props;

    return (
      <>
        <Head
          title={title}
          description={description}
          keywords={keywords}
          noIndex
        />
        <MediaContextProvider>
          <div
            className={cx('l-embed', {
              '-trase': isTrase,
              '-full-screen': fullScreen,
            })}
          >
            <a className="page-logo" href="/" target="_blank">
              <img src={gfwLogo} alt="Global Forest Watch" />
            </a>
            <div className="page">{children}</div>
            {!isGFW && !isTrase && (
              <div className="embed-footer">
                <p>For more info</p>
                <Button className="embed-btn" extLink={exploreLink}>
                  EXPLORE ON GFW
                </Button>
              </div>
            )}
          </div>
        </MediaContextProvider>
      </>
    );
  }
}

export default App;
