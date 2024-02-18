import toPythonDictStyle from './toPythonDictStyle';
import getStrategyToUse from './getStrategyToUse';
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
  console.log('formState: ', formState);
  console.log('config --: ', config);
  console.log('period creado! ', period);
  const payload = {
    ...defaultHiddenStrategyParams,
    ...getStrategyToUse(config),
    SIGNAL_TRIGGER: toPythonDictStyle(config.SIGNAL_TRIGGER),
    PERIOD: period,
  };

  return payload;
}

export default buildBacktestRequestPayload;
