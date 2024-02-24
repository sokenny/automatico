import styles from './page.module.css';

// TODO-p1: Popular esta pag con info basica almenos. Y la table de backtests de NextUI
export default async function ExperimentPage({ params }) {
  const strategyId = params.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/strategy/${strategyId}`,
    {
      cache: 'no-store',
    },
  );

  const strategy = await res.json();

  return <div className={styles.Strategy}>{JSON.stringify(strategy)}</div>;
}
