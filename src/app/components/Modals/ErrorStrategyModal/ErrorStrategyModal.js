'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
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
                    partir de los indicadores: <span>SMA, EMA, RSI, CCI</span>.
                  </div>
                  <div>
                    <b>2.</b> Solo trabajamos con <span>cryptos</span>, siempre
                    sobre el <span>USDT</span>.
                  </div>
                  <div>
                    <b>3.</b> El criterio de salida tiene que ser a partir de un{' '}
                    <span>stop loss</span> o un <span>take profit</span>{' '}
                    cumplido.
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
                  <a
                    href="https://www.loom.com/share/0953b357dfad494da4c81f36589a3c6e?sid=9ce5993c-9466-4f3e-b15f-6d00068b2a78"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver mini tutorial (2 min.)
                  </a>
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
