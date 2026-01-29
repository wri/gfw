import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../component';

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
      form: { reset },
    });
  },
}));

describe('LoginForm', () => {
  const mockLoginUser = jest.fn();
  const mockRegisterUser = jest.fn();
  const mockResetUserPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders password input in login view', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('switches to register view', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    const switchButton = screen.getByText(/not a member/i);
    fireEvent.click(switchButton);
    // Password field should not be visible in register view initially
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('switches to reset password view', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    const forgotPassword = screen.getByText(/forgot password/i);
    fireEvent.click(forgotPassword);
    expect(screen.getByText(/to reset your password/i)).toBeInTheDocument();
  });

  it('calls loginUser on login form submission', async () => {
    mockLoginUser.mockResolvedValue({});
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );

    const submitButton = screen.getByText('login');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalled();
    });
  });

  it('renders social login buttons', () => {
    render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
      />
    );
    expect(screen.getByText(/login with twitter/i)).toBeInTheDocument();
    expect(screen.getByText(/login with facebook/i)).toBeInTheDocument();
    expect(screen.getByText(/login with google/i)).toBeInTheDocument();
  });

  it('renders simple variant when simple prop is true', () => {
    const { container } = render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
        simple
      />
    );
    expect(container.querySelector('.c-login-form')).toHaveClass('simple');
  });

  it('applies custom className', () => {
    const { container } = render(
      <LoginForm
        loginUser={mockLoginUser}
        registerUser={mockRegisterUser}
        resetUserPassword={mockResetUserPassword}
        className="custom-class"
      />
    );
    expect(container.querySelector('.c-login-form')).toHaveClass('custom-class');
  });
});
