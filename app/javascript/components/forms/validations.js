export const required = value =>
  (value || typeof value === 'number' ? undefined : 'Required');

export const empty = value => (value ? 'You are a bot!' : undefined);

export const number = value =>
  (value && isNaN(Number(value)) ? 'Must be a number' : undefined);

export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);

export const alphaNumeric = value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined);

export const phoneNumber = value =>
  (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined);

export const composeValidators = (req, vals) => value => {
  let validations = req ? [required] : [];
  if (vals) {
    validations = validations.concat(vals);
  }

  if (validations) {
    return validations.reduce(
      (error, validator) => error || (validator ? validator(value) : undefined),
      undefined
    );
  }

  return undefined;
};
