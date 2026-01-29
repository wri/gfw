import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../component';
import { submitContactForm } from 'services/forms';
import axios from 'axios';

jest.mock('services/forms');
jest.mock('axios');

// Mock react-final-form Form component
jest.mock('react-final-form', () => ({
  Form: ({ children, onSubmit, initialValues }) => {
    const [submitting, setSubmitting] = React.useState(false);
    const [submitSucceeded, setSubmitSucceeded] = React.useState(false);
    const [submitFailed, setSubmitFailed] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
    const [values, setValues] = React.useState(initialValues || {});

    const handleSubmit = async (e) => {
      e?.preventDefault();
      setSubmitting(true);
      setSubmitFailed(false);
      setSubmitError(null);

      try {
        const result = await onSubmit(values);
        if (result === true) {
          setSubmitSucceeded(true);
        } else if (result && result.FORM_ERROR) {
          setSubmitFailed(true);
          setSubmitError(result.FORM_ERROR);
        }
      } catch (error) {
        setSubmitFailed(true);
        setSubmitError(error.message);
      } finally {
        setSubmitting(false);
      }
    };

    const reset = () => {
      setValues(initialValues || {});
      setSubmitSucceeded(false);
      setSubmitFailed(false);
      setSubmitError(null);
    };

    return children({
      handleSubmit,
      submitting,
      submitFailed,
      submitError,
      submitSucceeded,
      valid: true,
      values,
      form: { reset },
    });
  },
  FORM_ERROR: 'FORM_ERROR',
}));

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.Transifex = {
      live: {
        getSelectedLanguageCode: () => 'en',
      },
    };
  });

  it('renders contact form fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('renders email input with validation', () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('submits form successfully', async () => {
    submitContactForm.mockResolvedValue({});
    axios.post.mockResolvedValue({});

    render(<ContactForm />);

    const submitButton = screen.getByText(/send/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalled();
    });
  });

  it('shows success message after successful submission', async () => {
    submitContactForm.mockResolvedValue({});
    axios.post.mockResolvedValue({});

    render(<ContactForm />);

    const submitButton = screen.getByText(/send/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for contacting/i)
      ).toBeInTheDocument();
    });
  });

  it('handles form submission error', async () => {
    const errorResponse = {
      response: {
        data: {
          errors: [{ detail: 'Submission failed' }],
        },
      },
    };
    submitContactForm.mockRejectedValue(errorResponse);

    render(<ContactForm />);

    const submitButton = screen.getByText(/send/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalled();
    });
  });

  it('renders media contact information', () => {
    render(<ContactForm />);
    expect(screen.getByText(/for media inquiries/i)).toBeInTheDocument();
  });

  it('calls resetForm when provided', async () => {
    const resetForm = jest.fn();
    submitContactForm.mockResolvedValue({});
    axios.post.mockResolvedValue({});

    render(<ContactForm resetForm={resetForm} />);

    const submitButton = screen.getByText(/send/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/no thanks/i)).toBeInTheDocument();
    });

    const noThanksButton = screen.getByText(/no thanks/i);
    fireEvent.click(noThanksButton);

    expect(resetForm).toHaveBeenCalled();
  });
});
