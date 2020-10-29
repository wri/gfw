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
    ? // if it's 'Other: <input>', we make sure that the input is not empty
      !!subsector.split('Other:')[1].trim()
    : // otherwise we just check the subsector
      !!subsector);
