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

const ErrorStrategyModal = ({ isOpen, onOpenChange, errors }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className={`flex flex-col gap-1 ${styles.title}`}>
              Error generando estrategia: <span>{errors[0]}</span>
            </ModalHeader>
            <ModalBody className={styles.body}>
              <p>Recordá que:</p>
              <p>
                <ul>
                  <li>
                    <b>1.</b> A momento solo permitimos criterios de entrada a
                    partir de los indicadores: <span>SMA, EMA, RSI, CCI</span>.
                  </li>
                  <li>
                    <b>2.</b> Solo trabajamos con <span>cryptos</span>, siempre
                    sobre el <span>USDT</span>.
                  </li>
                  <li>
                    <b>3.</b> El criterio de salida tiene que ser a partir de un{' '}
                    <span>stop loss</span> o un <span>take profit</span>{' '}
                    cumplido.
                  </li>
                </ul>
                <br />
                Por ejemplo: <br />
                <b>Entry</b>: Si el RSI de ETHUSDT en velas de 5 minutos es
                mayor a 70, comprar 1k USDT.
                <br />
                <b>Exit</b>: Si el precio de ETHUSDT baja un 5% o sube un 3%,
                cerrar la posición.
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
