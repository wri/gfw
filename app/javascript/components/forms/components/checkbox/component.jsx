/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import uniqueId from 'lodash/uniqueId';

import { composeValidators } from 'components/forms/validations';

import FieldWrapper from 'components/forms/components/field-wrapper';

import './styles.scss';

class Checkbox extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    required: PropTypes.bool
  };

  render() {
    const { name, label, validate, options, hidden, required } = this.props;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="input"
        type="checkbox"
      >
        {({ meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <div className="c-form-checkbox">
              {options &&
                options.map(option => {
                  const id = uniqueId(`checkbox-${option.value}-`);
                  return (
                    <div key={option.value} className="checkbox-option">
                      <Field
                        name={name}
                        id={id}
                        component="input"
                        type="checkbox"
                        // undefined := don't overwrite value prop
                        // this turns the values array into a single value
                        value={options.length > 1 ? option.value : undefined}
                      />
                      <label className="checkbox-label" htmlFor={id}>
                        <span />
                        {option.label}
                      </label>
                    </div>
                  );
                })}
            </div>
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Checkbox;
