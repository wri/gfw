import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { initGA, logPageView } from 'app/analytics';
import cx from 'classnames';

import Meta from 'app/meta';
import FooterEmbed from 'components/footer-embed';

import './styles.scss';

export default class LayoutEmbed extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    children: PropTypes.node.isRequired,
    pageLink: PropTypes.string.isRequired,
    hideFooter: PropTypes.bool,
    fullScreen: PropTypes.bool,
    titleParams: PropTypes.object,
    descriptionParams: PropTypes.object,
  };

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const {
      title,
      description,
      keywords,
      children,
      fullScreen,
      hideFooter,
      pageLink,
      titleParams,
      descriptionParams,
    } = this.props;

    return (
      <Fragment>
        <Meta
          title={title}
          description={description}
          titleParams={titleParams}
          descriptionParams={descriptionParams}
          keywords={keywords}
        />
        <div className={cx('l-embed', { 'full-screen': fullScreen })}>
          {children}
          {!hideFooter && <FooterEmbed pageLink={pageLink} />}
        </div>
      </Fragment>
    );
  }
}
