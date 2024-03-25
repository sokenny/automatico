'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import Link from 'next/link';
import styles from './ErrorStrategyModal.module.css';

const ErrorStrategyModal = ({ isOpen, onOpenChange, error }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className={`flex flex-col gap-1 ${styles.title}`}>
              {error ? (
                <>
                  Error generando estrategia: <span>{error}</span>
                </>
              ) : (
                <>Recordá que:</>
              )}
            </ModalHeader>
            <ModalBody className={styles.body}>
              {error && <p>Recordá que:</p>}
              <p>
                <div className={styles.items}>
                  <div>
                    <b>1.</b> A momento solo permitimos criterios de entrada a
                    partir de los indicadores:{' '}
                    <span>MACD, Bollinger Bands, RSI, SMA, EMA, CCI</span>.
                  </div>
                  <div>
                    <b>2.</b> Solo trabajamos con <span>cryptos</span>, siempre
                    sobre el <span>USDT</span>.
                  </div>
                  <div>
                    <b>3.</b> El criterio de salida puede ser a partir de un{' '}
                    <span>stop loss</span> y <span>take profit</span> cumplido o
                    a partir de un indicador, similar a como entramos.
                  </div>
                </div>
                <br />
                Por ejemplo: <br />
                <b>Entry</b>: Si el RSI de ETHUSDT en velas de 5 minutos es
                mayor a 70, comprar 1k USDT.
                <br />
                <b>Exit</b>: Al alcanzar un profit de 3% o pérdida de 1% cerrar
                la posición.
                <div className={styles.tutorial}>
                  <Link href="/guide">Ver guía de como usar</Link>
                </div>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className={styles.button}
              >
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                className={styles.button}
              >
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ErrorStrategyModal;
