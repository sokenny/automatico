'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import getStrategyToUse from '../../helpers/getStrategyToUse';
import getDaysInFormPeriod from '../../helpers/getDaysInFormPeriod';
import buildBacktestRequestPayload from '../../helpers/buildBacktestRequestPayload';
import sanitizeConfig from '../../helpers/sanitizeConfig';
import BacktestPeriodsDropdown from '../BacktestPeriodsDropdown/BacktestPeriodsDropdown';
import BacktestResults from '../BacktestResults/BacktestResults';
import JsonStrategy from '../JsonStrategy/JsonStrategy';
import StrategyRow from '../StrategyRow/StrategyRow';
import styles from './StrategyGenerator.module.css';

const MAX_DAYS_ALLOWED = 45;

const mockupGeneratedStrategy = {
  PAIR: 'BTCUSDT',
  INDICATOR: 'RSI',
  SIGNAL_TRIGGER: {
    cross_direction: 'below_to_above',
    position_type: 'long',
    target_value: 70,
    period: 14,
  },
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
    // entry: '',
    // exit: '',
    // strategy: null,
    viewDetails: false,
    backtestPeriod: null,
    customPeriodFrom: null,
    customPeriodTo: null,
    backtestResults: null,
    runBacktestDisabled: false,
  });
  const resultsRef = useRef(null);

  useEffect(() => {
    if (formState.backtestResults !== null && resultsRef.current) {
      // Scroll to the resultsRef element
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState.backtestResults]);

  const numDaysInPeriod = formState.strategy
    ? getDaysInFormPeriod({
        period: formState.backtestPeriod,
        customDates: {
          from: formState.customPeriodFrom,
          to: formState.customPeriodTo,
        },
      })
    : null;

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
          setFormState({
            ...formState,
            strategy: getStrategyToUse(sanitizeConfig(data.config)),
          });
        }
      })
      .catch((error) => {
        console.error('Error creando estrategia: ', error);
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
    setFormState({ ...formState, backtestResults: null });

    console.log('form strat before sending: ', formState.strategy);
    const payloadToSend = buildBacktestRequestPayload(formState);

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
        setFormState({
          ...formState,
          backtestResults: data,
          runBacktestDisabled: true,
        });
      })
      .catch((error) => {
        console.log('Error corriendo backtest: ', error);
        throw new Error('Error corriendo backtest');
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(backtestPromise, {
      loading: 'Analizando estrategia. Puede tardar un poco...',
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
              {/* TODO-p1: Poder editar el JSON de la estrategia. Con un validador del payload  */}
              <div className={styles.stepTitle}>Estrategia creada:</div>
              <StrategyRow
                strategy={formState.strategy}
                className={styles.strategyRow}
              />
              {!formState.viewDetails && (
                <div className={styles.strategyPreview}>
                  {JSON.stringify(formState.strategy, null, 2)}
                </div>
              )}
            </div>
            <div className={styles.strategyDetails}>
              {formState.viewDetails && (
                <JsonStrategy strategy={formState.strategy} />
              )}
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
              <div className={styles.titleWrapper}>
                <div className={styles.stepTitle}>Período a testear:</div>
                <BacktestPeriodsDropdown
                  onChange={(value) => {
                    console.log('valorsito: ', value);
                    setFormState({
                      ...formState,
                      backtestPeriod: value,
                      runBacktestDisabled: false,
                    });
                  }}
                  disabled={loading}
                />
              </div>
              {formState.backtestPeriod === 'custom' && (
                <div className={styles.customDates}>
                  <div className={styles.dateInput}>
                    <label>Desde:</label>
                    <input
                      type="date"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          customPeriodFrom: e.target.value,
                          runBacktestDisabled: false,
                        })
                      }
                    />
                  </div>
                  <div className={styles.dateInput}>
                    <label>Hasta:</label>
                    <input
                      type="date"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          customPeriodTo: e.target.value,
                          runBacktestDisabled: false,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              {numDaysInPeriod >= MAX_DAYS_ALLOWED && (
                <div className={styles.error}>
                  A momento solo permitimos backtestear hasta 45 días a la vez.
                </div>
              )}
            </div>
            <div className={styles.backtestActions}>
              <Button
                color="primary"
                className={styles.runBacktestButton}
                isLoading={loading}
                onClick={handleRunBacktest}
                isDisabled={
                  loading ||
                  formState.runBacktestDisabled ||
                  numDaysInPeriod >= MAX_DAYS_ALLOWED
                }
              >
                Correr Backtest
              </Button>
            </div>
          </div>
          {formState.backtestResults !== null && (
            <div ref={resultsRef}>
              {/* // TODO-p1: crear gráfico (?) */}
              <div className={styles.stepTitle}>Resultados:</div>
              <BacktestResults results={formState.backtestResults} />
              <div className={styles.backtestActions}>
                <Button color="primary" className={styles.saveStrategyButton}>
                  Guardar Estrategia
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StrategyGenerator;
