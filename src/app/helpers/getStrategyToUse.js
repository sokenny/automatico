export const defaultStrategyParams = {
  OPERATION_EXPIRY_TIME: 2500,
  // POSITION_STRUCTURE: "[{'weight': .5}, {'weight': .5}]",
  POSITION_STRUCTURE: "[{'weight': 1}]",
  START_GAP_PERCENTAGE: 0,
  INCLUDE_BLACKBOX_LOGS: 0,
  UPDATE_SL_EVERY: 0,
  CANDLE_SIZE_MINUTES: 5,
  LEVERAGE: 1,
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

function getStrategyToUse(generatedStrategy) {
  // Filter out default params that are already set in generatedStrategy
  // We do this because we want to use the generatedStrategy's params if they are set,
  // but we want filteredDefaultParams to be at the end of the object
  const filteredDefaultParams = Object.entries(defaultStrategyParams)
    .filter(([key]) => !(key in generatedStrategy))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  return {
    ...generatedStrategy,
    INITIAL_BALANCE: generatedStrategy.IDEAL_TRADE_AMOUNT,
    TICK_INTERVAL_MINUTES:
      defaultTickFromCandleSize[generatedStrategy.CANDLE_SIZE_MINUTES] || 1,
    ...filteredDefaultParams,
  };
}

export default getStrategyToUse;
