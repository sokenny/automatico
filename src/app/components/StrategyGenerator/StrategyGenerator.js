'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../store/index';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import getStrategyToUse from '../../helpers/getStrategyToUse';
import getDaysInFormPeriod from '../../helpers/getDaysInFormPeriod';
import validateStrategy from '../../helpers/validateStrategy';
import buildBacktestRequestPayload from '../../helpers/buildBacktestRequestPayload';
import sanitizeConfig from '../../helpers/sanitizeConfig';
import BacktestPeriodsDropdown from '../BacktestPeriodsDropdown/BacktestPeriodsDropdown';
import BacktestResults from '../BacktestResults/BacktestResults';
import JsonStrategy from '../JsonStrategy/JsonStrategy';
import StrategyRow from '../StrategyRow/StrategyRow';
import styles from './StrategyGenerator.module.css';

const MAX_DAYS_ALLOWED = 245;

const mockupGeneratedStrategy = {
  PAIR: 'BTCUSDT',
  INDICATOR: 'CCI',
  SIGNAL_TRIGGER: {
    cross_direction: 'below_to_above',
    position_type: 'long',
    target_value: 200,
    period: 20,
  },
  TAKE_PROFIT: 1,
  STOP_LOSS: 1,
  MAX_WEIGHT_ALLOCATION: 1,
  IDEAL_TRADE_AMOUNT: 1000,
};

const StrategyGenerator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useStore();
  const [formState, setFormState] = useState({
    entry: 'Si BTC cruza el CCI 200, comprá 1k USD.', // lo harcodeamos para testear mas facil
    exit: 'Cerrá la posición con una ganancia del 1% o si la pérdida supera el 1%.', // lo harcodeamos para testear mas facil
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
    errors: {
      strategy: [],
    },
  });
  const resultsRef = useRef(null);

  console.log('formState--: ', formState);

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
          const strategy = getStrategyToUse(sanitizeConfig(data.config));
          const errors = validateStrategy(strategy);
          if (errors.length > 0) {
            toast.warning('Hay algunos parámetros a corregir.');
          } else {
            toast.success('Estrategia generada con éxito');
          }
          setFormState({
            ...formState,
            strategy,
            errors: {
              ...formState.errors,
              strategy: errors,
            },
          });
        } else {
          toast.error('Error generando estrategia');
          setFormState({
            ...formState,
            errors: {
              ...formState.errors,
              strategy: data?.error || 'Error creando estrategia',
            },
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
      error: 'Error creando estrategia',
    });
  }

  async function handleRunBacktest() {
    setLoading(true);
    setFormState({ ...formState, backtestResults: null });

    const payloadToSend = buildBacktestRequestPayload(formState);

    const backtestPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/backtest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...payloadToSend,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('chart data we return:', data.chart_data);
        setFormState({
          ...formState,
          backtestResults: {
            ...data.results,
            backtestId: data.backtest_id,
            chartData: data.chart_data,
          },
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
      // TODO-p2: Crear un "espera estimada X segundos / minutos" en funcion del tick_interval_minutes y la cantidad de dias en el periodo
      loading: 'Analizando estrategia. Puede tardar un poco...',
      success: (data) => {
        return `Backtest finalizado con éxito`;
      },
      error: 'Error corriendo backtest',
    });
  }

  async function handleSaveStrategy() {
    setLoading(true);

    const payload = {
      backtestId: formState.backtestResults.backtestId,
      userId: user.id,
      name: 'Strategy from backtest ' + formState.backtestResults.backtestId,
      config: formState.strategy,
    };

    const saveStrategyPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/strategy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success('Estrategia guardada con éxito');
          setFormState({ ...formState, createdStrategyId: data.strategy_id });
          router.push(`/strategy/${data.strategy_id}`);
        } else {
          toast.error('Error guardando estrategia');
        }
      })
      .catch((error) => {
        console.error('Error guardando estrategia: ', error);
        throw new Error('Error guardando estrategia');
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(saveStrategyPromise, {
      loading: 'Guardando estrategia...',
      error: 'Error guardando estrategia',
    });
  }

  function toggleDetails() {
    setFormState({ ...formState, viewDetails: !formState.viewDetails });
  }

  if (!user) {
    return 'Loading...';
  }

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
              {/* TODO-p2: Refactor de StrategyGenerator para que sea mas legible */}
              {/* TODO-p2: Poder editar la estrategia. Permitir editar el JSON o introducir campos tipo inputs  */}
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
            {typeof formState.errors.strategy == 'string' ||
              (formState.errors.strategy.length > 0 && (
                <div className={styles.strategyErrors}>
                  <div className={styles.errorsTitle}>
                    Corregí los siguientes parámetros para continuar:
                  </div>
                  <div className={styles.errorsList}>
                    {formState.errors.strategy.map((error, index) => (
                      <div key={index} className={styles.error}>
                        <div className={styles.field}>{error.field}:</div>
                        <div>{error.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.step}>
            <div className={styles.backtestPeriod}>
              <div className={styles.titleWrapper}>
                <div className={styles.stepTitle}>Período a testear:</div>
                <BacktestPeriodsDropdown
                  onChange={(value) => {
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
                isLoading={loading && !formState?.createdStrategyId}
                onClick={handleRunBacktest}
                isDisabled={
                  loading ||
                  formState.runBacktestDisabled ||
                  numDaysInPeriod >= MAX_DAYS_ALLOWED ||
                  formState.errors.strategy.length > 0
                }
              >
                Correr Backtest
              </Button>
            </div>
          </div>
          {formState.backtestResults !== null && (
            <div ref={resultsRef}>
              <div className={styles.stepTitle}>Resultados:</div>
              <BacktestResults results={formState.backtestResults} />
              <div className={styles.backtestActions}>
                <Button
                  color="primary"
                  className={styles.saveStrategyButton}
                  onClick={handleSaveStrategy}
                  isDisabled={loading}
                  isLoading={loading}
                >
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
