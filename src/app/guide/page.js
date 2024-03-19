import validIndicators from '../helpers/validIndicators';
import strategyFieldsTooltips from '../constants/strategyFieldsTooltips';
import backtestFieldsTooltips from '../constants/backtestFieldsTooltips';
import configKeyToLabel from '../constants/configKeyToLabel';
import styles from './page.module.css';

// TODO-p1: que el modal se muestre maximo 2 veces
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
        <h2>
          1. Crear una estrategia{' '}
          <a className={styles.link}>Ver demo (2 min.)</a>
        </h2>
        <div>[PONER VIDEO ACA]</div>
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
      </section>
      <section className={styles.section}>
        <h2>2. Editar los parámetros de la estrategia</h2>
        <div>[PONER VIDEO ACA]</div>
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
        <div>[PONER VIDEO ACA]</div>
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
    </div>
  );
}

export default Guide;
