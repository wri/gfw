import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import Input from 'components/forms/components/input';
import Submit from 'components/forms/components/submit';

import { email } from 'components/forms/validations';

import './styles.scss';

class LoginForm extends PureComponent {
  static propTypes = {
    sendLoginForm: PropTypes.func.isRequired,
    sendRegisterUser: PropTypes.func.isRequired,
    sendResetPassword: PropTypes.func.isRequired,
    initialValues: PropTypes.object
  };

  state = {
    showForm: 'login',
    successMessage: ''
  };

  onSuccess = message => {
    this.setState({ successMessage: message });
  };

  render() {
    const {
      sendLoginForm,
      sendRegisterUser,
      sendResetPassword,
      initialValues
    } = this.props;
    const { showForm, successMessage: success } = this.state;

    const formMeta = {
      login: {
        submit: 'login',
        submitFunc: sendLoginForm,
        altView: 'register',
        altLabel: 'Register',
        successMessage: 'Login successful'
      },
      register: {
        submit: 'register',
        submitFunc: sendRegisterUser,
        altView: 'login',
        altLabel: 'I have an account',
        successMessage: 'Account registered'
      },
      reset: {
        submit: 'reset',
        submitFunc: sendResetPassword,
        altView: 'login',
        altLabel: 'Sign in',
        successMessage: 'Email sent'
      }
    };

    const { submit, submitFunc, altView, altLabel, successMessage } = formMeta[
      showForm
    ];

    return (
      <Form
        onSubmit={data =>
          submitFunc({ data, success: () => this.onSuccess(successMessage) })
        }
        initialValues={initialValues}
      >
        {({
          handleSubmit,
          submitting,
          submitFailed,
          submitError,
          form: { reset }
        }) => (
          <div className="c-login-form">
            <Fragment>
              <form className="c-login-form" onSubmit={handleSubmit}>
                <Input
                  name="email"
                  type="email"
                  label="email"
                  placeholder="example@globalforestwatch.org"
                  validate={[email]}
                  required
                />
                {showForm !== 'reset' && (
                  <Input
                    name="password"
                    label="password"
                    type="password"
                    placeholder="**********"
                    required
                  />
                )}
                {showForm === 'register' && (
                  <Input
                    name="repeatPassword"
                    label="repeat password"
                    type="password"
                    placeholder="**********"
                    required
                  />
                )}
                {showForm === 'login' && (
                  <div
                    className="forgotten-password"
                    onClick={() => {
                      this.setState({ showForm: 'reset' });
                      reset();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    Forgotten your password?
                  </div>
                )}
                <div className="submit-actions">
                  <div
                    className="change-form"
                    onClick={() => {
                      this.setState({ showForm: altView });
                      reset();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {altLabel}
                  </div>
                  <Submit
                    valid
                    submitting={submitting}
                    submitFailed={submitFailed}
                    submitError={submitError}
                    success={success}
                  >
                    {submit}
                  </Submit>
                </div>
              </form>
            </Fragment>
          </div>
        )}
      </Form>
    );
  }
}

export default LoginForm;
