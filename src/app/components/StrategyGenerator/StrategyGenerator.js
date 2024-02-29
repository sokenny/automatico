'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../store/index';
import { Button, useDisclosure } from '@nextui-org/react';
import { toast } from 'sonner';
import getStrategyToUse from '../../helpers/getStrategyToUse';
import getDaysInFormPeriod from '../../helpers/getDaysInFormPeriod';
import getTotalCandlesToAnalyse from '../../helpers/getTotalCandlesToAnalyse';
import validateStrategy from '../../helpers/validateStrategy';
import setMissingDefaults from '../../helpers/setMissingDefaults';
import buildBacktestRequestPayload from '../../helpers/buildBacktestRequestPayload';
import sanitizeConfig from '../../helpers/sanitizeConfig';
import BacktestConfigFields from '../BacktestConfigFields/BacktestConfigFields';
import CandleSizeExceededModal from '../Modals/CandleSizeExceededModal/CandleSizeExceededModal';
import BacktestResults from '../BacktestResults/BacktestResults';
import StrategyConfigFields from '../StrategyConfigFields/StrategyConfigFields';
import styles from './StrategyGenerator.module.css';

const MAX_CANDLES_ALLOWED = 50000;
const AVG_CANDLES_PROCESSED_PER_SECOND = 516;

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
  const {
    isOpen: isCandleModalOpen,
    onOpen: onOpenCandleModal,
    onOpenChange: onOpenCandleModalChange,
  } = useDisclosure();
  const { user } = useStore();
  const [formState, setFormState] = useState({
    entry: 'Si BTC cruza el CCI 200, comprá 1k USD.', // lo harcodeamos para testear mas facil
    exit: 'Cerrá la posición con una ganancia del 1% o si la pérdida supera el 1%.', // lo harcodeamos para testear mas facil
    strategy: getStrategyToUse(mockupGeneratedStrategy), // lo harcodeamos para testear mas facil
    // entry: '',
    // exit: '',
    // strategy: null,
    backtestPeriod: 'week',
    customPeriodFrom: null,
    customPeriodTo: null,
    backtestResults: null,
    runBacktestDisabled: false,
    errors: {
      strategy: [],
    },
    isValidStrategy: false,
  });
  const resultsRef = useRef(null);

  console.log('formState--: ', formState);

  useEffect(() => {
    if (formState.backtestResults !== null && resultsRef.current) {
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
            strategy: setMissingDefaults(strategy),
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
    // check amount of candles that will be iterated, if necessary pop modal
    console.log('numdaysinperiod: ', numDaysInPeriod);

    console.log('candlesToAnalyse: ', candlesToAnalyse);
    if (candlesToAnalyse > MAX_CANDLES_ALLOWED) {
      onOpenCandleModal();
      return;
    }

    setLoading(true);
    setFormState({ ...formState, backtestResults: null });

    const estimatedWait = Math.round(
      candlesToAnalyse / AVG_CANDLES_PROCESSED_PER_SECOND,
    );
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
      loading:
        'Analizando estrategia. Espera estimada:  ' +
        estimatedWait +
        ' segundos...',
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

  const candlesToAnalyse = getTotalCandlesToAnalyse({
    days: numDaysInPeriod,
    tickSize: formState.strategy?.TICK_INTERVAL_MINUTES,
  });

  if (!user) {
    return 'Loading...';
  }

  return (
    <div>
      <CandleSizeExceededModal
        isOpen={isCandleModalOpen}
        onOpenChange={onOpenCandleModalChange}
        candlesSize={candlesToAnalyse}
        maxCandlesAllowed={MAX_CANDLES_ALLOWED}
        tickSize={formState.strategy?.TICK_INTERVAL_MINUTES}
        totalDays={numDaysInPeriod}
      />
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
              <div className={styles.stepTitle}>Estrategia creada:</div>
            </div>
            <div className={styles.strategyDetails}>
              <StrategyConfigFields
                strategy={formState.strategy}
                isEditing={formState.backtestResults === null}
                setStrategy={(strategy) =>
                  setFormState({
                    ...formState,
                    strategy: {
                      ...formState.strategy,
                      ...strategy,
                    },
                  })
                }
                onIsValidChange={(isValid) =>
                  setFormState({
                    ...formState,
                    isValidStrategy: isValid,
                  })
                }
              />
            </div>
            <div className={styles.stratDetailsActions}>
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
                <div className={styles.stepTitle}>Backtest settings:</div>
              </div>
              <BacktestConfigFields
                formState={formState}
                setFormState={setFormState}
              />
              {candlesToAnalyse >= MAX_CANDLES_ALLOWED && (
                <div className={styles.error}>
                  A momento solo permitimos analizando hasta{' '}
                  {MAX_CANDLES_ALLOWED / 1000}k velas por cada backtest. Por tu
                  configuración actual, estarías analizando{' '}
                  {candlesToAnalyse / 1000}k velas.
                </div>
              )}
            </div>
            <div className={styles.backtestActions}>
              {/* TODO-p2: Add 'share strategy' button */}
              <Button
                color="primary"
                className={styles.runBacktestButton}
                isLoading={loading && !formState?.createdStrategyId}
                onClick={handleRunBacktest}
                isDisabled={
                  loading ||
                  formState.runBacktestDisabled ||
                  formState.errors.strategy.length > 0 ||
                  !formState.isValidStrategy
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
