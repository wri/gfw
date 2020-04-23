import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { APP_URL } from 'utils/constants';

import './styles.scss';

class DropdownMenu extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    handleSelect: PropTypes.func,
    hideMenu: PropTypes.func,
    selected: PropTypes.object,
    NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  render() {
    const {
      className,
      options,
      handleSelect,
      hideMenu,
      selected,
      NavLinkComponent,
    } = this.props;

    return (
      <ul className={`c-dropdown-menu ${className || ''}`}>
        {options &&
          options.map((l) => (
            <li
              key={l.value || l.label}
              className={cx({ active: selected && selected.value === l.value })}
            >
              {handleSelect || l.onSelect ? (
                <button
                  onClick={(e) =>
                    l.onSelect ? l.onSelect(e) : handleSelect(l.value)}
                >
                  {l.label}
                </button>
              ) : (
                <Fragment>
                  {l.href && (
                    <Fragment>
                      {NavLinkComponent ? (
                        <NavLinkComponent
                          href={l.href}
                          as={l.as}
                          activeClassName="active"
                          className="nested"
                        >
                          <button onClick={hideMenu}>{l.label}</button>
                        </NavLinkComponent>
                      ) : (
                        <a
                          href={`${APP_URL}${l.as || l.href}`}
                          className={cx(
                            {
                              active:
                                typeof window !== 'undefined' &&
                                window.location.pathname.includes(
                                  l.as || l.href
                                ),
                            },
                            'nested'
                          )}
                        >
                          <button onClick={hideMenu}>{l.label}</button>
                        </a>
                      )}
                    </Fragment>
                  )}
                  {l.extLink && (
                    <a
                      href={l.extLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                    </a>
                  )}
                </Fragment>
              )}
            </li>
          ))}
      </ul>
    );
  }
}

export default DropdownMenu;
