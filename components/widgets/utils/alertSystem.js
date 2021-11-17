export const handleAlertSystem = (params, settingsKey) => {
  const setting = params[settingsKey];
  if (setting === 'glad_l' || params?.gladLOnly === 1) return 'glad_l';
  if (setting === 'glad_s' || params?.gladSOnly === 1) return 'glad_s';
  if (setting === 'radd' || params?.raddOnly === 1) return 'radd';
  return 'all';
};
