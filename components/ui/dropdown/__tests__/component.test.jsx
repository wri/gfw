import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from '../../../__tests__/test-utils';
import DropdownContainer from '../index';

// Mock the component since it uses Downshift
jest.mock('../component', () => {
  return function MockDropdown({ options, onChange, activeLabel, placeholder }) {
    return (
      <div data-testid="dropdown">
        <button data-testid="dropdown-selector">{activeLabel || placeholder}</button>
        {options && options.map((option, index) => (
          <button
            key={index}
            data-testid={`option-${option.value}`}
            onClick={() => onChange && onChange(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

describe('DropdownContainer', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  const initialState = {
    modalMeta: {
      open: false,
      closing: false,
    },
  };

  it('renders dropdown with options from Redux', () => {
    const { getByTestId } = renderWithRedux(
      <DropdownContainer options={mockOptions} />,
      { initialState }
    );

    expect(getByTestId('dropdown')).toBeInTheDocument();
    expect(getByTestId('option-opt1')).toBeInTheDocument();
    expect(getByTestId('option-opt2')).toBeInTheDocument();
  });

  it('displays active label from Redux state', () => {
    const { getByTestId } = renderWithRedux(
      <DropdownContainer
        options={mockOptions}
        value="opt1"
      />,
      { initialState }
    );

    const selector = getByTestId('dropdown-selector');
    expect(selector).toHaveTextContent('Option 1');
  });

  it('displays noSelectedValue when no value is selected', () => {
    const { getByTestId } = renderWithRedux(
      <DropdownContainer
        options={mockOptions}
        noSelectedValue="Select an option"
      />,
      { initialState }
    );

    const selector = getByTestId('dropdown-selector');
    expect(selector).toHaveTextContent('Select an option');
  });

  it('handles modal state from Redux', () => {
    const modalOpenState = {
      modalMeta: {
        open: true,
        closing: false,
      },
    };

    const { getByTestId } = renderWithRedux(
      <DropdownContainer options={mockOptions} />,
      { initialState: modalOpenState }
    );

    expect(getByTestId('dropdown')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    const handleChange = jest.fn();
    const { getByTestId } = renderWithRedux(
      <DropdownContainer
        options={mockOptions}
        onChange={handleChange}
      />,
      { initialState }
    );

    const option1 = getByTestId('option-opt1');
    fireEvent.click(option1);

    expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
  });

  it('handles value as string', () => {
    const { getByTestId } = renderWithRedux(
      <DropdownContainer
        options={mockOptions}
        value="opt2"
      />,
      { initialState }
    );

    const selector = getByTestId('dropdown-selector');
    expect(selector).toHaveTextContent('Option 2');
  });

  it('handles value as number', () => {
    const numericOptions = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];

    const { getByTestId } = renderWithRedux(
      <DropdownContainer
        options={numericOptions}
        value={1}
      />,
      { initialState }
    );

    const selector = getByTestId('dropdown-selector');
    expect(selector).toHaveTextContent('One');
  });

  it('handles modal closing state', () => {
    const modalClosingState = {
      modalMeta: {
        open: false,
        closing: true,
      },
    };

    const { getByTestId } = renderWithRedux(
      <DropdownContainer options={mockOptions} />,
      { initialState: modalClosingState }
    );

    expect(getByTestId('dropdown')).toBeInTheDocument();
  });
});
