'use client';
import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Tooltip, Input } from '@nextui-org/react';
import backtestFieldsTooltips from '../../constants/backtestFieldsTooltips.js';
import styles from './BacktestConfigFields.module.css';

const backtestPeriods = [
  {
    value: 'week',
    label: 'Últimos 7 días',
  },
  {
    value: 'month',
    label: 'Últimos 30 días',
  },
  {
    value: 'year',
    label: 'Últimos 365 días',
  },
  {
    value: 'custom',
    label: 'Personalizado',
  },
];

const tickIntervals = [
  {
    value: 1,
    label: '1m',
  },
  {
    value: 5,
    label: '5m',
  },
  {
    value: 15,
    label: '15m',
  },
  {
    value: 30,
    label: '30m',
  },
  {
    value: 60,
    label: '1h',
  },
];

const BacktestConfigFields = ({
  formState,
  setFormState,
  isEditing = true,
}) => {
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
        content={backtestFieldsTooltips[fieldName]}
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
    <div className={styles.container}>
      <div className={styles.period}>
        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(<>Period</>, 'PERIOD')}
          placeholder="Select a period"
          disallowEmptySelection
          selectedKeys={[formState.backtestPeriod]}
          onChange={(e) => {
            setFormState({
              ...formState,
              backtestPeriod: e.target.value,
              runBacktestDisabled: false,
            });
          }}
          selectionMode="single"
        >
          {backtestPeriods.map((backtestPeriod) => (
            <SelectItem
              key={backtestPeriod.value}
              value={backtestPeriod.value}
              className={styles.selectItem}
            >
              {backtestPeriod.label}
            </SelectItem>
          ))}
        </Select>
        {formState.backtestPeriod === 'custom' && (
          <div className={styles.customDates}>
            <Input
              {...defaultInputProps}
              type="date"
              label={withTooltip(<>Desde</>, 'FROM')}
              labelPlacement={'outside'}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  customPeriodFrom: e.target.value,
                  runBacktestDisabled: false,
                })
              }
              value={
                formState.customPeriodFrom ? formState.customPeriodFrom : ''
              }
              placeholder="YYYY-MM-DD"
            />
            <Input
              {...defaultInputProps}
              type="date"
              label={withTooltip(<>Hasta</>, 'TO')}
              labelPlacement={'outside'}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  customPeriodTo: e.target.value,
                  runBacktestDisabled: false,
                })
              }
              value={formState.customPeriodTo ? formState.customPeriodTo : ''}
              placeholder="YYYY-MM-DD"
            />
          </div>
        )}

        <Select
          {...defaultInputProps}
          className={styles.select}
          label={withTooltip(<>Tick interval</>, 'TICK_INTERVAL_MINUTES')}
          disallowEmptySelection
          selectedKeys={[formState.strategy.TICK_INTERVAL_MINUTES.toString()]}
          onChange={(e) => {
            setFormState({
              ...formState,
              strategy: {
                ...formState.strategy,
                TICK_INTERVAL_MINUTES: parseInt(e.target.value),
              },
              runBacktestDisabled: false,
            });
          }}
          selectionMode="single"
        >
          {tickIntervals.map((tickInterval) => (
            <SelectItem
              key={tickInterval.value}
              value={tickInterval.value}
              className={styles.selectItem}
            >
              {tickInterval.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default BacktestConfigFields;
