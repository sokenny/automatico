const defaultHiddenStrategyParams = {
  STRATEGY: 'reversion',
};

function buildBacktestRequestPayload({ config, period }) {
  const payload = {
    ...defaultHiddenStrategyParams,
    ...config,
    PERIOD: "['1 Jan, 2023', '10 Jan, 2023']", // for now we hardcode this
  };

  return payload;
}

export default buildBacktestRequestPayload;
