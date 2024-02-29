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

const StrategyConfigFields = ({ strategy, setStrategy, isEditing = true }) => {
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
          isInvalid={!isValidPair(strategy.PAIR)}
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
          isInvalid={!isPositiveInteger(strategy.IDEAL_TRADE_AMOUNT)}
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
          isInvalid={!isPositiveInteger(strategy.INITIAL_BALANCE)}
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
          isInvalid={!isPositiveInteger(strategy.MAX_WEIGHT_ALLOCATION)}
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
          isInvalid={!isValidLeverage(strategy.LEVERAGE)}
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
            setStrategy({ ...strategy, INDICATOR: e.target.value });
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
          isInvalid={!isPositiveInteger(strategy.SIGNAL_TRIGGER?.period)}
        />
        {isMACrossType ? (
          <Input
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
                  target_value: e.target.value,
                },
              })
            }
            value={strategy.SIGNAL_TRIGGER?.cross_percentage}
            isInvalid={!isNumber(strategy.SIGNAL_TRIGGER?.cross_percentage)}
          />
        ) : (
          <Input
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
            isInvalid={!isNumber(strategy.SIGNAL_TRIGGER?.target_value)}
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
          isInvalid={!isPositiveInteger(strategy.TAKE_PROFIT)}
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
          isInvalid={!isPositiveInteger(strategy.STOP_LOSS)}
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
          isInvalid={!isPositiveOrZeroInteger(strategy.START_GAP_PERCENTAGE)}
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
          isInvalid={!isPositiveOrZeroInteger(strategy.OPERATION_EXPIRY_TIME)}
        />
      </div>
    </div>
  );
};

export default StrategyConfigFields;
