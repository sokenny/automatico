function sanitizeConfig(config) {
  const copy = { ...config };
  if (!copy?.ENTRY_TRIGGER?.cross_percentage) {
    copy.ENTRY_TRIGGER.cross_percentage = 0;
  }

  if (
    copy.EXIT_TRIGGER &&
    (copy.INDICATOR === 'SMA' || copy.INDICATOR === 'EMA') &&
    !copy.EXIT_TRIGGER.cross_percentage
  ) {
    copy.EXIT_TRIGGER.cross_percentage = 0;
  }

  if (copy.EXIT_TRIGGER && copy.ENTRY_TRIGGER.period) {
    copy.EXIT_TRIGGER.period = copy.ENTRY_TRIGGER.period;
  }

  if (!copy?.ENTRY_TRIGGER?.position_type) {
    copy.ENTRY_TRIGGER.position_type = 'long';
  }

  if (copy.EXIT_TRIGGER) {
    copy.TAKE_PROFIT = null;
    copy.STOP_LOSS = null;
  }

  return copy;
}

export default sanitizeConfig;
