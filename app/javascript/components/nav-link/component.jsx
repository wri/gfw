import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import withRouter from 'utils/withRouter';
import cx from 'classnames';

class NavLink extends PureComponent {
  static propTypes = {
    activeClassName: PropTypes.string,
    activeShallow: PropTypes.bool,
    children: PropTypes.node.isRequired,
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    activeClassName: '',
  };

  render() {
    const {
      activeClassName,
      children,
      router,
      activeShallow,
      ...props
    } = this.props;
    const child = Children.only(children);
    const asPath = router.asPath.split('#')[0];
    const isActiveLink =
      (asPath === props.href || asPath === props.as) && activeClassName;
    const baseRoute = router.pathname.split('/')[1];
    const basePath = props.href && props.href.split('/')[1];
    const isActiveShallow =
      activeShallow && baseRoute === basePath && activeClassName;

    return (
      <Link {...props}>
        {React.cloneElement(child, {
          className: cx(child.props.className, {
            [activeClassName]: isActiveLink || isActiveShallow,
          }),
        })}
      </Link>
    );
  }
}

export default withRouter(NavLink);
