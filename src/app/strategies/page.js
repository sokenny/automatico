import ma8Fetch from '@/app/helpers/ma8Fetch';
import StrategiesTable from '@/app/components/StrategiesTable/StrategiesTable';
import styles from './page.module.css';

export default async function StrategiesPage() {
  const res = await ma8Fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/strategies`,
    {
      cache: 'force-cache',
    },
  );

  if (res.status === 401) {
    return <>Unauthorized</>;
  }

  const strategies = await res.json();

  console.log('strategies: ', strategies);

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
