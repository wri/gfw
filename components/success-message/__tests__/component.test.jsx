import React from 'react';
import { render, screen } from '@testing-library/react';
import Thankyou from '../component';

describe('SuccessMessage (Thankyou)', () => {
  it('renders with title', () => {
    render(<Thankyou title="Success!" />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Thankyou
        title="Success!"
        description="Operation completed successfully"
      />
    );
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('renders description with HTML parsing when description contains <p> tag', () => {
    const { container } = render(
      <Thankyou
        title="Success!"
        description="<p>HTML description</p>"
      />
    );
    // ReactHtmlParser will parse the HTML
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('renders description wrapped in <p> when description does not contain <p>', () => {
    const { container } = render(
      <Thankyou
        title="Success!"
        description="Plain text description"
      />
    );
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it('does not render description when not provided', () => {
    const { container } = render(<Thankyou title="Success!" />);
    const paragraphs = container.querySelectorAll('p');
    // Only the title should be present, no description paragraph
    expect(paragraphs.length).toBe(0);
  });

  it('renders success tree image', () => {
    const { container } = render(<Thankyou title="Success!" />);
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'success-tree');
  });

  it('renders title as h1', () => {
    const { container } = render(<Thankyou title="Success!" />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Success!');
  });
});
