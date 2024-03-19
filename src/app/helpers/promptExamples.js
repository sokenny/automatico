const promptExamples = [
  {
    entry:
      'Cuando el DOGE cruce el valor 30 de RSI14, abrir posición long con 1k USDT. Apalancamiento x2.',
    exit: 'Cerrar la posición si se alcanza un take profit del 2% o stop loss del 3%.',
  },
  {
    entry:
      'Cuando ROSE cruce el SMA20 en velas de 5 minutos, abrir posición de tipo SHORT de 500 USDT.',
    exit: 'Salir con 1% take profit o 1% stop loss.',
  },
  {
    entry:
      'Cuando SOL cruce el CCI 200 en velas de 15 minutos, entrar con 300 USDT. ',
    exit: 'Salir con take profit de 3% o stop loss de 1% ',
  },
  {
    entry:
      'Si el CCI de EOSUSDT supera 100, comprometerse con 1500 USDT en velas de 5 minutos. Usar apalancamiento x2',
    exit: 'Salir con take profit de 3% o stop loss de 1%',
  },
  {
    entry:
      'Cuando el MACD de BTCUSDT cruce el valor 0 en velas de 1 hora, abrir posición long con 1k USDT. Apalancamiento x2.',
    exit: 'Cerrar la posición si se alcanza un take profit del 2% o stop loss del 3%.',
  },
  {
    entry:
      'Cuando el precio de DOGEUSDT toque la banda superior de las Bollinger Bands en velas de 15 minutos, abrir posición short con 1k USDT. Apalancamiento x2.',
    exit: 'Cerrar la posición si se alcanza un take profit del 2% o stop loss del 3%.',
  },
  {
    entry:
      'Cuando ETHUSDT cruce el EMA20 hacia arriba en velas de 30 minutos, invertir 2000 USDT en posición long. Usar apalancamiento x3.',
    exit: 'Salir con take profit de 4% o stop loss de 2%',
  },
  {
    entry:
      'Si el precio de BNBUSDT cae por debajo del SMA50 en velas de 1 hora, entrar en posición short con 1500 USDT.',
    exit: 'Salir con take profit de 3% o stop loss de 1%',
  },
  {
    entry:
      'Cuando el MACD de ADAUSDT cruce hacia arriba la línea de señal en velas de 1 día, abrir posición long con 800 USDT. Utilizar apalancamiento x1 (sin apalancamiento).',
    exit: 'Cerrar la posición si se alcanza un take profit del 5% o stop loss del 3%.',
  },
  {
    entry:
      'Cuando BTCUSDT cruce el EMA50 hacia arriba en velas diarias, invertir 2000 USDT en posición long. Usar apalancamiento x1 (sin apalancamiento).',
    exit: 'Cerrar la posición con un take profit del 10% o un stop loss del 5%.',
  },
  {
    entry:
      'Cuando XRPUSDT supere el valor 60 de RSI en velas diarias, abrir posición short con 1500 USDT.',
    exit: 'Salir con take profit de 12% o stop loss de 6%',
  },
  {
    entry:
      'Cuando el RSI14 de BTCUSDT caiga por debajo de 30 en velas de 1 hora, abrir posición long con 1000 USDT. Apalancamiento x3.',
    exit: 'Salir cuando el RSI14 de BTCUSDT supere el valor 70.',
  },
  {
    entry:
      'Si el MACD de ETHUSDT cruza hacia arriba la línea de señal en velas diarias, entrar con 1500 USDT en posición long.',
    exit: 'Salir cuando el MACD de ETHUSDT cruce hacia abajo la línea de señal.',
  },
  {
    entry:
      'Cuando el volumen de ADAUSDT supere su media móvil de 20 periodos en velas de 30 minutos, abrir posición short con 700 USDT.',
    exit: 'Salir cuando el volumen de ADAUSDT caiga por debajo de su media móvil de 20 periodos.',
  },
  {
    entry:
      'Si el precio de XRPUSDT cruza hacia arriba el EMA50 en velas de 1 hora, invertir 2000 USDT en posición long.',
    exit: 'Salir cuando el precio de XRPUSDT cruce hacia abajo el EMA50.',
  },
  {
    entry:
      'Cuando el CCI de BNBUSDT cruce hacia arriba el nivel -100 en velas de 15 minutos, abrir posición long con 1000 USDT.',
    exit: 'Salir cuando el CCI de BNBUSDT cruce hacia abajo el nivel 100.',
  },
  {
    entry:
      'Cuando el precio de DOGEUSDT toque la banda inferior de las Bollinger Bands en velas de 1 hora, abrir posición long con 500 USDT.',
    exit: 'Salir cuando el precio de DOGEUSDT toque la banda superior de las Bollinger Bands.',
  },
];

export default promptExamples;
