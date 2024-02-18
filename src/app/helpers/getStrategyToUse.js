export const defaultStrategyParams = {
  OPERATION_EXPIRY_TIME: 2500,
  POSITION_STRUCTURE: "[{'weight': .5}, {'weight': .5}]",
  START_GAP_PERCENTAGE: 0,
  INCLUDE_BLACKBOX_LOGS: 1,
  UPDATE_SL_EVERY: 0,
  CANDLE_SIZE_MINUTES: 5,
  TICK_INTERVAL_MINUTES: 1,
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
    ...filteredDefaultParams,
  };
}

export default getStrategyToUse;
