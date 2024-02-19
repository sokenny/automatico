function validateStrategy(payload) {
  console.log('payload en validator: ', payload);
  const errors = [];
  const isMACrossTypeIndicator =
    payload.INDICATOR === 'SMA' || payload.INDICATOR === 'EMA';

  // Validate PAIR
  if (!payload.PAIR.endsWith('USDT')) {
    errors.push({
      field: 'PAIR',
      message: 'The trading pair must be a USDT pair.',
    });
  }

  // Validate INDICATOR
  const validIndicators = ['CCI', 'RSI', 'SMA', 'EMA'];
  if (!validIndicators.includes(payload.INDICATOR)) {
    errors.push({
      field: 'INDICATOR',
      message: 'Invalid indicator. Valid options are: CCI, RSI, SMA, EMA.',
    });
  }

  // Validate SIGNAL_TRIGGER
  try {
    const signalTrigger = payload.SIGNAL_TRIGGER;
    const validDirections = ['above_to_below', 'below_to_above'];
    const validPositions = ['long', 'short'];

    if (!validDirections.includes(signalTrigger.cross_direction)) {
      errors.push({
        field: 'SIGNAL_TRIGGER.cross_direction',
        message:
          'Invalid cross direction. Valid options are: above_to_below, below_to_above.',
      });
    }

    if (!validPositions.includes(signalTrigger.position_type)) {
      errors.push({
        field: 'SIGNAL_TRIGGER.position_type',
        message: 'Invalid position type. Valid options are: long, short.',
      });
    }

    if (
      typeof signalTrigger.target_value !== 'number' &&
      !isMACrossTypeIndicator
    ) {
      errors.push({
        field: 'SIGNAL_TRIGGER.target_value',
        message: 'The target value must be a number.',
      });
    }

    // Optional: Validate cross_percentage and period if needed
  } catch (e) {
    errors.push({
      field: 'SIGNAL_TRIGGER',
      message: 'Invalid JSON format.',
    });
  }

  // Validate TAKE_PROFIT and STOP_LOSS
  if (!Number.isInteger(payload.TAKE_PROFIT) || payload.TAKE_PROFIT <= 0) {
    errors.push({
      field: 'TAKE_PROFIT',
      message: 'The take profit value must be a positive integer.',
    });
  }

  if (!Number.isInteger(payload.STOP_LOSS) || payload.STOP_LOSS <= 0) {
    errors.push({
      field: 'STOP_LOSS',
      message: 'The stop loss value must be a positive integer.',
    });
  }

  // Validate MAX_WEIGHT_ALLOCATION
  if (
    !Number.isInteger(payload.MAX_WEIGHT_ALLOCATION) ||
    payload.MAX_WEIGHT_ALLOCATION < 1
  ) {
    errors.push({
      field: 'MAX_WEIGHT_ALLOCATION',
      message: 'MAX_WEIGHT_ALLOCATION must be at least 1.',
    });
  }

  // Validate IDEAL_TRADE_AMOUNT
  if (
    !Number.isInteger(payload.IDEAL_TRADE_AMOUNT) ||
    payload.IDEAL_TRADE_AMOUNT <= 0
  ) {
    errors.push({
      field: 'IDEAL_TRADE_AMOUNT',
      message: 'IDEAL_TRADE_AMOUNT must be a positive integer.',
    });
  }

  // Validate CANDLE_SIZE_MINUTES
  const validCandleSizes = [1, 3, 5, 15, 30, 60];
  if (!validCandleSizes.includes(payload.CANDLE_SIZE_MINUTES)) {
    errors.push({
      field: 'CANDLE_SIZE_MINUTES',
      message:
        'Invalid CANDLE_SIZE_MINUTES. Valid values are: 1, 3, 5, 15, 30, 60.',
    });
  }

  // Validate LEVERAGE
  if (
    payload.LEVERAGE < 1 ||
    payload.LEVERAGE > 10 ||
    !Number.isInteger(payload.LEVERAGE)
  ) {
    errors.push({
      field: 'LEVERAGE',
      message: 'LEVERAGE must be a positive integer between 1-10.',
    });
  }

  return errors;
}

export default validateStrategy;

//   // Example usage
//   const examplePayload = {
//     "PAIR": "BTCUSDT",
//     "INDICATOR": "CCI",
//     "SIGNAL_TRIGGER": "{'cross_direction': 'below_to_above', 'position_type': 'long', 'target_value': 200}",
//     "TAKE_PROFIT": 5,
//     "STOP_LOSS": 3,
//     "MAX_WEIGHT_ALLOCATION": 1,
//     "IDEAL_TRADE_AMOUNT": 1000,
//     "CANDLE_SIZE_MINUTES": 5,
//     "LEVERAGE": 2
//   };

//   console.log(validateStrategy(examplePayload));
