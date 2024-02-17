'use client';
import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import getStrategyToUse from '../../helpers/getStrategyToUse';
import buildBacktestRequestPayload from '../../helpers/buildBacktestRequestPayload';
import BacktestPeriodsDropdown from '../BacktestPeriodsDropdown/BacktestPeriodsDropdown';
import styles from './StrategyGenerator.module.css';

const mockupGeneratedStrategy = {
  PAIR: 'BTCUSDT',
  INDICATOR: 'RSI',
  SIGNAL_TRIGGER:
    "{'cross_direction': 'below_to_above', 'position_type': 'long', 'target_value': 70}",
  TAKE_PROFIT: 2,
  STOP_LOSS: 1,
  MAX_WEIGHT_ALLOCATION: 1,
  IDEAL_TRADE_AMOUNT: 1000,
};

const StrategyGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    entry: 'Si BTC cruza el SMA 20, comprá 1k USD.', // lo harcodeamos para testear mas facil
    exit: 'Cerrá la posición con una ganancia del 3% o si la pérdida supera el 2%.', // lo harcodeamos para testear mas facil
    strategy: getStrategyToUse(mockupGeneratedStrategy), // lo harcodeamos para testear mas facil
    viewDetails: false,
    backtestPeriod: null,
    backtestResults: null,
  });

  console.log('formState: ', formState);

  const canProceedToGenerate = formState.entry && formState.exit;

  async function handleGenerateStrategy() {
    setLoading(true);
    const strategyPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/translate-strategy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natural_language_strategy: `Entry: ${formState.entry} Exit: ${formState.exit}`,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLoading(false);
          setFormState({ ...formState, strategy: data.config });
        }
      })
      .catch((error) => {
        setLoading(false);
        throw new Error('Error creando estrategia');
      });

    toast.promise(strategyPromise, {
      loading: 'Creando estrategia...',
      success: (data) => {
        return `Estrategia creada con éxito`;
      },
      error: 'Error creando estrategia',
    });
  }

  async function handleRunBacktest() {
    setLoading(true);

    const payloadToSend = buildBacktestRequestPayload({
      config: formState.strategy,
      period: formState.backtestPeriod,
    });

    console.log('payloadToSend: ', payloadToSend);

    const backtestPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/backtest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('la respuesta - a! ', data);
        setFormState({ ...formState, backtestResults: data });
      })
      .catch((error) => {
        console.log('Error corriendo backtest: ', error);
        throw new Error('Error corriendo backtest');
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(backtestPromise, {
      loading: 'Analizando estrategia...',
      success: (data) => {
        return `Backtest finalizado con éxito`;
      },
      error: 'Error corriendo backtest',
    });
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
                {formState.exit}
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
              <BacktestPeriodsDropdown
                onChange={(value) => {
                  console.log('value: ', value);
                  setFormState({ ...formState, backtestPeriod: value });
                }}
              />
            </div>
            <div className={styles.backtestActions}>
              <Button
                color="primary"
                className={styles.runBacktestButton}
                isLoading={loading}
                onClick={handleRunBacktest}
              >
                Correr Backtest
              </Button>
            </div>
          </div>
          {formState.backtestResults !== null && (
            <div>
              <div className={styles.stepTitle}>Resultados:</div>
              <div>
                <pre>{JSON.stringify(formState.backtestResults, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StrategyGenerator;
