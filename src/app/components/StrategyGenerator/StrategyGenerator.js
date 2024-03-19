'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../store/index';
import { Button, useDisclosure } from '@nextui-org/react';
import { toast } from 'sonner';
import getStrategyToUse from '../../helpers/getStrategyToUse';
import getDaysInFormPeriod from '../../helpers/getDaysInFormPeriod';
import getTotalCandlesToAnalyse from '../../helpers/getTotalCandlesToAnalyse';
import defaultPeriodsFromTickSize from '../../constants/defaultPeriodsFromTickSize';
import validateStrategy from '../../helpers/validateStrategy';
import setMissingDefaults from '../../helpers/setMissingDefaults';
import promptExamples from '../../helpers/promptExamples';
import buildBacktestRequestPayload from '../../helpers/buildBacktestRequestPayload';
import sanitizeConfig from '../../helpers/sanitizeConfig';
import BacktestConfigFields from '../BacktestConfigFields/BacktestConfigFields';
import CandleSizeExceededModal from '../Modals/CandleSizeExceededModal/CandleSizeExceededModal';
import ErrorStrategyModal from '../Modals/ErrorStrategyModal/ErrorStrategyModal';
import BacktestResults from '../BacktestResults/BacktestResults';
import StrategyConfigFields from '../StrategyConfigFields/StrategyConfigFields';
import styles from './StrategyGenerator.module.css';

const MAX_CANDLES_ALLOWED = 50000;
const AVG_CANDLES_PROCESSED_PER_SECOND = 516;

const mockupGeneratedStrategy = {
  PAIR: 'BTCUSDT',
  INDICATOR: 'RSI',
  ENTRY_TRIGGER: {
    cross_direction: 'below_to_above',
    position_type: 'long',
    target_value: 60,
    period: 14,
  },
  EXIT_TRIGGER: null,
  TAKE_PROFIT: 1,
  STOP_LOSS: 1,
  MAX_WEIGHT_ALLOCATION: 1,
  IDEAL_TRADE_AMOUNT: 1000,
};

// TODO-p1: Crear pagina de documentacion
// TODO-p1: Allow creating a backtest from an existing strategy.This auto-fills the strategy generator with the provided strategy config
// TODO-p2: Add quesiton mark tooltips a 'entry' y 'exit'
// TODO-p2: Create redis cache db

