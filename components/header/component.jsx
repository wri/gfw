import PropTypes from 'prop-types';
import useRouter from 'utils/router';

import { Header as HeaderComponent } from '@worldresources/gfw-components';

import NavLink from 'components/nav-link';

import config from './config';

const Header = ({ setModalContactUsOpen, fullScreen, slim, notifications }) => {
  const { push, pushQuery, asPath, query } = useRouter();

  return (
    <HeaderComponent
      className="c-header"
      slim={slim}
      navMain={config.navMain}
      NavLinkComponent={({ children: headerChildren, className, ...props }) =>
        props.href ? (
          <NavLink {...props}>
            <a className={className}>{headerChildren}</a>
          </NavLink>
        ) : null}
      notifications={notifications}
      openContactUsModal={() => setModalContactUsOpen(true)}
      setQueryToUrl={(search) => push(`/search/?query=${search}`)}
      fullScreen={fullScreen}
      afterLangSelect={(lang) =>
        pushQuery({
          pathname: `${asPath?.split('?')?.[0]}`,
          query: { ...query, lang },
        })}
    />
  );
};

Header.propTypes = {
  setModalContactUsOpen: PropTypes.func,
  setSearchQuery: PropTypes.func,
  fullScreen: PropTypes.bool,
  href: PropTypes.string,
  slim: PropTypes.bool,
  notifications: PropTypes.array,
};

export default Header;
