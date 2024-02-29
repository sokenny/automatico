const strategyFieldsTooltips = {
  'PAIR':
    'The cryptocurrency pair you want to trade with, always paired with USDT.',
  'IDEAL_TRADE_AMOUNT':
    'The preferred amount of USDT to use for each trade. The system will use this amount if the balance allows; otherwise, it will use the maximum available.',
  'INITIAL_BALANCE': 'The initial balance to start trading with.',
  'TAKE_PROFIT':
    'Set a target profit percentage at which your trade will be automatically closed to secure earnings.',
  'INDICATOR': 'The technical indicator for your trading strategy.',
  'STOP_LOSS':
    'Define a maximum loss percentage at which your trade will be automatically closed to minimize losses.',
  'SIGNAL_TRIGGER.cross_direction':
    "Specifies the direction of the cross required to trigger a trade signal: 'Above to below' for a downward cross, or 'Below to above' for an upward cross.",
  'SIGNAL_TRIGGER.cross_percentage':
    'The percentage above or below a moving average that the price must cross to trigger the signal.',
  'SIGNAL_TRIGGER.position_type':
    "Indicates the type of trade to open when the signal triggers: 'long' for opening a position with the expectation of price increase, or 'short' for opening a position with the expectation of price decrease.",
  'SIGNAL_TRIGGER.period':
    'The window size (number of candles) used for calculating the indicator. If not specified, a default value is used.',
  'SIGNAL_TRIGGER.target_value':
    'The indicator value that must be crossed to activate the signal. Applicable for strategies based on indicators like RSI or CCI.',
  'CANDLE_SIZE_MINUTES':
    'Determines the timeframe of the candles used for analysis.',
  'LEVERAGE': 'The leverage level for your trades.',
  'MAX_WEIGHT_ALLOCATION':
    'Limits how many trades can be open simultaneously. Greatly depends on your available balance.  Setting to 1 means only one trade will be open at any given time.',
  'START_GAP_PERCENTAGE':
    'Once the entry signal triggers, if you set a start gap percentage, the system will wait for the price to move in your favor by this percentage before opening the trade. It is like a spread commonly used to get even better entry points.',
  'OPERATION_EXPIRY_TIME':
    'The time in seconds after which the operation will be closed if it has not been executed. Mainly used together with START_GAP_PERCENTAGE. If not specified, a default value is used.',
};

export default strategyFieldsTooltips;
