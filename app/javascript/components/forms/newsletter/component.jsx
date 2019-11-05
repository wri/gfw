import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import { Field, reduxForm } from 'redux-form';

import { renderSelect, renderInput } from 'components/forms/form-fields';
import 'components/forms/form-styles.scss';

const validate = values => {
  const errors = {};
  if (
    !values.email ||
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = true;
  }
  // if (!values.country) {
  //   errors.country = true;
  // }
  if (!values.message) {
    errors.message = true;
  }

  return errors;
};

const placeHolderValidator = value =>
  (value && value === 'placeholder' ? 'Select a country' : undefined);

class NewsletterForm extends PureComponent {
  static propTypes = {
    submitting: PropTypes.bool,
    countries: PropTypes.array
  };

  render() {
    const { countries, submitting } = this.props;

    return (
      <form
        className="c-form"
        // onSubmit={handleSubmit(values => console.log(values))}
        // action="https://connect.wri.org/l/120942/2019-07-18/4d6vw2"
        // id="pardot-form"
      >
        <Field
          name="First name"
          type="text"
          label="First name *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="Last name"
          type="text"
          label="Last name *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="email"
          type="email"
          label="EMAIL *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="Organization"
          type="text"
          label="Organization"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="City"
          type="text"
          label="City *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="country"
          label="Country *"
          options={countries}
          component={renderSelect}
          validate={[placeHolderValidator]}
          placeholder="Select a country"
        />
        <h4>Im interested in (check all that apply)*</h4>
        <Field
          name="pardot_extra_field"
          type="text"
          label="Comments *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="success_location"
          type="text"
          label="Success location *"
          value="/thank-you"
          component={renderInput}
        />
        <Button className="submit-btn" type="submit" disabled={submitting}>
          Subscribe
        </Button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'newsletter',
  validate,
  initialValues: {
    signup: 'false',
    success_location: 'http://www.globalforestwatch.org/thank-you'
  }
})(NewsletterForm);
