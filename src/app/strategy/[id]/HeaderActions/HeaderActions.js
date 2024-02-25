'use client';
import { useState } from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import styles from './HeaderActions.module.css';

const HeaderActions = () => {
  const [receiveAlertsTooltip, setReceiveAlertsTooltip] = useState(false);
  const [automateTradingTooltip, setAutomateTradingTooltip] = useState(false);
  return (
    <div className={styles.container}>
      <Tooltip
        isOpen={receiveAlertsTooltip}
        onOpenChange={(isOpen) => setReceiveAlertsTooltip(isOpen)}
        showArrow
        content="En progreso: Pronto podrás recibir alertas vía email."
        className={styles.tooltip}
        closeDelay={0}
        color="primary"
      >
        <Button
          color="primary"
          className={`${styles.button} ${styles.receiveAlertsBtn}`}
        >
          Receive Alerts
        </Button>
      </Tooltip>
      <Tooltip
        isOpen={automateTradingTooltip}
        onOpenChange={(isOpen) => setAutomateTradingTooltip(isOpen)}
        showArrow
        content="En progreso: Pronto podrás conectar esta estrategia a tu broker y operar automáticamente."
        className={styles.tooltip}
        closeDelay={0}
        color="primary"
      >
        <Button
          color="primary"
          className={`${styles.button} ${styles.automateTradingBtn}`}
        >
          Automate Trading
        </Button>
      </Tooltip>
    </div>
  );
};

export default HeaderActions;
