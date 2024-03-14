function sanitizeConfig(config) {
  const copy = { ...config };
  if (!copy?.ENTRY_TRIGGER?.cross_percentage) {
    copy.ENTRY_TRIGGER.cross_percentage = 0;
  }
  if (!copy?.ENTRY_TRIGGER?.position_type) {
    copy.ENTRY_TRIGGER.position_type = 'long';
  }
  return copy;
}

export default sanitizeConfig;
