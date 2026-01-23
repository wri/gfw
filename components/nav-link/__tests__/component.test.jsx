import React from 'react';
import { render, screen } from '@testing-library/react';
import NavLink from '../component';

// Mock next/router withRouter HOC
const mockRouter = {
  pathname: '/dashboard',
  asPath: '/dashboard',
  query: {},
};

jest.mock('next/router', () => ({
  withRouter: (Component) => (props) => (
    <Component {...props} router={mockRouter} />
  ),
}));

// Mock next/link to pass through all props
jest.mock('next/link', () => {
  return ({ children, ...props }) => {
    return <a {...props}>{children}</a>;
  };
});

describe('NavLink', () => {
  beforeEach(() => {
    // Reset router mock
    mockRouter.pathname = '/dashboard';
    mockRouter.asPath = '/dashboard';
    mockRouter.query = {};
  });

  it('renders link with children', () => {
    render(
      <NavLink href="/dashboard">
        <a>Dashboard</a>
      </NavLink>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('applies activeClassName when href matches current path', () => {
    render(
      <NavLink href="/dashboard" activeClassName="active">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('active');
  });

  it('applies activeClassName when as prop matches current asPath', () => {
    render(
      <NavLink href="/dashboard" as="/dashboard" activeClassName="active">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('active');
  });

  it('does not apply activeClassName when href does not match', () => {
    const { container } = render(
      <NavLink href="/settings" activeClassName="active">
        <a>Settings</a>
      </NavLink>
    );
    const link = container.querySelector('a');
    expect(link).not.toHaveClass('active');
  });

  it('applies activeClassName with activeShallow when base routes match', () => {
    mockRouter.pathname = '/dashboard/analytics';
    mockRouter.asPath = '/dashboard/analytics';
    render(
      <NavLink href="/dashboard" activeShallow activeClassName="active">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('active');
  });

  it('handles asPath with hash', () => {
    mockRouter.asPath = '/dashboard#section';
    render(
      <NavLink href="/dashboard" activeClassName="active">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('active');
  });

  it('handles asPath with query params', () => {
    mockRouter.asPath = '/dashboard?tab=settings';
    render(
      <NavLink href="/dashboard" activeClassName="active">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('active');
  });

  it('preserves existing className on child element', () => {
    render(
      <NavLink href="/dashboard" activeClassName="active">
        <a className="existing-class">Dashboard</a>
      </NavLink>
    );
    const link = screen.getByText('Dashboard');
    expect(link).toHaveClass('existing-class');
    expect(link).toHaveClass('active');
  });

  it('does not apply activeClassName when activeClassName is empty', () => {
    const { container } = render(
      <NavLink href="/dashboard" activeClassName="">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = container.querySelector('a');
    expect(link.className).toBe('');
  });

  it('passes through other props to Link', () => {
    render(
      <NavLink href="/dashboard" data-testid="nav-link">
        <a>Dashboard</a>
      </NavLink>
    );
    const link = screen.getByTestId('nav-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
