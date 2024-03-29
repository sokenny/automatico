import strategyValidations from './strategyValidations';
import validCandleSizes from './validCandleSizes';
import validIndicators from './validIndicators';

function validateStrategy(payload) {
  console.log('payload en validator: ', payload);
  const errors = [];

  if (!strategyValidations['PAIR'](payload)) {
    errors.push({
      field: 'PAIR',
      message: 'The trading pair must be a USDT pair.',
    });
  }

  if (!strategyValidations['INDICATOR'](payload)) {
    errors.push({
      field: 'INDICATOR',
      message:
        'Invalid indicator. Valid options are: ' +
        validIndicators.join(', ') +
        '.',
    });
  }

  try {
    if (!strategyValidations['ENTRY_TRIGGER.cross_direction'](payload)) {
      errors.push({
        field: 'ENTRY_TRIGGER.cross_direction',
        message:
          'Invalid cross direction. Valid options are: above_to_below, below_to_above.',
      });
    }

    if (!strategyValidations['ENTRY_TRIGGER.position_type'](payload)) {
      errors.push({
        field: 'ENTRY_TRIGGER.position_type',
        message: 'Invalid position type. Valid options are: long, short.',
      });
    }

    if (!strategyValidations['ENTRY_TRIGGER.target_value'](payload)) {
      errors.push({
        field: 'ENTRY_TRIGGER.target_value',
        message: 'The target value must be a number.',
      });
    }

    // Optional: Validate cross_percentage and period if needed
  } catch (e) {
    errors.push({
      field: 'ENTRY_TRIGGER',
      message: 'Invalid JSON format.',
    });
  }

  try {
    if (!strategyValidations['EXIT_TRIGGER.cross_direction'](payload)) {
      errors.push({
        field: 'EXIT_TRIGGER.cross_direction',
        message:
          'Invalid cross direction. Valid options are: above_to_below, below_to_above.',
      });
    }

    if (!strategyValidations['EXIT_TRIGGER.target_value'](payload)) {
      errors.push({
        field: 'EXIT_TRIGGER.target_value',
        message: 'The target value must be a number.',
      });
    }

    // Optional: Validate cross_percentage and period if needed
  } catch (e) {
    errors.push({
      field: 'EXIT_TRIGGER',
      message: 'Invalid JSON format.',
    });
  }

  if (!strategyValidations['TAKE_PROFIT'](payload)) {
    errors.push({
      field: 'TAKE_PROFIT',
      message: 'The take profit value must be a number greater than 0.',
    });
  }

  if (!strategyValidations['STOP_LOSS'](payload)) {
    errors.push({
      field: 'STOP_LOSS',
      message: 'The stop loss value must be a number greater than 0.',
    });
  }

  if (!strategyValidations['MAX_WEIGHT_ALLOCATION'](payload)) {
    errors.push({
      field: 'MAX_WEIGHT_ALLOCATION',
      message: 'MAX_WEIGHT_ALLOCATION must be at least 1.',
    });
  }

  if (!strategyValidations['IDEAL_TRADE_AMOUNT'](payload)) {
    errors.push({
      field: 'IDEAL_TRADE_AMOUNT',
      message: 'IDEAL_TRADE_AMOUNT must be a positive integer.',
    });
  }

  if (!validCandleSizes.includes(payload.CANDLE_SIZE_MINUTES)) {
    errors.push({
      field: 'CANDLE_SIZE_MINUTES',
      message:
        'Invalid CANDLE_SIZE_MINUTES. Valid values are: 1, 3, 5, 15, 30, 60.',
    });
  }

  if (!strategyValidations['LEVERAGE'](payload)) {
    errors.push({
      field: 'LEVERAGE',
      message: 'LEVERAGE must be a positive integer between 1-50.',
    });
  }

  return errors;
}

export default validateStrategy;
