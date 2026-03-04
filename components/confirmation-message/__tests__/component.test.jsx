import React from 'react';
import { render, screen } from '@testing-library/react';
import Thankyou from '../component';

describe('ConfirmationMessage (Thankyou)', () => {
  it('renders with title', () => {
    render(<Thankyou title="Thank you!" />);
    expect(screen.getByText('Thank you!')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Thankyou
        title="Thank you!"
        description="Your submission was received"
      />
    );
    expect(screen.getByText('Your submission was received')).toBeInTheDocument();
  });

  it('renders error icon when error prop is true', () => {
    const { container } = render(
      <Thankyou title="Error" error />
    );
    const icon = container.querySelector('.error-tree');
    expect(icon).toBeInTheDocument();
  });

  it('renders success image when error prop is false', () => {
    const { container } = render(
      <Thankyou title="Success" error={false} />
    );
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'thank-you-tree');
  });

  it('renders success image when error prop is not provided', () => {
    const { container } = render(<Thankyou title="Success" />);
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'thank-you-tree');
  });

  it('does not render error icon when error is false', () => {
    const { container } = render(
      <Thankyou title="Success" error={false} />
    );
    const icon = container.querySelector('.error-tree');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders description with HTML parsing', () => {
    const { container } = render(
      <Thankyou
        title="Thank you!"
        description="<p>HTML description</p>"
      />
    );
    // ReactHtmlParser will parse the HTML
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('renders title as h1', () => {
    const { container } = render(<Thankyou title="Thank you!" />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Thank you!');
  });

  it('renders message wrapper with correct class', () => {
    const { container } = render(<Thankyou title="Thank you!" />);
    const message = container.querySelector('.message');
    expect(message).toBeInTheDocument();
  });
});
