import styles from './page.module.css';

export default async function BacktestPage({ params }) {
  const backtestId = params.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/backtest/${backtestId}/log`,
    {
      cache: 'force-cache',
    },
  );

  const log = await res.text();

  return (
    <div className={styles.container}>
      <pre>{log}</pre>
    </div>
  );
}
