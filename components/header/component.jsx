/* eslint-disable react/jsx-curly-newline */
import PropTypes from 'prop-types';
import useRouter from 'utils/router';

import { Header as HeaderComponent } from '@worldresources/gfw-components';

import NavLink from 'components/nav-link';
import gnwBadge from 'assets/logos/gfw.png';

import config from './config';

const Header = ({ fullScreen, slim, notifications }) => {
  const { push, pushQuery, asPath, query } = useRouter();

  return (
    <HeaderComponent
      className="c-header"
      slim={slim}
      customLogo={gnwBadge}
      navMain={config.navMain}
      NavLinkComponent={({ children: headerChildren, className, ...props }) =>
        props.href ? (
          <NavLink {...props}>
            <a className={className}>{headerChildren}</a>
          </NavLink>
        ) : null
      }
      notifications={notifications}
      setQueryToUrl={(search) => push(`/search/?query=${search}`)}
      fullScreen={fullScreen}
      afterLangSelect={(lang) =>
        pushQuery({
          pathname: `${asPath?.split('?')?.[0]}`,
          query: { ...query, lang },
        })
      }
    />
  );
};

Header.propTypes = {
  setSearchQuery: PropTypes.func,
  fullScreen: PropTypes.bool,
  href: PropTypes.string,
  slim: PropTypes.bool,
  notifications: PropTypes.array,
};

export default Header;
