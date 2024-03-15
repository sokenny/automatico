import toPythonDictStyle from './toPythonDictStyle';
import getPeriodForBacktest from './getPeriodForBacktest';

const defaultHiddenStrategyParams = {
  STRATEGY: 'reversion',
};

function buildBacktestRequestPayload(formState) {
  const config = formState.strategy;
  const period = getPeriodForBacktest({
    period: formState.backtestPeriod,
    customDates: {
      from: formState.customPeriodFrom,
      to: formState.customPeriodTo,
    },
  });
  const payload = {
    ...defaultHiddenStrategyParams,
    ...config,
    ENTRY_TRIGGER: toPythonDictStyle(config.ENTRY_TRIGGER),
    EXIT_TRIGGER: config.EXIT_TRIGGER
      ? toPythonDictStyle(config.EXIT_TRIGGER)
      : null,
    PERIOD: period,
  };

  return payload;
}

export default buildBacktestRequestPayload;
