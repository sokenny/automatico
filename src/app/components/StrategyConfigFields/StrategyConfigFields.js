'use client';

import React, { useEffect, useState } from 'react';
import { Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import strategyFieldsTooltips from '../../constants/strategyFieldsTooltips';
import styles from './StrategyConfigFields.module.css';

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

const candleSizes = [
  {
    value: '1',
    label: '1m',
  },
  {
    value: '5',
    label: '5m',
  },
  {
    value: '15',
    label: '15m',
  },
  {
    value: '30',
    label: '30m',
  },
  {
    value: '60',
    label: '1h',
  },
];

const indicators = [
  {
    value: 'CCI',
    label: 'CCI',
  },
  {
    value: 'RSI',
    label: 'RSI',
  },
  {
    value: 'EMA',
    label: 'EMA',
  },
  {
    value: 'SMA',
    label: 'SMA',
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
  setStrategy,
  onIsValidChange = () => {},
  isEditing = true,
}) => {
  const isMACrossType = ['EMA', 'SMA'].includes(strategy.INDICATOR);

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

  const validations = {
    'PAIR': isValidPair(strategy.PAIR),
    'IDEAL_TRADE_AMOUNT': isPositiveInteger(strategy.IDEAL_TRADE_AMOUNT),
    'INITIAL_BALANCE': isPositiveInteger(strategy.INITIAL_BALANCE),
    'MAX_WEIGHT_ALLOCATION': isPositiveInteger(strategy.MAX_WEIGHT_ALLOCATION),
    'LEVERAGE': isValidLeverage(strategy.LEVERAGE),
    'TAKE_PROFIT': isPositiveInteger(strategy.TAKE_PROFIT),
    'STOP_LOSS': isPositiveInteger(strategy.STOP_LOSS),
    'OPERATION_EXPIRY_TIME': isPositiveOrZeroInteger(
      strategy.OPERATION_EXPIRY_TIME,
    ),
    'START_GAP_PERCENTAGE': isPositiveOrZeroInteger(
      strategy.START_GAP_PERCENTAGE,
    ),
    'SIGNAL_TRIGGER.period': isPositiveInteger(strategy.SIGNAL_TRIGGER?.period),
    'SIGNAL_TRIGGER.cross_percentage': isNumber(
      strategy.SIGNAL_TRIGGER?.cross_percentage,
    ),
    'SIGNAL_TRIGGER.target_value': isNumber(
      strategy.SIGNAL_TRIGGER?.target_value,
    ),
  };

  const formIsValid = Object.values(validations).every((v, i) => {
    const key = Object.keys(validations)[i];
    if (key === 'SIGNAL_TRIGGER.cross_percentage' && !isMACrossType)
      return true;
    if (key === 'SIGNAL_TRIGGER.target_value' && !isMACrossType) return true;
    return v;
  });

  useEffect(() => {
    onIsValidChange(formIsValid);
  }, [formIsValid]);

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
          isInvalid={!validations['PAIR']}
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
            setStrategy({ ...strategy, IDEAL_TRADE_AMOUNT: e.target.value })
          }
          value={strategy.IDEAL_TRADE_AMOUNT}
          isInvalid={!validations['IDEAL_TRADE_AMOUNT']}
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
            setStrategy({ ...strategy, INITIAL_BALANCE: e.target.value })
          }
          value={strategy.INITIAL_BALANCE}
          isInvalid={!validations['INITIAL_BALANCE']}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Max. allocation</>, 'MAX_WEIGHT_ALLOCATION')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              MAX_WEIGHT_ALLOCATION: e.target.value,
            })
          }
          value={strategy.MAX_WEIGHT_ALLOCATION}
          isInvalid={!validations['MAX_WEIGHT_ALLOCATION']}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Leverage</>, 'LEVERAGE')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({ ...strategy, LEVERAGE: e.target.value })
          }
          value={strategy.LEVERAGE}
          isInvalid={!validations['LEVERAGE']}
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
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Period</>, 'SIGNAL_TRIGGER.period')}
          placeholder="20"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              SIGNAL_TRIGGER: {
                ...strategy.SIGNAL_TRIGGER,
                period: e.target.value,
              },
            })
          }
          value={strategy.SIGNAL_TRIGGER?.period}
          isInvalid={!validations['SIGNAL_TRIGGER.period']}
        />
        {isMACrossType ? (
          <Input
            key={strategy.INDICATOR}
            {...defaultInputProps}
            type="number"
            label={withTooltip(
              <>Cross percentage</>,
              'SIGNAL_TRIGGER.cross_percentage',
            )}
            placeholder="0"
            onChange={(e) =>
              setStrategy({
                ...strategy,
                SIGNAL_TRIGGER: {
                  ...strategy.SIGNAL_TRIGGER,
                  cross_percentage: e.target.value,
                },
              })
            }
            value={strategy.SIGNAL_TRIGGER?.cross_percentage}
            isInvalid={!validations['SIGNAL_TRIGGER.cross_percentage']}
          />
        ) : (
          <Input
            key={strategy.INDICATOR}
            {...defaultInputProps}
            type="number"
            label={withTooltip(
              <>Indicator value</>,
              'SIGNAL_TRIGGER.target_value',
            )}
            placeholder="70"
            onChange={(e) =>
              setStrategy({
                ...strategy,
                SIGNAL_TRIGGER: {
                  ...strategy.SIGNAL_TRIGGER,
                  target_value: e.target.value,
                },
              })
            }
            value={strategy.SIGNAL_TRIGGER?.target_value}
            isInvalid={!validations['SIGNAL_TRIGGER.target_value']}
          />
        )}
        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(
            <>Cross direction</>,
            'SIGNAL_TRIGGER.cross_direction',
          )}
          placeholder="Select a cross direction"
          disallowEmptySelection
          selectedKeys={[strategy.SIGNAL_TRIGGER?.cross_direction]}
          onChange={(e) => {
            setStrategy({
              ...strategy,
              SIGNAL_TRIGGER: {
                ...strategy.SIGNAL_TRIGGER,
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

      <div className={styles.row}>
        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(
            <>Position type</>,
            'SIGNAL_TRIGGER.position_type',
          )}
          placeholder="Select position type"
          disallowEmptySelection
          selectedKeys={[strategy.SIGNAL_TRIGGER?.position_type]}
          onChange={(e) => {
            setStrategy({
              ...strategy,
              SIGNAL_TRIGGER: {
                ...strategy.SIGNAL_TRIGGER,
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
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Take profit</>, 'TAKE_PROFIT')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({ ...strategy, TAKE_PROFIT: e.target.value })
          }
          value={strategy.TAKE_PROFIT}
          isInvalid={!validations['TAKE_PROFIT']}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Stop loss</>, 'STOP_LOSS')}
          placeholder="1"
          onChange={(e) =>
            setStrategy({ ...strategy, STOP_LOSS: e.target.value })
          }
          value={strategy.STOP_LOSS}
          isInvalid={!validations['STOP_LOSS']}
        />
      </div>
      <div className={styles.row}>
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Entry spread</>, 'START_GAP_PERCENTAGE')}
          placeholder="0"
          onChange={(e) =>
            setStrategy({ ...strategy, START_GAP_PERCENTAGE: e.target.value })
          }
          value={strategy.START_GAP_PERCENTAGE}
          isInvalid={!validations['START_GAP_PERCENTAGE']}
        />
        <Input
          {...defaultInputProps}
          type="text"
          label={withTooltip(<>Expiry time</>, 'OPERATION_EXPIRY_TIME')}
          placeholder="0"
          onChange={(e) =>
            setStrategy({
              ...strategy,
              OPERATION_EXPIRY_TIME: e.target.value,
            })
          }
          value={strategy.OPERATION_EXPIRY_TIME}
          isInvalid={!validations['OPERATION_EXPIRY_TIME']}
        />
      </div>
    </div>
  );
};

export default StrategyConfigFields;
