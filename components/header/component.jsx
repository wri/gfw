import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Header as HeaderComponent } from 'gfw-components';

import NavLink from 'components/nav-link';

import './styles.scss';

const Header = ({ setModalContactUsOpen, setSearchQuery, fullScreen }) => {
  const { push } = useRouter();

  return (
    <HeaderComponent
      className="c-header"
      NavLinkComponent={({ children: headerChildren, className, ...props }) =>
        props.href ? (
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
  );
};

Header.propTypes = {
  setModalContactUsOpen: PropTypes.func,
  setSearchQuery: PropTypes.func,
  fullScreen: PropTypes.bool,
  href: PropTypes.string,
};

export default Header;
