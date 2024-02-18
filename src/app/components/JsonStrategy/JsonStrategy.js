'use client';
import { useState } from 'react';
import { Tooltip } from '@nextui-org/react';
import styles from './JsonStrategy.module.css';

const JsonStrategy = ({ strategy }) => {
  const [openJsonTooltip, setOpenJsonTooltip] = useState(false);
  return (
    <div className={styles.container}>
      <Tooltip
        isOpen={openJsonTooltip}
        onOpenChange={(isOpen) => setOpenJsonTooltip(isOpen)}
        showArrow
        content="Para entender qué función cumple cada parámetro, por favor consultá la documentación."
        className={styles.tooltip}
        closeDelay={0}
        placement="top-start"
        color="primary"
        delay={1500}
      >
        <pre>{JSON.stringify(strategy, null, 2)}</pre>
      </Tooltip>
    </div>
  );
};

export default JsonStrategy;
