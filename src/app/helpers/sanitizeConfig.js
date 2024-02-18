function sanitizeConfig(config) {
  const copy = { ...config };
  if (!copy?.SIGNAL_TRIGGER?.cross_percentage) {
    copy.SIGNAL_TRIGGER.cross_percentage = 0;
  }
  if (!copy?.SIGNAL_TRIGGER?.position_type) {
    copy.SIGNAL_TRIGGER.position_type = 'long';
  }
  return copy;
}

export default sanitizeConfig;
