'use client';
import React, { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { toast } from 'sonner';
import styles from './StrategyGenerator.module.css';

const mockupStrategy = {
  PAIR: 'ETHUSDT',
  STRATEGY: 'reversion',
  PERIOD: "['1 Jan, 2023', '10 Jan, 2023']",
  OPERATION_EXPIRY_TIME: 2500,
  INDICATOR: 'SMA',
  SIGNAL_TRIGGER:
    "{'cross_direction': 'below_to_above','period': 20, 'position_type': 'long', 'cross_percentage': 0}",
  TAKE_PROFIT: 1,
  STOP_LOSS: 1,
  POSITION_STRUCTURE: "[{'weight': .5}, {'weight': .5}]",
  START_GAP_PERCENTAGE: 0,
  MAX_WEIGHT_ALLOCATION: 1,
  IDEAL_TRADE_AMOUNT: 5000,
  INITIAL_BALANCE: 10000,
  INCLUDE_BLACKBOX_LOGS: 1,
  UPDATE_SL_EVERY: 0,
};

const backtestPeriods = [
  {
    key: 'week',
    content: 'Últimos 7 días',
  },
  {
    key: 'month',
    content: 'Últimos 30 días',
  },
  {
    key: 'year',
    content: 'Últimos 365 días',
  },
  {
    key: 'custom',
    content: 'Personalizado',
  },
];

const StrategyGenerator = () => {
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([backtestPeriods[0].key]),
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  );

  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    entry: '',
    exit: '',
    strategy: null,
    viewDetails: false,
  });

  const canProceedToGenerate = formState.entry && formState.exit;

  async function handleGenerateStrategy() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormState({ ...formState, strategy: mockupStrategy });
      toast.success('Estrategia creada con éxito');
    }, 2000);
  }

  function toggleDetails() {
    setFormState({ ...formState, viewDetails: !formState.viewDetails });
  }

  console.log('Loading: ', loading);
  return (
    <div>
      <div className={`${styles.aiPrompt} ${styles.step}`}>
        <div className={styles.entryAndExit}>
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Entry:</h3>
            {formState.strategy !== null ? (
              <div className={`${styles.textarea} ${styles.disabled}`}>
                {formState.entry}
              </div>
            ) : (
              <textarea
                className={styles.textarea}
                placeholder="Si BTC cruza el SMA 20, comprá 1k USD."
                value={formState.entry}
                onChange={(e) =>
                  setFormState({ ...formState, entry: e.target.value })
                }
                disabled={formState.strategy !== null}
              ></textarea>
            )}
          </div>
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Exit:</h3>
            {formState.strategy !== null ? (
              <div className={`${styles.textarea} ${styles.disabled}`}>
                {formState.entry}
              </div>
            ) : (
              <textarea
                className={styles.textarea}
                placeholder="Cerrá la posición con una ganancia del 3% o si la pérdida supera el 2%."
                value={formState.exit}
                onChange={(e) =>
                  setFormState({ ...formState, exit: e.target.value })
                }
                disabled={formState.strategy !== null}
              ></textarea>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          {formState.strategy === null && (
            <Button
              color="primary"
              className={styles.generateButton}
              isLoading={loading}
              onClick={handleGenerateStrategy}
              isDisabled={!canProceedToGenerate}
            >
              Generar Estrategia
            </Button>
          )}
        </div>
      </div>
      {formState.strategy !== null && (
        <>
          <div className={`${styles.createdStrategy} ${styles.step}`}>
            <div className={styles.createdStrategy}>
              <div className={styles.cta}>
                <div className={styles.stepTitle}>Estrategia creada</div>
              </div>
              {!formState.viewDetails && (
                <div className={styles.strategyPreview}>
                  {JSON.stringify(formState.strategy, null, 2)}
                </div>
              )}
            </div>
            <div className={styles.strategyDetails}>
              <div className={styles.jsonStrategy}>
                {formState.viewDetails && (
                  <pre>{JSON.stringify(formState.strategy, null, 2)}</pre>
                )}
              </div>
            </div>
            <div className={styles.stratDetailsActions}>
              <div className={styles.toggleDetails} onClick={toggleDetails}>
                {formState.viewDetails ? 'Ocultar' : 'Ver'} detalles
              </div>
              <div className={styles.viewDocs}>
                <a>Consultar documentación</a>
              </div>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.backtestPeriod}>
              <div className={styles.stepTitle}>Período a testear:</div>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className={styles.datesDropdown}>
                    {
                      backtestPeriods.find((period) =>
                        selectedKeys.has(period.key),
                      )?.content
                    }
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  {backtestPeriods.map((period) => (
                    <DropdownItem key={period.key}>
                      {period.content}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className={styles.backtestActions}>
              <Button
                color="primary"
                className={styles.runBacktestButton}
                // isLoading={loading}
                // onClick={handleGenerateStrategy}
                // isDisabled={!canProceedToGenerate}
              >
                Correr Backtest
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StrategyGenerator;
