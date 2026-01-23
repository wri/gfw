import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileForm from '../component';

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

    const reset = () => {
      setValues(initialValues || {});
      setSubmitSucceeded(false);
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
}));

jest.mock('providers/country-data-provider', () => ({
  __esModule: true,
  default: () => null,
}));

describe('ProfileForm', () => {
  const mockSaveProfile = jest.fn();
  const mockCountries = [
    { label: 'United States', value: 'USA' },
    { label: 'Brazil', value: 'BRA' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile form fields', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    expect(screen.getByText(/your profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders email input with validation', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders sector select field', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    expect(screen.getByLabelText(/sector/i)).toBeInTheDocument();
  });

  it('renders country select field', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('renders interests checkbox field', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    expect(screen.getByText(/what topics are you interested in/i)).toBeInTheDocument();
  });

  it('shows success message after submission', async () => {
    mockSaveProfile.mockResolvedValue({});
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );

    const submitButton = screen.getByText(/save/i);
    submitButton.click();

    // Wait for success state
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(
      screen.getByText(/thank you for updating your my gfw profile/i)
    ).toBeInTheDocument();
  });

  it('renders with initial values', () => {
    const initialValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
        initialValues={initialValues}
      />
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('renders delete profile link', () => {
    render(
      <ProfileForm
        saveProfile={mockSaveProfile}
        countries={mockCountries}
      />
    );
    expect(screen.getByText(/email us/i)).toBeInTheDocument();
  });
});
