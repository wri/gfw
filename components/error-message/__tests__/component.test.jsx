import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../component';

// Mock btoa for error code generation
global.btoa = jest.fn((str) => Buffer.from(str, 'binary').toString('base64'));

describe('ErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders with title', () => {
    render(<ErrorMessage title="Error occurred" />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ErrorMessage
        title="Error"
        description="Something went wrong"
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders description with HTML parsing when description contains <p> tag', () => {
    const { container } = render(
      <ErrorMessage
        title="Error"
        description="<p>HTML description</p>"
      />
    );
    // ReactHtmlParser will parse the HTML
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('renders description without <p> tag wrapper when description does not contain <p>', () => {
    const { container } = render(
      <ErrorMessage
        title="Error"
        description="Plain text description"
      />
    );
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it('renders error code when errors prop is provided', () => {
    const errors = { code: 'ERR001', message: 'Test error' };
    const { container } = render(<ErrorMessage title="Error" errors={errors} />);
    
    const errorCodeSection = screen.getByText(/Error code:/);
    expect(errorCodeSection).toBeInTheDocument();
    
    // Error code should be base64 encoded JSON - it's a child div, not a sibling
    const errorCodeDiv = container.querySelector('.c-error-message__error-code div');
    expect(errorCodeDiv).toBeInTheDocument();
    expect(errorCodeDiv.textContent).toBeTruthy();
  });

  it('does not render error code when errors prop is not provided', () => {
    render(<ErrorMessage title="Error" />);
    expect(screen.queryByText(/Error code:/)).not.toBeInTheDocument();
  });

  it('renders icon with correct class', () => {
    const { container } = render(<ErrorMessage title="Error" />);
    const icon = container.querySelector('.error-tree');
    expect(icon).toBeInTheDocument();
  });

  it('generates error code with current datetime and errors', () => {
    const errors = { message: 'Test error' };
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    const DateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    // Clear previous calls
    global.btoa.mockClear();
    
    render(<ErrorMessage title="Error" errors={errors} />);
    
    expect(global.btoa).toHaveBeenCalled();
    // btoa was called with JSON.stringify({ datetime, info: errors })
    const callArg = global.btoa.mock.calls[0][0];
    // Parse the JSON string that was passed to btoa
    const decoded = JSON.parse(callArg);
    expect(decoded.info).toEqual(errors);
    // Date gets stringified to ISO string, so compare as string
    expect(decoded.datetime).toBe(mockDate.toISOString());
    
    DateSpy.mockRestore();
  });

  it('handles errors as array', () => {
    const errors = ['Error 1', 'Error 2'];
    render(<ErrorMessage title="Error" errors={errors} />);
    
    const errorCodeSection = screen.getByText(/Error code:/);
    expect(errorCodeSection).toBeInTheDocument();
  });
});
