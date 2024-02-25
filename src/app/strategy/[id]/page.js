import HeaderActions from './HeaderActions/HeaderActions';
import BacktestsTable from './BacktestsTable/BacktestsTable';
import styles from './page.module.css';
import JsonStrategy from '@/app/components/JsonStrategy/JsonStrategy';

// TODO-p1: Popular esta pag con info basica almenos. Y la table de backtests de NextUI
export default async function StrategyPage({ params }) {
  const strategyId = params.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/strategy/${strategyId}`,
    {
      cache: 'no-store',
    },
  );

  const strategy = await res.json();

  function getBacktestRows(backtests) {
    return backtests.map((backtest) => {
      return {
        id: backtest.id,
        period_start_at: backtest.period_start_at,
        period_end_at: backtest.period_end_at,
        initial_balance: backtest.initial_balance,
        end_balance: backtest.end_balance,
        roi: backtest.roi,
      };
    });
  }

  const strategyCopy = { ...strategy };
  delete strategyCopy.backtests;
  const backtestRows = getBacktestRows(strategy.backtests);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.colLeft}>
          <div className={styles.title}>{strategy.name}</div>
        </div>
        <div className={styles.colRight}>
          <HeaderActions />
        </div>
      </div>
      <div className={styles.strategyConfig}>
        <JsonStrategy strategy={strategyCopy} />
      </div>
      {backtestRows.length > 0 && (
        <div className={styles.backtests}>
          <BacktestsTable rows={backtestRows} />
        </div>
      )}
      {/* {JSON.stringify(strategy)} */}
    </div>
  );
}
