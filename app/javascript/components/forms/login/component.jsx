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
    showForm: 'login'
  };

  render() {
    const {
      sendLoginForm,
      sendRegisterUser,
      sendResetPassword,
      initialValues
    } = this.props;
    const { showForm } = this.state;

    const formMeta = {
      login: {
        submit: 'login',
        submitFunc: sendLoginForm,
        altView: 'register',
        altLabel: 'register'
      },
      register: {
        submit: 'register',
        submitFunc: sendRegisterUser,
        altView: 'login',
        altLabel: 'I have an account'
      },
      reset: {
        submit: 'reset',
        submitFunc: sendResetPassword,
        altView: 'login',
        altLabel: 'sign in'
      }
    };

    const { submit, submitFunc, altView, altLabel } = formMeta[showForm];

    return (
      <Form onSubmit={submitFunc} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          valid,
          submitFailed,
          // submitSucceeded,
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
                <Submit
                  valid={valid}
                  submitting={submitting}
                  submitFailed={submitFailed}
                >
                  {submit}
                </Submit>
              </form>
              {showForm === 'login' && (
                <button
                  onClick={() => {
                    reset();
                    this.setState({ showForm: 'reset' });
                  }}
                >
                  Forgotten your password?
                </button>
              )}
              <button
                onClick={() => {
                  this.setState({ showForm: altView });
                  reset();
                }}
              >
                {altLabel}
              </button>
            </Fragment>
          </div>
        )}
      </Form>
    );
  }
}

export default LoginForm;