const StrategyGenerator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isCandleModalOpen,
    onOpen: onOpenCandleModal,
    onOpenChange: onOpenCandleModalChange,
  } = useDisclosure();
  const {
    isOpen: isErrorStrategyModalOpen,
    onOpen: onOpenErrorStrategyModal,
    onOpenChange: onOpenErrorStrategyModalChange,
  } = useDisclosure();

  const { user, token } = useStore();

  const randomExample = useRef(
    promptExamples[Math.floor(Math.random() * promptExamples.length)],
  );

  const [formState, setFormState] = useState({
    // entry: 'Si BTC cruza el RSI 60, comprá 1k USD.', // lo harcodeamos para testear mas facil
    // exit: 'Cerrá la posición con una ganancia del 1% o si la pérdida supera el 1%.', // lo harcodeamos para testear mas facil
    // strategy: getStrategyToUse(mockupGeneratedStrategy), // lo harcodeamos para testear mas facil
    entry: randomExample.current.entry,
    exit: randomExample.current.exit,
    strategy: null,
    backtestPeriod: 'week',
    customPeriodFrom: null,
    customPeriodTo: null,
    backtestResults: null,
    errors: {
      strategyGeneration: null,
      strategyConfig: [],
    },
  });

  console.log('formState: ', formState);
  const resultsRef = useRef(null);

  useEffect(() => {
    onOpenErrorStrategyModal();
  }, [onOpenErrorStrategyModal]);

  useEffect(() => {
    if (formState.strategy) {
      const errors = validateStrategy(formState.strategy);
      setFormState({
        ...formState,
        errors: {
          ...formState.errors,
          strategyConfig: errors,
        },
      });
    }
  }, [formState.strategy, setFormState]);

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
          'Authorization': `Bearer ${token}`,
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
            backtestPeriod:
              defaultPeriodsFromTickSize[strategy.TICK_INTERVAL_MINUTES] ||
              'week',
            errors: {
              ...formState.errors,
              strategyConfig: errors,
            },
          });
        } else {
          toast.error('Error generando estrategia');
          setFormState({
            ...formState,
            errors: {
              ...formState.errors,
              strategyGeneration: data?.error || 'Error creando estrategia',
            },
          });
          onOpenErrorStrategyModal();
        }
      })
      .catch((error) => {
        console.error('Error creando estrategia: ', error);
        setLoading(false);
        throw new Error('Error creando estrategia');
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(strategyPromise, {
      loading: 'Creando estrategia...',
      error: 'Error creando estrategia',
    });
  }

  async function handleRunBacktest() {
    // check amount of candles that will be iterated, if necessary pop modal
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
          userId: user?.id,
          ...payloadToSend,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setFormState({
          ...formState,
          backtestResults: {
            ...data.results,
            backtestId: data.backtest_id,
          },
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
      <ErrorStrategyModal
        isOpen={isErrorStrategyModalOpen}
        onOpenChange={onOpenErrorStrategyModalChange}
        error={formState?.errors?.strategyGeneration}
      />
      <div className={styles.feedback}>
        <div className={styles.items}>
          <div className={styles.item}>
            -<b>Discord:</b> Te gustaría tener acceso gratis de por vida? Sumate
            a discord y danos tu feedback :){' '}
            <a href="https://discord.gg/3mEEmD45">
              https://discord.gg/3mEEmD45
            </a>
          </div>
          <div className={styles.item}>
            -<b>Solicitá features:</b> Tenés un feature request?{' '}
            <a href="https://ma8.canny.io/feature-requests/">
              Publicalo en canny! 🙏
            </a>{' '}
            También vas a poder ver en que estamos trabajando.
          </div>
          <div className={styles.item}>
            -<b>Dev:</b> juanchaher99@gmail.com
          </div>
        </div>
      </div>
      <div className={`${styles.aiPrompt} ${styles.step}`}>
        <div className={styles.tutorial}>
          <a
            href="https://www.loom.com/share/0953b357dfad494da4c81f36589a3c6e?sid=9ce5993c-9466-4f3e-b15f-6d00068b2a78"
            target="_blank"
            rel="noreferrer"
          >
            Click aquí para ver tutorial (2 min.)
          </a>
        </div>
        <div className={styles.entryAndExitContainer}>
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
          {formState.errors.strategyGeneration && (
            <div className={styles.errorsList}>
              <div key={index} className={styles.error}>
                <div>{formState.errors.strategyGeneration}</div>
              </div>
            </div>
          )}
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
            <div className={styles.createdStrategyHeader}>
              <div className={styles.stepTitle}>Estrategia creada:</div>
              <div className={styles.tutorial}>
                <a
                  href="https://www.loom.com/share/0980f2e336de45c88a2c1eb444653acd?sid=b85d8080-671e-4628-9074-59e76fba8d84"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tutorial Vid 1 (5 min.)
                </a>
                <span> --- </span>
                <a
                  href="https://www.loom.com/share/57598054ca5a4a7ba94018d547b8f728"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tutorial Vid 2 (2 min.)
                </a>
              </div>
            </div>
            <div className={styles.strategyDetails}>
              <StrategyConfigFields
                strategy={formState.strategy}
                setStrategy={(strategy) =>
                  setFormState({
                    ...formState,
                    strategy: {
                      ...formState.strategy,
                      ...strategy,
                    },
                  })
                }
              />
            </div>
            <div className={styles.stratDetailsActions}>
              <div className={styles.viewDocs}>
                {/* <a>Consultar documentación</a> */}
              </div>
            </div>
            {formState.errors.strategyConfig.length > 0 && (
              <div className={styles.strategyErrors}>
                <div className={styles.errorsTitle}>
                  Corregí los siguientes parámetros para continuar:
                </div>
                <div className={styles.errorsList}>
                  {formState.errors.strategyConfig.map((error, index) => (
                    <div key={index} className={styles.error}>
                      <div className={styles.field}>{error.field}:</div>
                      <div>{error.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  A momento solo permitimos analizar hasta{' '}
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
                  formState.errors.strategyConfig.length > 0 ||
                  !user?.id
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
