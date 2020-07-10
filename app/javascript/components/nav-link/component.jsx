import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withRouter } from 'next/router';
import cx from 'classnames';

class NavLink extends PureComponent {
  static propTypes = {
    activeClassName: PropTypes.string,
    router: PropTypes.object,
    activeShallow: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    activeClassName: '',
  };

  render() {
    const {
      activeClassName,
      children,
      activeShallow,
      router,
      ...props
    } = this.props;
    const { pathname, asPath: oldPath } = router;
    const child = Children.only(children);
    const asPath = oldPath?.split('#')[0];
    const isActiveLink =
      (asPath === props.href || asPath === props.as) && !!activeClassName;
    const baseRoute = pathname?.split('/')[1];
    const basePath = props?.href?.split('/')[1];
    const isActiveShallow =
      activeShallow && baseRoute === basePath && activeClassName;
    const isActive = isActiveLink || isActiveShallow;

    return (
      <Link {...props}>
        {React.cloneElement(child, {
          className: cx(child.props.className, {
            [activeClassName]: isActive,
          }),
        })}
      </Link>
    );
  }
}

export default withRouter(NavLink);
