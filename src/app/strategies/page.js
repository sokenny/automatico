'use client';
import useStore from '@/app/store/index';
import StrategiesTable from '@/app/components/StrategiesTable/StrategiesTable';
import styles from './page.module.css';

export default function StrategiesPage() {
  const { user } = useStore();

  if (!user) {
    return <>Loading...</>;
  }

  const strategies = user.strategies;

  function getStrategyRows(strategies) {
    return strategies.map((strategy) => {
      return {
        id: strategy.id,
        name: strategy.name,
        pair: strategy.config.PAIR,
        indicator: strategy.config.INDICATOR,
        backtests: strategy.backtests.length,
        created_at: strategy.created_at,
      };
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.colLeft}>
          <h1 className={styles.title}>Strategies</h1>
        </div>
      </div>
      <div>
        <StrategiesTable rows={getStrategyRows(strategies)} />
      </div>
    </div>
  );
}
