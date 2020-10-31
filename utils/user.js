export const checkUserProfileFilled = ({
  email,
  fullName,
  lastName,
  sector,
  subsector,
} = {}) =>
  !!email &&
  (!!fullName || !!lastName) &&
  !!sector &&
  subsector &&
  (subsector.includes('Other')
    ? // if 'Other: <input>', we make sure that the value is not empty
      !!subsector.split('Other:')[1].trim()
    : // otherwise we just check the subsector
      !!subsector);
