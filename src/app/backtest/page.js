import StrategyGenerator from '../components/StrategyGenerator/StrategyGenerator';
import styles from './page.module.css';

function Backtest() {
  return (
    <div className={styles.container}>
      <StrategyGenerator />
    </div>
  );
}

export default Backtest;
