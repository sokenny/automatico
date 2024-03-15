import validIndicators from './validIndicators';

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

const strategyValidations = {
  'PAIR': (strategy) => isValidPair(strategy.PAIR),
  'IDEAL_TRADE_AMOUNT': (strategy) =>
    isPositiveInteger(strategy.IDEAL_TRADE_AMOUNT),
  'INITIAL_BALANCE': (strategy) => isPositiveInteger(strategy.INITIAL_BALANCE),
  'INDICATOR': (strategy) => validIndicators.includes(strategy.INDICATOR),
  'MAX_WEIGHT_ALLOCATION': (strategy) =>
    isPositiveInteger(strategy.MAX_WEIGHT_ALLOCATION),
  'LEVERAGE': (strategy) => isValidLeverage(strategy.LEVERAGE),
  'TAKE_PROFIT': (strategy) => {
    if (strategy.EXIT_TRIGGER) return true;
    return isPositiveInteger(strategy.TAKE_PROFIT);
  },
  'STOP_LOSS': (strategy) => {
    if (strategy.EXIT_TRIGGER) return true;
    return isPositiveInteger(strategy.STOP_LOSS);
  },
  'OPERATION_EXPIRY_TIME': (strategy) =>
    isPositiveOrZeroInteger(strategy.OPERATION_EXPIRY_TIME),
  'START_GAP_PERCENTAGE': (strategy) =>
    isPositiveOrZeroInteger(strategy.START_GAP_PERCENTAGE),
  'ENTRY_TRIGGER.period': (strategy) =>
    isPositiveInteger(strategy.ENTRY_TRIGGER?.period),
  'ENTRY_TRIGGER.cross_percentage': (strategy) =>
    isNumber(strategy.ENTRY_TRIGGER?.cross_percentage),
  'ENTRY_TRIGGER.target_value': (strategy) => {
    if (['RSI', 'CCI'].includes(strategy.INDICATOR)) {
      return isNumber(strategy.ENTRY_TRIGGER?.target_value);
    }
    return true;
  },
  'ENTRY_TRIGGER.cross_direction': (strategy) =>
    ['above_to_below', 'below_to_above'].includes(
      strategy.ENTRY_TRIGGER?.cross_direction,
    ),
  'ENTRY_TRIGGER.position_type': (strategy) =>
    ['long', 'short'].includes(strategy.ENTRY_TRIGGER?.position_type),
  'ENTRY_TRIGGER.band_to_cross': (strategy) =>
    ['upper', 'lower'].includes(strategy.ENTRY_TRIGGER?.band_to_cross),
  'ENTRY_TRIGGER.period_deviation': (strategy) =>
    isPositiveOrZeroInteger(strategy.ENTRY_TRIGGER?.period_deviation),
  // EMPIEZA EXIT
  'EXIT_TRIGGER.period': (strategy) =>
    isPositiveInteger(strategy.EXIT_TRIGGER?.period),
  'EXIT_TRIGGER.cross_percentage': (strategy) =>
    isNumber(strategy.EXIT_TRIGGER?.cross_percentage),
  'EXIT_TRIGGER.target_value': (strategy) => {
    if (['RSI', 'CCI'].includes(strategy.INDICATOR)) {
      return isNumber(strategy.EXIT_TRIGGER?.target_value);
    }
    return true;
  },
  'EXIT_TRIGGER.cross_direction': (strategy) =>
    ['above_to_below', 'below_to_above'].includes(
      strategy.EXIT_TRIGGER?.cross_direction,
    ),
  'EXIT_TRIGGER.band_to_cross': (strategy) =>
    ['upper', 'lower'].includes(strategy.EXIT_TRIGGER?.band_to_cross),
  'EXIT_TRIGGER.period_deviation': (strategy) =>
    isPositiveOrZeroInteger(strategy.EXIT_TRIGGER?.period_deviation),
};

export default strategyValidations;
