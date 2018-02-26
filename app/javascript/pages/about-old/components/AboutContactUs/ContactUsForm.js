import React from 'react';
import { Field, reduxForm } from 'redux-form';

const validate = values => {
  const errors = {};
  if (
    !values.email ||
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = true;
  }
  if (!values.topic) {
    errors.topic = true;
  }
  if (!values.message) {
    errors.message = true;
  }

  return errors;
};

const renderInput = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error }
}) => {
  const fieldClass = `c-about-contactus__field ${
    touched && error ? 'c-about-contactus__field--error' : ''
  }`;

  return (
    <div className={fieldClass}>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={placeholder} type={type} />
      </div>
    </div>
  );
};

const renderSelect = ({ input, label, options, meta: { touched, error } }) => {
  const fieldClass = `c-about-contactus__field ${
    touched && error ? 'c-about-contactus__field--error' : ''
  }`;

  return (
    <div className={fieldClass}>
      <label>{label}</label>
      <div>
        <Field name={input.name} component="select">
          {options.map((option, i) => (
            <option key={i} value={option.key}>
              {option.name}
            </option>
          ))}
        </Field>
      </div>
    </div>
  );
};

const renderTextarea = ({
  input,
  label,
  placeholder,
  meta: { touched, error }
}) => {
  const fieldClass = `c-about-contactus__field ${
    touched && error ? 'c-about-contactus__field--error' : ''
  }`;

  return (
    <div className={fieldClass}>
      <label>{label}</label>
      <div>
        <Field
          name={input.name}
          component="textarea"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const renderRadio = ({ input, id, label, type }) => (
  <div className="c-about-contactus__radio">
    <input id={id} {...input} type={type} />
    <label htmlFor={id}>
      <span /> {label}
    </label>
  </div>
);

const ContactUsForm = props => {
  const { handleSubmit, submitting } = props;

  const topics = [
    {
      key: 'report-a-bug-or-error-on-gfw',
      name: 'Report a bug or error on GFW',
      placeholder:
        'Explain the bug or error and tell us where on the website you encountered it. What browser (e.g., Chrome version 50.0.2661.94 m) and operating system (e.g., Windows 8.1) do you use?'
    },
    {
      key: 'provide-feedback',
      name: 'Provide feedback',
      placeholder:
        'Tell us about your experience with GFW! Examples: How can we improve GFW? Why did you visit GFW? How do you use GFW? If and how is the information provided by GFW useful for your work? Are there any additional features and/or data that would be useful?  Was anything confusing or difficult to use?  Etc...'
    },
    {
      key: 'media-request',
      name: 'Media request',
      placeholder: 'How can we help you?'
    },
    {
      key: 'data-related-inquiry',
      name: 'Data-related inquiry or suggestion',
      placeholder: 'How can we help you?'
    },
    {
      key: 'gfw-commodities-inquiry',
      name: 'GFW Commodities inquiry',
      placeholder: 'How can we help you?'
    },
    {
      key: 'gfw-fires-inquiry',
      name: 'GFW Fires inquiry',
      placeholder: 'How can we help you?'
    },
    {
      key: 'gfw-climate-inquiry',
      name: 'GFW Climate inquiry',
      placeholder: 'How can we help you?'
    },
    {
      key: 'gfw-water-inquiry',
      name: 'GFW Water inquiry',
      placeholder: 'How can we help you?'
    },
    {
      key: 'general-inquiry',
      name: 'General inquiry',
      placeholder: 'How can we help you?'
    }
  ];

  return (
    <form className="c-about-contactus__form" onSubmit={handleSubmit}>
      <Field
        name="email"
        type="email"
        label="EMAIL *"
        placeholder=""
        component={renderInput}
      />
      <Field
        name="topic"
        label="TOPIC *"
        options={topics}
        component={renderSelect}
      />
      <Field
        name="message"
        label="MESSAGE *"
        placeholder="How can we help you?"
        component={renderTextarea}
      />
      <div className="c-about-contactus__field-radio">
        <div className="c-about-contactus__field-radio-title">
          Interested in testing new features on GFW?
        </div>
        <div className="c-about-contactus__field-radio-subtitle">
          Sign up and become and official GFW tester!
        </div>
        <Field
          id="c-about-contactus-signup-true"
          name="signup"
          type="radio"
          value="true"
          label="Yes, sign me up."
          component={renderRadio}
        />
        <Field
          id="c-about-contactus-signup-false"
          name="signup"
          type="radio"
          value="false"
          label="No thanks."
          component={renderRadio}
        />
      </div>
      <div>
        <button type="submit" disabled={submitting}>
          SUBMIT
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'contactUs',
  validate,
  initialValues: {
    topic: 'provide-feedback',
    signup: 'false'
  }
})(ContactUsForm);
