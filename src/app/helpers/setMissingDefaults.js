function getDefaultPeriod(strategy) {
  if (
    strategy.INDICATOR === 'CCI' ||
    strategy.INDICATOR === 'SMA' ||
    strategy.INDICATOR === 'EMA'
  ) {
    return 20;
  }
  if (strategy.INDICATOR === 'RSI') {
    return 14;
  }
  return 20;
}

function setMissingDefaults(strategy) {
  if (!strategy.TICK_INTERVAL_MINUTES) {
    strategy.TICK_INTERVAL_MINUTES = 1;
  }
  if (!strategy.ENTRY_TRIGGER.period) {
    strategy.ENTRY_TRIGGER.period = getDefaultPeriod(strategy);
  }
  return strategy;
}

export default setMissingDefaults;
