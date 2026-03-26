export const checkUserProfileFilled = ({
  email,
  fullName,
  lastName,
  sector,
} = {}) => !!email && (!!fullName || !!lastName) && !!sector;
