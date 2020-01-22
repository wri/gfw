/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { composeValidators } from 'components/forms/validations';

import FieldWrapper from 'components/forms/components/field-wrapper';

import './styles.scss';

class Select extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    required: PropTypes.bool
  };

  render() {
    const {
      name,
      label,
      validate,
      placeholder,
      options,
      hidden,
      required
    } = this.props;
    const allOptions = options
      ? [{ label: placeholder, value: '' }, ...options]
      : [];

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="select"
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <select className="c-form-select" {...input}>
              {allOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Select;
