/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import cx from 'classnames';

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
    required: PropTypes.bool,
    multiple: PropTypes.bool
  };

  render() {
    const {
      name,
      label,
      validate,
      placeholder,
      options,
      hidden,
      required,
      multiple
    } = this.props;

    const allOptions = options || [];
    const optionWithPlaceholder = placeholder
      ? [{ label: placeholder, value: '' }, ...allOptions]
      : allOptions;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="select"
        type="select"
        multiple={multiple}
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <select
              className={cx('c-form-select', { multiple })}
              {...input}
              multiple={multiple}
            >
              {optionWithPlaceholder.map(option => (
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
