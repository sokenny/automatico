import BacktestChart from '@/app/components/BacktestChart/BacktestChart';
import OperationsTable from '@/app/components/OperationsTable/OperationsTable';
import styles from './page.module.css';

export default async function BacktestPage({ params }) {
  const backtestId = params.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/backtest/${backtestId}`,
    {
      cache: 'force-cache',
    },
  );

  const backtest = await res.json();

  function getOperationsRows(operations) {
    return operations.map((operation) => {
      return {
        id: operation.id,
        type: operation.type,
        amount: operation.amount.toFixed(2),
        quantity: operation.quantity,
        open_price: operation.open_price,
        exit_price: operation.exit_price,
        open_time: operation.open_time,
        close_time: operation.close_time,
        pnl: operation.pnl,
      };
    });
  }

  const operationsRows = getOperationsRows(backtest.operations);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.colLeft}>
          <div className={styles.title}>Backtest #{backtest.id}</div>
          <div className={styles.period}>
            <div>{backtest.period_start_at}</div>
            <div className={styles.separator}>-</div>
            <div>{backtest.period_end_at}</div>
          </div>
        </div>
        <div className={styles.colRight}>{/* <HeaderActions /> */}</div>
      </div>
      <div className={styles.results}>
        <div className={styles.chart}>
          <BacktestChart
            closedOperations={backtest.operations}
            chartData={backtest.chart_data}
          />
        </div>
        {operationsRows.length > 0 && (
          <div className={styles.operations}>
            <OperationsTable rows={operationsRows} />
          </div>
        )}
      </div>
    </div>
  );
}
