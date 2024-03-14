import styles from './StrategyRow.module.css';

const StrategyRow = ({ strategy, className }) => {
  return (
    <div className={`${styles.container} ${className ? className : ''}`}>
      <div className={`${styles.dataPoint} ${styles.won}`}>
        <div className={styles.dataPointTitle}>Pair</div>
        <div className={styles.dataPointValue}>{strategy.PAIR}</div>
      </div>
      <div className={`${styles.dataPoint} ${styles.lost}`}>
        <div className={styles.dataPointTitle}>Trade Amount</div>
        <div className={styles.dataPointValue}>
          USDT {strategy.IDEAL_TRADE_AMOUNT}
        </div>
      </div>
      <div className={`${styles.dataPoint} ${styles.won}`}>
        <div className={styles.dataPointTitle}>Balance</div>
        <div className={styles.dataPointValue}>
          USDT {strategy.INITIAL_BALANCE}
        </div>
      </div>
      <div className={`${styles.dataPoint} ${styles.lost}`}>
        <div className={styles.dataPointTitle}>Indicator</div>
        <div className={styles.dataPointValue}>
          {strategy.INDICATOR}
          {strategy.ENTRY_TRIGGER?.period
            ? `(${strategy.ENTRY_TRIGGER?.period})`
            : ''}
          {strategy.ENTRY_TRIGGER?.target_value
            ? strategy.ENTRY_TRIGGER?.target_value
            : ''}
        </div>
      </div>
      <div className={`${styles.dataPoint} ${styles.lost}`}>
        <div className={styles.dataPointTitle}>Position Type</div>
        <div className={styles.dataPointValue}>
          {strategy.ENTRY_TRIGGER?.position_type}
        </div>
      </div>
      <div className={`${styles.dataPoint} ${styles.won}`}>
        <div className={styles.dataPointTitle}>Candle Size</div>
        <div className={styles.dataPointValue}>
          {strategy.CANDLE_SIZE_MINUTES} min.
        </div>
      </div>
      <div className={`${styles.dataPoint} ${styles.lost}`}>
        <div className={styles.dataPointTitle}>Take Profit</div>
        <div className={styles.dataPointValue}>{strategy.TAKE_PROFIT}</div>
      </div>
      <div className={`${styles.dataPoint} ${styles.lost}`}>
        <div className={styles.dataPointTitle}>Stop Loss</div>
        <div className={styles.dataPointValue}>{strategy.STOP_LOSS}</div>
      </div>
    </div>
  );
};

export default StrategyRow;
