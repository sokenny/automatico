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
  return value >= 1 && value <= 50;
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

const StrategyConfigFields = ({ strategy = {}, isEditing = true }) => {
  const [formState, setFormState] = useState(strategy);
  const isMACrossType = ['EMA', 'SMA'].includes(formState.INDICATOR);
  const [selectedCandleSize, setSelectedCandleSize] = useState(
    formState.CANDLE_SIZE_MINUTES.toString(),
  );
  const [selectedIndicator, setSelectedIndicator] = useState(
    formState.INDICATOR.toString(),
  );
  const [selectedCrossDirection, setSelectedCrossDirection] = useState(
    formState.SIGNAL_TRIGGER?.cross_direction.toString(),
  );
  const [selectedPositionType, setSelectedPositionType] = useState(
    formState.SIGNAL_TRIGGER?.position_type.toString(),
  );

  useEffect(() => {
    setSelectedCandleSize(formState.CANDLE_SIZE_MINUTES.toString());
  }, [formState.CANDLE_SIZE_MINUTES]);

  useEffect(() => {
    setSelectedIndicator(formState.INDICATOR);
  }, [formState.INDICATOR]);

  useEffect(() => {
    setSelectedCrossDirection(formState.SIGNAL_TRIGGER?.cross_direction);
  }, [formState.SIGNAL_TRIGGER?.cross_direction]);

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
          onChange={(e) => setFormState({ ...formState, PAIR: e.target.value })}
          value={formState.PAIR}
          isInvalid={!isValidPair(formState.PAIR)}
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
            setFormState({ ...formState, IDEAL_TRADE_AMOUNT: e.target.value })
          }
          value={formState.IDEAL_TRADE_AMOUNT}
          isInvalid={!isPositiveInteger(formState.IDEAL_TRADE_AMOUNT)}
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
            setFormState({ ...formState, INITIAL_BALANCE: e.target.value })
          }
          value={formState.INITIAL_BALANCE}
          isInvalid={!isPositiveInteger(formState.INITIAL_BALANCE)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Max. allocation</>, 'MAX_WEIGHT_ALLOCATION')}
          placeholder="1"
          onChange={(e) =>
            setFormState({
              ...formState,
              MAX_WEIGHT_ALLOCATION: e.target.value,
            })
          }
          value={formState.MAX_WEIGHT_ALLOCATION}
          isInvalid={!isPositiveInteger(formState.MAX_WEIGHT_ALLOCATION)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Leverage</>, 'LEVERAGE')}
          placeholder="1"
          onChange={(e) =>
            setFormState({ ...formState, LEVERAGE: e.target.value })
          }
          value={formState.LEVERAGE}
          isInvalid={!isValidLeverage(formState.LEVERAGE)}
        />
      </div>
      <div className={styles.row}>
        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(<>Candle size</>, 'CANDLE_SIZE_MINUTES')}
          placeholder="Select a candle"
          disallowEmptySelection
          selectedKeys={[selectedCandleSize]}
          onChange={(e) => {
            setSelectedCandleSize(e.target.value);
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
          selectedKeys={[selectedIndicator]}
          onChange={(e) => {
            setSelectedIndicator(e.target.value);
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
            setFormState({
              ...formState,
              SIGNAL_TRIGGER: {
                ...formState.SIGNAL_TRIGGER,
                period: e.target.value,
              },
            })
          }
          value={formState.SIGNAL_TRIGGER?.period}
          isInvalid={!isPositiveInteger(formState.SIGNAL_TRIGGER?.period)}
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
              setFormState({
                ...formState,
                SIGNAL_TRIGGER: {
                  ...formState.SIGNAL_TRIGGER,
                  target_value: e.target.value,
                },
              })
            }
            value={formState.SIGNAL_TRIGGER?.cross_percentage}
            isInvalid={!isNumber(formState.SIGNAL_TRIGGER?.cross_percentage)}
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
              setFormState({
                ...formState,
                SIGNAL_TRIGGER: {
                  ...formState.SIGNAL_TRIGGER,
                  target_value: e.target.value,
                },
              })
            }
            value={formState.SIGNAL_TRIGGER?.target_value}
            isInvalid={!isNumber(formState.SIGNAL_TRIGGER?.target_value)}
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
          selectedKeys={[selectedCrossDirection]}
          onChange={(e) => {
            setSelectedCrossDirection(e.target.value);
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
          selectedKeys={[selectedPositionType]}
          onChange={(e) => {
            setSelectedPositionType(e.target.value);
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
            setFormState({ ...formState, TAKE_PROFIT: e.target.value })
          }
          value={formState.TAKE_PROFIT}
          isInvalid={!isPositiveInteger(formState.TAKE_PROFIT)}
        />
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Stop loss</>, 'STOP_LOSS')}
          placeholder="1"
          onChange={(e) =>
            setFormState({ ...formState, STOP_LOSS: e.target.value })
          }
          value={formState.STOP_LOSS}
          isInvalid={!isPositiveInteger(formState.STOP_LOSS)}
        />
      </div>
      <div className={styles.row}>
        <Input
          {...defaultInputProps}
          type="number"
          label={withTooltip(<>Entry spread</>, 'START_GAP_PERCENTAGE')}
          placeholder="0"
          onChange={(e) =>
            setFormState({ ...formState, START_GAP_PERCENTAGE: e.target.value })
          }
          value={formState.START_GAP_PERCENTAGE}
          isInvalid={!isPositiveOrZeroInteger(formState.START_GAP_PERCENTAGE)}
        />
        <Input
          {...defaultInputProps}
          type="text"
          label={withTooltip(<>Expiry time</>, 'OPERATION_EXPIRY_TIME')}
          placeholder="0"
          onChange={(e) =>
            setFormState({
              ...formState,
              OPERATION_EXPIRY_TIME: e.target.value,
            })
          }
          value={formState.OPERATION_EXPIRY_TIME}
          isInvalid={!isPositiveOrZeroInteger(formState.OPERATION_EXPIRY_TIME)}
        />
      </div>
    </div>
  );
};

export default StrategyConfigFields;
