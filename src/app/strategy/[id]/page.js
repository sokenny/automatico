import ma8Fetch from '@/app/helpers/ma8Fetch';
import HeaderActions from './HeaderActions/HeaderActions';
import BacktestsTable from './BacktestsTable/BacktestsTable';
import StrategyConfigFields from '@/app/components/StrategyConfigFields/StrategyConfigFields';
import styles from './page.module.css';

export default async function StrategyPage({ params }) {
  const strategyId = params.id;

  const res = await ma8Fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/strategy/${strategyId}`,
  );

  if (res.status === 404) {
    return <>Not found</>;
  }

  if (res.status === 401) {
    return <>Unauthorized</>;
  }

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
        <StrategyConfigFields strategy={strategyCopy.config} />
      </div>
      {backtestRows.length > 0 && (
        <div className={styles.backtests}>
          <h3 className={styles.sectionTitle}>Backtests</h3>
          <BacktestsTable rows={backtestRows} />
        </div>
      )}
    </div>
  );
}
