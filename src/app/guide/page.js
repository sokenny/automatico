import { Button } from '@nextui-org/react';
import Link from 'next/link';
import validIndicators from '../helpers/validIndicators';
import strategyFieldsTooltips from '../constants/strategyFieldsTooltips';
import backtestFieldsTooltips from '../constants/backtestFieldsTooltips';
import configKeyToLabel from '../constants/configKeyToLabel';
import styles from './page.module.css';

function Guide() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Guía de uso</h1>
      </div>
      <div className={styles.sectionsList}>
        <ul className={styles.list}>
          <li>
            <span>1.</span> Crear una estrategia
            <ul className={styles.subList}>
              <li>
                <span>-</span> Criterio de entrada
              </li>
              <li>
                <span>-</span> Criterio de salida
              </li>
            </ul>
          </li>
          <li>
            <span>2.</span> Editar los parámetros de la estrategia
          </li>
          <li>
            <span>3.</span> Editar los parámetros del backtest
          </li>
        </ul>
      </div>
      <section className={styles.section}>
        <h2>1. Crear una estrategia</h2>
        <div className={styles.loomContainer}>
          <div>
            <iframe
              src="https://www.loom.com/embed/adc6f34bf1fe4ce3ac849396cb4d7734?sid=28444408-debd-4eba-97c1-d09a05c255ae"
              frameBorder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <h3>- Criterio de entrada:</h3>
        <p>
          Definí qué condiciones se deben cumplir para abrir una posición. Estas
          condiciones deben basarse en alguno de los siguientes indicadores :{' '}
          <span className={styles.indicators}>
            {validIndicators.join(', ')}
          </span>
          .
        </p>
        <p>Algunos ejemplos válidos son:</p>
        <div className={styles.examples}>
          <div className={styles.entryEx}>
            Cuando XRPUSDT supere el valor 60 de RSI en velas diarias, abrir
            posición short con 1500 USDT.
          </div>
          <div className={styles.entryEx}>
            Cuando el RSI14 de BTCUSDT caiga por debajo de 30 en velas de 1
            hora, abrir posición long con 1000 USDT. Apalancamiento x3.
          </div>
          <div className={styles.entryEx}>
            Cuando ROSE cruce el SMA20 en velas de 5 minutos, abrir posición de
            tipo SHORT de 500 USDT.
          </div>
        </div>
        <p>
          Como podes ver, hay ejemplos que especifican un tamaño de velas a
          utilizar. Otros no. Lo mismo puede pasar por ejemplo con el
          apalancamiento, u otros parámetros. En ocasiones donde no se
          especifica cierta información, nuestro software va a elegir un
          parámetro por default que el usuario puede modificar posteriormente.
        </p>
        <div className={styles.exitCriteria}>
          <h3>- Criterio de salida:</h3>
          <p>
            Existen 2 criterios principales de salida. De tipo{' '}
            <span>take profit & stop loss</span> o de tipo{' '}
            <span>indicador</span>.
          </p>
          <p>
            <span>Take Profit & Stop Loss:</span> Cierran la posición al cumplir
            una determinada ganancia o pérdida. Ejemplos:
          </p>
          <div className={styles.exitEx}>
            Salir cuando se logre un recorrido de precio de 3% a favor o 1% en
            contra.
          </div>
          <p>
            <span>Indicador:</span> Cierran cuando se activa una señal de un
            indicador, tal como los criterios de entrada que vimos arriba.
            Ejemplo:
          </p>
          <div className={styles.exitEx}>
            Salir cuando el precio de XRPUSDT cruce hacia abajo el EMA50.
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>2. Editar los parámetros de la estrategia</h2>
        <div className={styles.loomContainer}>
          <div>
            <iframe
              src="https://www.loom.com/embed/28be6b9c25f347d29d9a8df00761fc74?sid=e976f9fb-fc24-485d-bb91-36d212c4be2e"
              frameBorder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <p>
          Una vez generada la estrategia, podés editar los parámetros en caso de
          que no reflejen exactamente lo que necesitas. A continuación está la
          descripción de cada uno de ellos.
        </p>
        <div className={styles.parametersList}>
          {Object.keys(strategyFieldsTooltips).map((key) => {
            if (key.includes('EXIT_TRIGGER')) {
              return null;
            }
            return (
              <div key={key} className={styles.parameter}>
                <span>{configKeyToLabel[key]}:</span>{' '}
                {strategyFieldsTooltips[key]}
              </div>
            );
          })}
        </div>
      </section>
      <section className={styles.section}>
        <h2>3. Editar los parámetros del backtest</h2>
        <div className={styles.loomContainer}>
          <div>
            <iframe
              src="https://www.loom.com/embed/f3e40d564c244a60842f88471d2a7656?sid=f45d6d3b-23fa-4977-aa4e-c2b3b16c2d4a"
              frameBorder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <p>
          Solo falta asegurarse que la configuración del backtest sea la que
          precisas.
        </p>
        <p>
          Seleccioná el periódo de días que querés testear. Y asegurate que el
          &apos;Tick interval&apos; sea el que necesitas.
        </p>
        <div className={styles.parameter}>
          <span>Tick interval: </span>{' '}
          {backtestFieldsTooltips['TICK_INTERVAL_MINUTES']}
        </div>
      </section>
      <Link href="/backtest">
        <Button className={styles.cta} color="primary">
          Probar mi estrategia
        </Button>
      </Link>
    </div>
  );
}

export default Guide;
