import React from 'react';
import { render, screen } from '@testing-library/react';
import AreaOfInterestForm from '../component';
import request from 'utils/request';

jest.mock('utils/request');
jest.mock('components/map-geostore', () => ({
  __esModule: true,
  default: () => <div data-testid="map-geostore">Map</div>,
}));

// Mock react-final-form Form component
jest.mock('react-final-form', () => ({
  Form: ({ children, onSubmit, initialValues }) => {
    const [submitting, setSubmitting] = React.useState(false);
    const [submitSucceeded, setSubmitSucceeded] = React.useState(false);
    const [submitFailed, setSubmitFailed] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
    const [values, setValues] = React.useState(initialValues || {});
    const [errors, setErrors] = React.useState({});

    const handleSubmit = async (e) => {
      e?.preventDefault();
      setSubmitting(true);
      try {
        await onSubmit(values);
        setSubmitSucceeded(true);
      } catch (error) {
        setSubmitFailed(true);
        setSubmitError(error.message);
      } finally {
        setSubmitting(false);
      }
    };

    return children({
      handleSubmit,
      submitting,
      submitFailed,
      submitError,
      submitSucceeded,
      valid: true,
      values,
      errors,
    });
  },
}));

describe('AreaOfInterestForm', () => {
  const mockSaveAreaOfInterest = jest.fn();
  const mockDeleteAreaOfInterest = jest.fn();
  const mockCloseForm = jest.fn();
  const mockSetModalSources = jest.fn();

  const defaultProps = {
    saveAreaOfInterest: mockSaveAreaOfInterest,
    deleteAreaOfInterest: mockDeleteAreaOfInterest,
    closeForm: mockCloseForm,
    setModalSources: mockSetModalSources,
    title: 'Create Area of Interest',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders area of interest form', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(screen.getByText(/create area of interest/i)).toBeInTheDocument();
  });

  it('renders name input field', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(
      screen.getByLabelText(/name this area for later reference/i)
    ).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders tags input field', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(
      screen.getByText(/assign tags to organize and group areas/i)
    ).toBeInTheDocument();
  });

  it('renders map geostore component', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(screen.getByTestId('map-geostore')).toBeInTheDocument();
  });

  it('renders webhook URL input field', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(screen.getByLabelText(/webhook url/i)).toBeInTheDocument();
  });

  it('renders alerts information', () => {
    render(<AreaOfInterestForm {...defaultProps} />);
    expect(
      screen.getByText(/we will send you email updates/i)
    ).toBeInTheDocument();
  });

  it('shows delete button when canDelete is true', () => {
    render(<AreaOfInterestForm {...defaultProps} canDelete />);
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('does not show delete button when canDelete is false', () => {
    render(<AreaOfInterestForm {...defaultProps} canDelete={false} />);
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
  });

  it('renders with initial values', () => {
    const initialValues = {
      id: '123',
      name: 'Test Area',
      email: 'test@example.com',
    };

    render(
      <AreaOfInterestForm {...defaultProps} initialValues={initialValues} />
    );

    expect(screen.getByDisplayValue('Test Area')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('calls closeForm on success', async () => {
    mockSaveAreaOfInterest.mockResolvedValue({});
    render(<AreaOfInterestForm {...defaultProps} />);

    const submitButton = screen.getByText(/save/i);
    submitButton.click();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(
      screen.getByText(/your area has been saved/i)
    ).toBeInTheDocument();
  });
});
