export const handleAlertSystem = (params, settingsKey) => {
  const setting = params[settingsKey];
  if (setting === 'glad_l' || params?.gladLOnly === 1) return 'glad_l';
  if (setting === 'glad_s2' || params?.gladSOnly === 1) return 'glad_s2';
  if (setting === 'radd' || params?.raddOnly === 1) return 'radd';
  return 'all';
};
