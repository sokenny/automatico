'use client';

import React from 'react';
import { Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import strategyFieldsTooltips from '../../constants/strategyFieldsTooltips';
import strategyValidations from '@/app/helpers/strategyValidations';
import validCandleSizes from '@/app/helpers/validCandleSizes';
import validIndicators from '@/app/helpers/validIndicators';
import styles from './StrategyConfigFields.module.css';

const candleSizes = validCandleSizes.map((size) => ({
  value: size.toString(),
  label: `${size}m`,
}));

const indicators = validIndicators.map((indicator) => ({
  value: indicator,
  label: indicator,
}));

const bandsToCross = [
  {
    value: 'upper',
    label: 'Upper',
  },
  {
    value: 'lower',
    label: 'Lower',
  },
];

const crossDirections = [
  {
    value: 'above_to_below',
    label: 'Above to below',
  },
  {
    value: 'below_to_above',
    label: 'Below to above',
  },
];

const positionTypes = [
  {
    value: 'long',
    label: 'Long',
  },
  {
    value: 'short',
    label: 'Short',
  },
];

const StrategyConfigFields = ({
  strategy,
  setStrategy = () => {},
  isEditing = true,
}) => {
  const isMACrossType = ['EMA', 'SMA'].includes(strategy.INDICATOR);
  const isMACDType = strategy.INDICATOR === 'MACD';
  const isBBANDSType = strategy.INDICATOR === 'BBANDS';
  const exitsWithTPorSL =
    strategy.TAKE_PROFIT !== null && strategy.STOP_LOSS !== null;

  const defaultInputProps = {
    disabled: false,
    size: 'sm',
    color: 'default',
    labelPlacement: 'outside',
    isDisabled: !isEditing,
    className: styles.input,
  };

  function withTooltip(component, fieldName) {
    return (
      <Tooltip
        key={fieldName}
        showArrow
        content={strategyFieldsTooltips[fieldName]}
        className={styles.tooltip}
        closeDelay={0}
        placement="top-start"
        color="primary"
        delay={500}
      >
        <div className={styles.label}>{component}</div>
      </Tooltip>
    );
  }

  return (
    <div className={`${styles.container} ${isEditing ? styles.editing : ''}`}>
      <div className={styles.row}>
        <Input
          {...defaultInputProps}
          type="text"
          label={withTooltip(<>Pair</>, 'PAIR')}
          labelPlacement={'outside'}
          onChange={(e) => setStrategy({ ...strategy, PAIR: e.target.value })}
          value={strategy.PAIR}
          isInvalid={!strategyValidations.PAIR(strategy)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Trade amount</>, 'IDEAL_TRADE_AMOUNT')}
          labelPlacement={'outside'}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">USDT</span>
            </div>
          }
          onChange={(e) =>
            setStrategy({
              ...strategy,
              IDEAL_TRADE_AMOUNT: parseInt(e.target.value),
            })
          }
          value={strategy.IDEAL_TRADE_AMOUNT}
          isInvalid={!strategyValidations.IDEAL_TRADE_AMOUNT(strategy)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Initial balance</>, 'INITIAL_BALANCE')}
          placeholder="2000"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">USDT</span>
            </div>
          }
          onChange={(e) =>
            setStrategy({
              ...strategy,
              INITIAL_BALANCE: parseInt(e.target.value),
            })
          }
          value={strategy.INITIAL_BALANCE}
          isInvalid={!strategyValidations.INITIAL_BALANCE(strategy)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Max. allocation</>, 'MAX_WEIGHT_ALLOCATION')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              MAX_WEIGHT_ALLOCATION: parseInt(e.target.value),
            })
          }
          value={strategy.MAX_WEIGHT_ALLOCATION}
          isInvalid={!strategyValidations.MAX_WEIGHT_ALLOCATION(strategy)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Leverage</>, 'LEVERAGE')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({ ...strategy, LEVERAGE: parseInt(e.target.value) })
          }
          value={strategy.LEVERAGE}
          isInvalid={!strategyValidations.LEVERAGE(strategy)}
        />
      </div>
      <div className={styles.row}>
        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(<>Candle size</>, 'CANDLE_SIZE_MINUTES')}
          placeholder="Select a candle"
          disallowEmptySelection
          selectedKeys={[strategy.CANDLE_SIZE_MINUTES.toString()]}
          onChange={(e) => {
            setStrategy({
              ...strategy,
              CANDLE_SIZE_MINUTES: parseInt(e.target.value),
            });
          }}
          selectionMode="single"
        >
          {candleSizes.map((candleSize) => (
            <SelectItem
              key={candleSize.value}
              value={candleSize.value}
              className={styles.selectItem}
            >
              {candleSize.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className={styles.entry}>
        <div className={styles.configTitle}>Entrar cuando</div>
        <div className={styles.row}>
          <Select
            {...defaultInputProps}
            className={styles.select}
            label={withTooltip(<>Indicator</>, 'INDICATOR')}
            placeholder="Select an indicator"
            disallowEmptySelection
            selectedKeys={[strategy.INDICATOR]}
            onChange={(e) => {
              setStrategy({
                ...strategy,
                INDICATOR: e.target.value,
              });
            }}
            selectionMode="single"
          >
            {indicators.map((indicator) => (
              <SelectItem
                key={indicator.value}
                value={indicator.value}
                className={styles.selectItem}
              >
                {indicator.label}
              </SelectItem>
            ))}
          </Select>
          {!isMACDType && (
            <Input
              {...defaultInputProps}
              type="number"
              label={withTooltip(<>Period</>, 'ENTRY_TRIGGER.period')}
              placeholder="20"
              onChange={(e) =>
                setStrategy({
                  ...strategy,
                  ENTRY_TRIGGER: {
                    ...strategy.ENTRY_TRIGGER,
                    period: parseInt(e.target.value),
                  },
                  EXIT_TRIGGER: {
                    ...strategy.EXIT_TRIGGER,
                    period: parseInt(e.target.value),
                  },
                })
              }
              value={strategy.ENTRY_TRIGGER?.period}
              isInvalid={!strategyValidations['ENTRY_TRIGGER.period'](strategy)}
            />
          )}
          {isBBANDSType && (
            <>
              <Input
                {...defaultInputProps}
                type="number"
                label={withTooltip(
                  <>Deviation</>,
                  'ENTRY_TRIGGER.period_deviation',
                )}
                placeholder="2"
                onChange={(e) =>
                  setStrategy({
                    ...strategy,
                    ENTRY_TRIGGER: {
                      ...strategy.ENTRY_TRIGGER,
                      period_deviation: parseInt(e.target.value),
                    },
                    EXIT_TRIGGER: {
                      ...strategy.EXIT_TRIGGER,
                      period_deviation: parseInt(e.target.value),
                    },
                  })
                }
                value={strategy.ENTRY_TRIGGER?.period_deviation}
                isInvalid={
                  !strategyValidations['ENTRY_TRIGGER.period_deviation'](
                    strategy,
                  )
                }
              />
              {/* band to cross */}
              <Select
                {...defaultInputProps}
                className={styles.select}
                label={withTooltip(
                  <>Band to cross</>,
                  'ENTRY_TRIGGER.band_to_cross',
                )}
                placeholder="Select a band"
                disallowEmptySelection
                selectedKeys={[strategy.ENTRY_TRIGGER?.band_to_cross]}
                onChange={(e) => {
                  setStrategy({
                    ...strategy,
                    ENTRY_TRIGGER: {
                      ...strategy.ENTRY_TRIGGER,
                      band_to_cross: e.target.value,
                    },
                  });
                }}
                selectionMode="single"
              >
                {bandsToCross.map((band) => (
                  <SelectItem
                    key={band.value}
                    value={band.value}
                    className={styles.selectItem}
                  >
                    {band.label}
                  </SelectItem>
                ))}
              </Select>
            </>
          )}
          {isMACrossType && (
            <Input
              key={strategy.INDICATOR}
              {...defaultInputProps}
              type="number"
              label={withTooltip(
                <>Cross percentage</>,
                'ENTRY_TRIGGER.cross_percentage',
              )}
              placeholder="0"
              onChange={(e) =>
                setStrategy({
                  ...strategy,
                  ENTRY_TRIGGER: {
                    ...strategy.ENTRY_TRIGGER,
                    cross_percentage: parseFloat(e.target.value),
                  },
                })
              }
              value={strategy.ENTRY_TRIGGER?.cross_percentage}
              isInvalid={
                !strategyValidations['ENTRY_TRIGGER.cross_percentage'](strategy)
              }
            />
          )}
          {!isMACrossType && !isMACDType && !isBBANDSType && (
            <Input
              key={strategy.INDICATOR}
              {...defaultInputProps}
              type="number"
              label={withTooltip(
                <>Indicator value</>,
                'ENTRY_TRIGGER.target_value',
              )}
              placeholder="70"
              onChange={(e) =>
                setStrategy({
                  ...strategy,
                  ENTRY_TRIGGER: {
                    ...strategy.ENTRY_TRIGGER,
                    target_value: parseInt(e.target.value),
                  },
                })
              }
              value={strategy.ENTRY_TRIGGER?.target_value}
              isInvalid={
                !strategyValidations['ENTRY_TRIGGER.target_value'](strategy)
              }
            />
          )}
          <Select
            {...defaultInputProps}
            className={styles.select}
            label={withTooltip(
              <>Cross direction</>,
              'ENTRY_TRIGGER.cross_direction',
            )}
            placeholder="Select a cross direction"
            disallowEmptySelection
            selectedKeys={[strategy.ENTRY_TRIGGER?.cross_direction]}
            onChange={(e) => {
              setStrategy({
                ...strategy,
                ENTRY_TRIGGER: {
                  ...strategy.ENTRY_TRIGGER,
                  cross_direction: e.target.value,
                },
              });
            }}
            selectionMode="single"
          >
            {crossDirections.map((crossDirection) => (
              <SelectItem
                key={crossDirection.value}
                value={crossDirection.value}
                className={styles.selectItem}
              >
                {crossDirection.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            {...defaultInputProps}
            className={styles.select}
            label={withTooltip(
              <>Position type</>,
              'ENTRY_TRIGGER.position_type',
            )}
            placeholder="Select position type"
            disallowEmptySelection
            selectedKeys={[strategy.ENTRY_TRIGGER?.position_type]}
            onChange={(e) => {
              setStrategy({
                ...strategy,
                ENTRY_TRIGGER: {
                  ...strategy.ENTRY_TRIGGER,
                  position_type: e.target.value,
                },
              });
            }}
            selectionMode="single"
          >
            {positionTypes.map((positionType) => (
              <SelectItem
                key={positionType.value}
                value={positionType.value}
                className={styles.selectItem}
              >
                {positionType.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className={styles.exit}>
        <div className={styles.configTitle}>Salir cuando</div>
        {exitsWithTPorSL ? (
          <div className={styles.row}>
            <Input
              {...defaultInputProps}
              type="number"
              label={withTooltip(<>Take profit</>, 'TAKE_PROFIT')}
              placeholder="1"
              onChange={(e) =>
                setStrategy({
                  ...strategy,
                  TAKE_PROFIT: parseFloat(e.target.value),
                })
              }
              value={strategy.TAKE_PROFIT}
              isInvalid={!strategyValidations['TAKE_PROFIT'](strategy)}
            />
            <Input
              {...defaultInputProps}
              type="number"
              label={withTooltip(<>Stop loss</>, 'STOP_LOSS')}
              placeholder="1"
              onChange={(e) =>
                setStrategy({
                  ...strategy,
                  STOP_LOSS: parseFloat(e.target.value),
                })
              }
              value={strategy.STOP_LOSS}
              isInvalid={!strategyValidations['STOP_LOSS'](strategy)}
            />
          </div>
        ) : (
          <div className={styles.row}>
            <Select
              {...defaultInputProps}
              className={styles.select}
              label={withTooltip(<>Indicator</>, 'INDICATOR')}
              placeholder="Select an indicator"
              disallowEmptySelection
              selectedKeys={[strategy.INDICATOR]}
              onChange={(e) => {
                setStrategy({
                  ...strategy,
                  INDICATOR: e.target.value,
                });
              }}
              selectionMode="single"
              isDisabled={true}
            >
              {indicators.map((indicator) => (
                <SelectItem
                  key={indicator.value}
                  value={indicator.value}
                  className={styles.selectItem}
                >
                  {indicator.label}
                </SelectItem>
              ))}
            </Select>
            {!isMACDType && (
              <Input
                {...defaultInputProps}
                type="number"
                label={withTooltip(<>Period</>, 'EXIT_TRIGGER.period')}
                placeholder="20"
                onChange={(e) =>
                  setStrategy({
                    ...strategy,
                    EXIT_TRIGGER: {
                      ...strategy.EXIT_TRIGGER,
                      period: parseInt(e.target.value),
                    },
                  })
                }
                value={strategy.EXIT_TRIGGER?.period}
                isInvalid={
                  !strategyValidations['EXIT_TRIGGER.period'](strategy)
                }
                isDisabled={true}
              />
            )}
            {isBBANDSType && (
              <>
                <Input
                  {...defaultInputProps}
                  type="number"
                  label={withTooltip(
                    <>Deviation</>,
                    'EXIT_TRIGGER.period_deviation',
                  )}
                  placeholder="2"
                  onChange={(e) =>
                    setStrategy({
                      ...strategy,
                      EXIT_TRIGGER: {
                        ...strategy.EXIT_TRIGGER,
                        period_deviation: parseInt(e.target.value),
                      },
                    })
                  }
                  value={strategy.EXIT_TRIGGER?.period_deviation}
                  isInvalid={
                    !strategyValidations['EXIT_TRIGGER.period_deviation'](
                      strategy,
                    )
                  }
                  isDisabled={true}
                />
                {/* band to cross */}
                <Select
                  {...defaultInputProps}
                  className={styles.select}
                  label={withTooltip(
                    <>Band to cross</>,
                    'EXIT_TRIGGER.band_to_cross',
                  )}
                  placeholder="Select a band"
                  disallowEmptySelection
                  selectedKeys={[strategy.EXIT_TRIGGER?.band_to_cross]}
                  onChange={(e) => {
                    setStrategy({
                      ...strategy,
                      EXIT_TRIGGER: {
                        ...strategy.EXIT_TRIGGER,
                        band_to_cross: e.target.value,
                      },
                    });
                  }}
                  selectionMode="single"
                >
                  {bandsToCross.map((band) => (
                    <SelectItem
                      key={band.value}
                      value={band.value}
                      className={styles.selectItem}
                    >
                      {band.label}
                    </SelectItem>
                  ))}
                </Select>
              </>
            )}
            {isMACrossType && (
              <Input
                key={strategy.INDICATOR}
                {...defaultInputProps}
                type="number"
                label={withTooltip(
                  <>Cross percentage</>,
                  'EXIT_TRIGGER.cross_percentage',
                )}
                placeholder="0"
                onChange={(e) =>
                  setStrategy({
                    ...strategy,
                    EXIT_TRIGGER: {
                      ...strategy.EXIT_TRIGGER,
                      cross_percentage: parseFloat(e.target.value),
                    },
                  })
                }
                value={strategy.EXIT_TRIGGER?.cross_percentage}
                isInvalid={
                  !strategyValidations['EXIT_TRIGGER.cross_percentage'](
                    strategy,
                  )
                }
              />
            )}
            {!isMACrossType && !isMACDType && !isBBANDSType && (
              <Input
                key={strategy.INDICATOR}
                {...defaultInputProps}
                type="number"
                label={withTooltip(
                  <>Indicator value</>,
                  'EXIT_TRIGGER.target_value',
                )}
                placeholder="70"
                onChange={(e) =>
                  setStrategy({
                    ...strategy,
                    EXIT_TRIGGER: {
                      ...strategy.EXIT_TRIGGER,
                      target_value: parseInt(e.target.value),
                    },
                  })
                }
                value={strategy.EXIT_TRIGGER?.target_value}
                isInvalid={
                  !strategyValidations['EXIT_TRIGGER.target_value'](strategy)
                }
              />
            )}
            <Select
              {...defaultInputProps}
              className={styles.select}
              label={withTooltip(
                <>Cross direction</>,
                'EXIT_TRIGGER.cross_direction',
              )}
              placeholder="Select a cross direction"
              disallowEmptySelection
              selectedKeys={[strategy.EXIT_TRIGGER?.cross_direction]}
              onChange={(e) => {
                setStrategy({
                  ...strategy,
                  EXIT_TRIGGER: {
                    ...strategy.EXIT_TRIGGER,
                    cross_direction: e.target.value,
                  },
                });
              }}
              selectionMode="single"
            >
              {crossDirections.map((crossDirection) => (
                <SelectItem
                  key={crossDirection.value}
                  value={crossDirection.value}
                  className={styles.selectItem}
                >
                  {crossDirection.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className={styles.row}>
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Entry spread</>, 'START_GAP_PERCENTAGE')}
          placeholder="0"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              START_GAP_PERCENTAGE: parseFloat(e.target.value),
            })
          }
          value={strategy.START_GAP_PERCENTAGE}
          isInvalid={!strategyValidations['START_GAP_PERCENTAGE'](strategy)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Expiry time</>, 'OPERATION_EXPIRY_TIME')}
          placeholder="0"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              OPERATION_EXPIRY_TIME: parseInt(e.target.value),
            })
          }
          value={strategy.OPERATION_EXPIRY_TIME}
          isInvalid={!strategyValidations['OPERATION_EXPIRY_TIME'](strategy)}
        />
      </div>
    </div>
  );
};

export default StrategyConfigFields;
