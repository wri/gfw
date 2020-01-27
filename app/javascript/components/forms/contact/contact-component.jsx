import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import { Field, reduxForm } from 'redux-form';

import {
  renderRadio,
  renderTextarea,
  renderSelect,
  renderInput
} from 'components/forms/form-fields';
import 'components/forms/form-styles.scss';

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
  if (!values.tool) {
    errors.tool = true;
  }
  if (!values.message) {
    errors.message = true;
  }

  return errors;
};

const topics = [
  {
    key: 'report-a-bug-or-error',
    name: 'Report a bug or error',
    placeholder:
      "Please tell us what browser and operating system you're using, including version numbers."
  },
  {
    key: 'provide-feedback',
    name: 'Provide feedback',
    placeholder: ''
  },
  {
    key: 'data-related-inquiry',
    name: 'Data-related inquiry or suggestion',
    placeholder: ''
  },
  {
    key: 'general-inquiry',
    name: 'General inquiry',
    placeholder: ''
  }
];

const tools = [
  {
    key: 'gfw',
    name: 'Global Forest Watch'
  },
  {
    key: 'gfw-pro',
    name: 'GFW Pro'
  },
  {
    key: 'fw',
    name: 'Forest Watcher'
  },
  {
    key: 'blog',
    name: 'GFW Blog'
  },
  {
    key: 'map-builder',
    name: 'GFW MapBuilder'
  },
  {
    key: 'not-applicable',
    name: 'Not applicable'
  }
];

// eslint-disable-next-line no-confusing-arrow
const placeHolderValidator = value =>
  value && value === 'placeholder' ? 'Select a topic' : undefined;
// eslint-disable-next-line no-confusing-arrow
const toolValidator = value =>
  value && value === 'placeholder' ? 'Select a tool' : undefined;

class Contact extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, handleSubmit, submitting } = this.props;
    const activeTopic =
      data &&
      data.values &&
      data.values.topic &&
      topics.find(t => t.key === data.values.topic);
    return (
      <form className="c-form" onSubmit={handleSubmit}>
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
          validate={[placeHolderValidator]}
          placeholder="Select a topic"
        />
        <Field
          name="tool"
          label="TOOL *"
          options={tools}
          component={renderSelect}
          validate={[toolValidator]}
          placeholder="Select a tool that applies"
        />
        <Field
          name="message"
          label="MESSAGE *"
          placeholder={activeTopic && activeTopic.placeholder}
          component={renderTextarea}
        />
        <h4>Interested in testing new features?</h4>
        <div className="radio">
          <p>Sign up to become an official GFW tester!</p>
          <Field
            id="signup-true"
            name="signup"
            type="radio"
            value="true"
            label="Yes, sign me up."
            component={renderRadio}
          />
          <Field
            id="signup-false"
            name="signup"
            type="radio"
            value="false"
            label="No thanks."
            component={renderRadio}
          />
        </div>
        <Button className="submit-btn" type="submit" disabled={submitting}>
          Submit
        </Button>
      </form>
    );
  }
}

Contact.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'contact',
  validate,
  initialValues: {
    signup: 'false'
  }
})(Contact);
