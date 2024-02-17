const defaultStrategyParams = {
  OPERATION_EXPIRY_TIME: 2500,
  POSITION_STRUCTURE: "[{'weight': .5}, {'weight': .5}]",
  START_GAP_PERCENTAGE: 0,
  INCLUDE_BLACKBOX_LOGS: 1,
  UPDATE_SL_EVERY: 0,
};

function getStrategyToUse(generatedStratedy) {
  return {
    ...defaultStrategyParams,
    ...generatedStratedy,
    INITIAL_BALANCE: generatedStratedy.IDEAL_TRADE_AMOUNT,
  };
}

export default getStrategyToUse;
