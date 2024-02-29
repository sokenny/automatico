'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import styles from './CandleSizeExceededModal.module.css';

const CandleSizeExceededModal = ({
  isOpen,
  onOpenChange,
  candlesSize,
  maxCandlesAllowed,
  tickSize,
  totalDays,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className={`flex flex-col gap-1 ${styles.title}`}>
              Max. Candle Size Exceeded ({maxCandlesAllowed / 1000}k)
            </ModalHeader>
            <ModalBody className={styles.body}>
              <p>
                You are about to backtest a strategy with a tick interval of{' '}
                <span>{tickSize}</span> minutes, over a total of{' '}
                <span>{totalDays}</span> days period. This means that we will be
                processing a total of <span>{candlesSize / 1000}k</span>{' '}
                candles.
              </p>
              <p>
                In this Beta version we only allow up to{' '}
                <span>{maxCandlesAllowed / 1000}k</span> candles to be
                backtested per run.
              </p>
              <p>
                Please reduce the tick size or the total days to backtest in
                order to proceed.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className={styles.button}
              >
                Close
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                className={styles.button}
              >
                I understand
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CandleSizeExceededModal;
