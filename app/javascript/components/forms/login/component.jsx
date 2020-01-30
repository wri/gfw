import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';

import Input from 'components/forms/components/input';
import Submit from 'components/forms/components/submit';
import Button from 'components/ui/button';
import ConfirmationMessage from 'components/confirmation-message';
import Error from 'components/forms/components/error';

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
    loginUser: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    resetUserPassword: PropTypes.func.isRequired,
    simple: PropTypes.bool,
    initialValues: PropTypes.object
  };

  state = {
    showForm: 'login'
  };

  onSuccess = message => {
    this.setState({ successMessage: message });
  };

  render() {
    const {
      registerUser,
      resetUserPassword,
      loginUser,
      initialValues,
      simple
    } = this.props;
    const { showForm } = this.state;

    const formMeta = {
      login: {
        submit: 'login',
        submitFunc: loginUser,
        altView: 'register',
        altLabel: 'Not a member? <b>Sign up!</b>',
        confirmation: {
          title: '',
          description: ''
        }
      },
      register: {
        submit: 'register',
        submitFunc: registerUser,
        altView: 'login',
        altLabel: 'Already joined? <b>Sign in!</b>',
        confirmation: {
          title:
            'Thank you for registering, please check your email and confirm your account.',
          description:
            "You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
        }
      },
      reset: {
        submit: 'reset',
        submitFunc: resetUserPassword,
        altView: 'login',
        altLabel: 'Already joined? <b>Sign in!</b>',
        confirmation: {
          title:
            'Thank you. Please, check your inbox and follow instructions to reset your password.',
          description:
            "You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
        }
      }
    };

    const { submit, submitFunc, altView, altLabel, confirmation } = formMeta[
      showForm
    ];

    return (
      <Form onSubmit={submitFunc} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          submitFailed,
          submitError,
          submitSucceeded,
          valid,
          form: { reset }
        }) => (
          <div className={cx('c-login-form', { simple })}>
            <div className="row">
              {submitSucceeded && showForm !== 'login' ? (
                <div className="column small-12">
                  <ConfirmationMessage {...confirmation} />
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
                  <div className="column small-12">
                    {!simple && <h1>Login to My GFW</h1>}
                    <h3>
                      Log in is required so you can view, manage, and delete
                      your subscriptions.
                    </h3>
                  </div>
                  <div className="column small-12 medium-5">
                    <div className="social-btns">
                      {socialButtons.map(s => (
                        <Button
                          key={s.value}
                          className={`social-btn -${s.value}`}
                          target="_self"
                          extLink={`${AUTH_URL}/${
                            s.value
                          }?applications=gfw&token=true&callbackUrl=${
                            window.location.href
                          }`}
                        >
                          Login with {s.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="column small-12 medium-6 medium-offset-1">
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
                      <Error
                        valid={valid}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      />
                      <div className="submit-actions">
                        <Submit submitting={submitting}>{submit}</Submit>
                        <button
                          className="change-form"
                          theme="theme-button-light"
                          onClick={e => {
                            e.preventDefault();
                            this.setState({ showForm: altView });
                            reset();
                          }}
                        >
                          {ReactHtmlParser(altLabel)}
                        </button>
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
