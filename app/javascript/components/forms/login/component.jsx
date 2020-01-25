import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import Input from 'components/forms/components/input';
import Submit from 'components/forms/components/submit';
import Button from 'components/ui/button';
import Thankyou from 'components/thankyou';

import { email } from 'components/forms/validations';

import './styles.scss';

const AUTH_URL = `${process.env.GFW_API}/auth`;

const socialButtons = [
  {
    label: 'Twitter',
    value: 'twitter'
  },
  {
    label: 'Facebook',
    value: 'facebook'
  },
  {
    label: 'Google',
    value: 'google'
  }
];

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
        successMessage: 'Login successful',
        confirmation: {
          title: '',
          description: ''
        }
      },
      register: {
        submit: 'register',
        submitFunc: sendRegisterUser,
        altView: 'login',
        altLabel: 'login',
        successMessage: 'Account registered',
        confirmation: {
          title:
            'Thank you for registering, please check your email and confirm your account.',
          description:
            "You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
        }
      },
      reset: {
        submit: 'reset',
        submitFunc: sendResetPassword,
        altView: 'login',
        altLabel: 'Login',
        confirmation: {
          title:
            'Thank you. Please, check your inbox and follow instructions to reset your password.',
          description:
            "You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
        }
      }
    };

    const {
      submit,
      submitFunc,
      altView,
      altLabel,
      successMessage,
      confirmation
    } = formMeta[showForm];

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
          submitSucceeded,
          form: { reset }
        }) => (
          <div className="c-login-form">
            <div className="row">
              {submitSucceeded && showForm !== 'login' ? (
                <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                  <Thankyou {...confirmation} />
                  <Button
                    className="reset-form-btn"
                    onClick={() => {
                      reset();
                      this.setState({ showForm: 'login' });
                    }}
                  >
                    login
                  </Button>
                </div>
              ) : (
                <Fragment>
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <h1>Login to My GFW</h1>
                    <h3>
                      Log in is required so you can view, manage, and delete
                      your subscriptions.
                    </h3>
                  </div>
                  <div className="column small-12 medium-4 medium-offset-1 large-3 large-offset-2">
                    <div className="social-btns">
                      {socialButtons.map(s => (
                        <Button
                          key={s.value}
                          className={`social-btn -${s.value}`}
                          target="_self"
                          extLink={`${AUTH_URL}/${
                            s.value
                          }?applications=gfw&callbackUrl=${
                            window.location.href
                          }`}
                        >
                          Login with {s.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="column small-12 medium-5 medium-offset-1 large-4 large-offset-1">
                    {showForm === 'reset' && (
                      <p>
                        To reset your password introduce your email and follow
                        the instructions.
                      </p>
                    )}
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
                          Forgot password
                        </div>
                      )}
                      <div className="submit-actions">
                        <Button
                          className="change-form"
                          theme="theme-button-light"
                          onClick={() => {
                            this.setState({ showForm: altView });
                            reset();
                          }}
                        >
                          {altLabel}
                        </Button>
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
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}
      </Form>
    );
  }
}

export default LoginForm;
