/* eslint-disable */
import React from 'react';
import { Field } from 'redux-form';

export const renderRadio = ({
  input,
  id,
  label,
  type,
  meta: { touched, error }
}) => {
  return (
    <div className={`field radio ${touched && error ? 'error' : ''}`}>
      <input id={id} {...input} type={type} />
      <label htmlFor={id}>
        <span /> {label}
      </label>
    </div>
  );
};

export const renderInput = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error }
}) => (
  <div className={`field input ${touched && error ? 'error' : ''}`}>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={placeholder} type={type} />
    </div>
  </div>
);

export const renderSelect = ({
  input,
  label,
  options,
  placeholder,
  meta: { touched, error }
}) => (
  <div className={`field select ${touched && error ? 'error' : ''}`}>
    <label>{label}</label>
    <div>
      <Field
        name={input.name}
        component="select"
        value={placeholder ? 'placeholder' : options[0].key}
      >
        {(placeholder
          ? [{ name: placeholder, key: 'placeholder' }, ...options]
          : options
        ).map((option, i) => {
          return (
            <option key={i} value={option.key}>
              {option.name}
            </option>
          );
        })}
      </Field>
    </div>
  </div>
);

export const renderTextarea = ({
  input,
  label,
  placeholder,
  meta: { touched, error }
}) => (
  <div className={`field textarea ${touched && error ? 'error' : ''}`}>
    <label>{label}</label>
    <div>
      <Field name={input.name} component="textarea" placeholder={placeholder} />
    </div>
  </div>
);
