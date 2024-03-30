export const defaultStrategyParams = {
  OPERATION_EXPIRY_TIME: 2500,
  POSITION_STRUCTURE: "[{'weight': 1}]",
  START_GAP_PERCENTAGE: 0,
  INCLUDE_BLACKBOX_LOGS: 0,
  UPDATE_SL_EVERY: 0,
  CANDLE_SIZE_MINUTES: 5,
  LEVERAGE: 1,
  IDEAL_TRADE_AMOUNT: 1000,
  INITIAL_BALANCE: 1000,
};

const defaultTickFromCandleSize = {
  1: 1,
  3: 1,
  5: 1,
  15: 1,
  30: 1,
  60: 5,
  120: 5,
  240: 15,
  360: 15,
  480: 15,
  720: 15,
  1440: 30,
  4320: 30,
  10080: 60,
  43200: 60,
};

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

function getStrategyToUse(generatedStrategy) {
  const toReturn = {
    ...generatedStrategy,
    INITIAL_BALANCE: generatedStrategy.IDEAL_TRADE_AMOUNT,
    TICK_INTERVAL_MINUTES:
      defaultTickFromCandleSize[generatedStrategy.CANDLE_SIZE_MINUTES] || 1,
  };

  if (!toReturn.TICK_INTERVAL_MINUTES) {
    toReturn.TICK_INTERVAL_MINUTES = 1;
  }
  if (!toReturn.ENTRY_TRIGGER.period) {
    toReturn.ENTRY_TRIGGER.period = getDefaultPeriod(toReturn);
  }

  if (!toReturn?.ENTRY_TRIGGER?.cross_percentage) {
    toReturn.ENTRY_TRIGGER.cross_percentage = 0;
  }

  if (
    toReturn.EXIT_TRIGGER &&
    (toReturn.INDICATOR === 'SMA' || toReturn.INDICATOR === 'EMA') &&
    !toReturn.EXIT_TRIGGER.cross_percentage
  ) {
    toReturn.EXIT_TRIGGER.cross_percentage = 0;
  }

  if (
    typeof toReturn.EXIT_TRIGGER === 'object' &&
    toReturn.EXIT_TRIGGER !== null &&
    toReturn.ENTRY_TRIGGER.period
  ) {
    toReturn.EXIT_TRIGGER.period = toReturn.ENTRY_TRIGGER.period;
  }

  if (!toReturn?.ENTRY_TRIGGER?.position_type) {
    toReturn.ENTRY_TRIGGER.position_type = 'long';
  }

  if (toReturn.EXIT_TRIGGER) {
    toReturn.TAKE_PROFIT = null;
    toReturn.STOP_LOSS = null;
  }

  if (!toReturn.IDEAL_TRADE_AMOUNT) {
    toReturn.IDEAL_TRADE_AMOUNT = defaultStrategyParams.IDEAL_TRADE_AMOUNT;
  }

  if (!toReturn.INITIAL_BALANCE) {
    toReturn.INITIAL_BALANCE = defaultStrategyParams.INITIAL_BALANCE;
  }

  if (!toReturn.CANDLE_SIZE_MINUTES) {
    toReturn.CANDLE_SIZE_MINUTES = defaultStrategyParams.CANDLE_SIZE_MINUTES;
  }

  if (typeof toReturn.START_GAP_PERCENTAGE !== 'number') {
    toReturn.START_GAP_PERCENTAGE = defaultStrategyParams.START_GAP_PERCENTAGE;
  }

  if (typeof toReturn.OPERATION_EXPIRY_TIME !== 'number') {
    toReturn.OPERATION_EXPIRY_TIME =
      defaultStrategyParams.OPERATION_EXPIRY_TIME;
  }

  if (!toReturn.POSITION_STRUCTURE) {
    toReturn.POSITION_STRUCTURE = defaultStrategyParams.POSITION_STRUCTURE;
  }

  if (typeof toReturn.INCLUDE_BLACKBOX_LOGS !== 'number') {
    toReturn.INCLUDE_BLACKBOX_LOGS =
      defaultStrategyParams.INCLUDE_BLACKBOX_LOGS;
  }

  if (typeof toReturn.UPDATE_SL_EVERY !== 'number') {
    toReturn.UPDATE_SL_EVERY = defaultStrategyParams.UPDATE_SL_EVERY;
  }

  console.log('returning: ', toReturn);

  return toReturn;
}

export default getStrategyToUse;
