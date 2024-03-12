function isValidPair(value) {
  return value.endsWith('USDT');
}

function isPositiveInteger(value) {
  return value > 0;
}

function isPositiveOrZeroInteger(value) {
  return value >= 0;
}

function isValidLeverage(value) {
  return value >= 0 && value <= 50;
}

function isNumber(value) {
  return !isNaN(value);
}

// TODO-p1 create enums for indicators, cross directions, etc
export const INDICATORS = ['MACD', 'SMA', 'EMA', 'RSI', 'CCI'];

const strategyValidations = {
  'PAIR': (strategy) => isValidPair(strategy.PAIR),
  'IDEAL_TRADE_AMOUNT': (strategy) =>
    isPositiveInteger(strategy.IDEAL_TRADE_AMOUNT),
  'INITIAL_BALANCE': (strategy) => isPositiveInteger(strategy.INITIAL_BALANCE),
  'INDICATOR': (strategy) => INDICATORS.includes(strategy.INDICATOR),
  'MAX_WEIGHT_ALLOCATION': (strategy) =>
    isPositiveInteger(strategy.MAX_WEIGHT_ALLOCATION),
  'LEVERAGE': (strategy) => isValidLeverage(strategy.LEVERAGE),
  'TAKE_PROFIT': (strategy) => isPositiveInteger(strategy.TAKE_PROFIT),
  'STOP_LOSS': (strategy) => isPositiveInteger(strategy.STOP_LOSS),
  'OPERATION_EXPIRY_TIME': (strategy) =>
    isPositiveOrZeroInteger(strategy.OPERATION_EXPIRY_TIME),
  'START_GAP_PERCENTAGE': (strategy) =>
    isPositiveOrZeroInteger(strategy.START_GAP_PERCENTAGE),
  'SIGNAL_TRIGGER.period': (strategy) =>
    isPositiveInteger(strategy.SIGNAL_TRIGGER?.period),
  'SIGNAL_TRIGGER.cross_percentage': (strategy) =>
    isNumber(strategy.SIGNAL_TRIGGER?.cross_percentage),
  'SIGNAL_TRIGGER.target_value': (strategy) =>
    isNumber(strategy.SIGNAL_TRIGGER?.target_value) &&
    ['RSI', 'CCI'].includes(strategy.INDICATOR),
  'SIGNAL_TRIGGER.cross_direction': (strategy) =>
    ['above_to_below', 'below_to_above'].includes(
      strategy.SIGNAL_TRIGGER?.cross_direction,
    ),
  'SIGNAL_TRIGGER.position_type': (strategy) =>
    ['long', 'short'].includes(strategy.SIGNAL_TRIGGER?.position_type),
};

export default strategyValidations;
