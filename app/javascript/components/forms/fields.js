/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import cx from 'classnames';
import { Field } from 'redux-form';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';

import './styles.scss';

export const renderField = ({
  input,
  label,
  meta: { touched, error },
  children,
  hidden
}) => (
  <div className={cx('c-form-field', { error: touched && error }, { hidden })}>
    <div className="label">
      <label htmlFor={input.name}>{label}</label>
      {touched && error && <span>{error}</span>}
    </div>
    <div>{children}</div>
  </div>
);

export const renderInput = ({ input, placeholder, type, ...params }) =>
  renderField({
    children: <input {...input} />,
    input,
    ...params
  });

export const renderTextarea = ({ input, placeholder, type, ...params }) =>
  renderField({
    children: (
      <Field name={input.name} component="textarea" placeholder={placeholder} />
    ),
    input,
    ...params
  });

export const renderSelect = ({
  input,
  placeholder,
  type,
  options,
  ...params
}) => {
  const allOptions = options
    ? [{ label: placeholder, value: 'placeholder' }, ...options]
    : [];

  return renderField({
    children: (
      <Field name={input.name} component="select">
        {allOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    ),
    input,
    ...params
  });
};

export const renderRadio = ({ input, type, options, ...params }) =>
  renderField({
    children: (
      <Fragment>
        {options &&
          options.map(option => (
            <div key={option.value} className="radio-option">
              <Field
                id={`radio-${option.value}`}
                name={input.name}
                component="input"
                type="radio"
                value={option.value}
              />
              <label className="radio-label" htmlFor={`radio-${option.value}`}>
                <span />
                {option.label}
              </label>
            </div>
          ))}
      </Fragment>
    ),
    input,
    ...params
  });

export const renderCheckList = ({ input, type, options, ...params }) =>
  renderField({
    children: (
      <Fragment>
        {options &&
          options.map(option => (
            <div key={option.value} className="checkbox-option">
              <Field
                name={option.value}
                id={`checkbox-${option.value}`}
                component="input"
                type="checkbox"
                value={option.value}
              />
              <label
                className="checkbox-label"
                htmlFor={`checkbox-${option.value}`}
              >
                <span />
                {option.label}
              </label>
            </div>
          ))}
      </Fragment>
    ),
    input,
    ...params
  });

export const renderSubmit = ({ children, submitting, submitFailed, valid }) => (
  <div className="c-form-field submit">
    <Button className="submit-btn" type="submit" disabled={submitting}>
      {submitting ? <Loader className="submit-loader" /> : children}
    </Button>
    {!valid && submitFailed && <span>Required fields are empty!</span>}
  </div>
);
