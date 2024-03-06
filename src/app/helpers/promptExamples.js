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
];

export default promptExamples;
