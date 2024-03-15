import { useState } from 'react';
import Link from 'next/link';
import CandleStickChart from '../CandleStickChart/CandleStickChart';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import unixToDate from '../../helpers/unixToDate';
import styles from './BacktestResults.module.css';

const BacktestResults = ({ results }) => {
  const [viewResultsDetails, setViewResultsDetails] = useState(false);
  const profit =
    Math.round((results.end_balance - results.config.initial_balance) * 100) /
    100;
  return (
    <div className={styles.container}>
      <div className={styles.tradedPeriod}>
        {unixToDate(results.traded_period.from / 1000)} -{' '}
        {unixToDate(results.traded_period.to / 1000)}
      </div>
      <div>
        <ErrorBoundary>
          <CandleStickChart
            backtestId={results.backtestId}
            className={styles.chart}
          />
        </ErrorBoundary>
      </div>
      <div className={styles.row}>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}># Ganadas</div>
          <div className={styles.dataPointValue}>{results.won}</div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}># Perdidas</div>
          <div className={styles.dataPointValue}>{results.lost}</div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}>Profit</div>
          <div
            className={`${styles.dataPointValue} ${
              profit > 0 ? styles.won : styles.lost
            }`}
          >
            USDT {profit}
          </div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}>Balance final</div>
          <div className={styles.dataPointValue}>
            USDT {results.end_balance}
          </div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}>Roi</div>
          <div className={styles.dataPointValue}>{results.roi}%</div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.dataPointTitle}>Posiciones sin cerrar</div>
          <div className={styles.dataPointValue}>
            {results.positions_left_open}
          </div>
        </div>
      </div>
      {viewResultsDetails && (
        <div className={styles.resultDetails}>
          <pre>{JSON.stringify({ ...results, chartData: '...' }, null, 2)}</pre>
        </div>
      )}
      <div className={styles.viewActions}>
        <div onClick={() => setViewResultsDetails(!viewResultsDetails)}>
          {viewResultsDetails ? 'Ocultar' : 'Ver'} detalles
        </div>
        <div>
          <Link href={`/backtest/${results.backtestId}/log`} target="_blank">
            ver log completo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BacktestResults;
