function getTotalCandlesToAnalyse({ days, tickSize }) {
  const minutesInDay = 1440;
  const candlesPerDay = minutesInDay / tickSize;
  const totalCandles = candlesPerDay * days;
  return totalCandles;
}

export default getTotalCandlesToAnalyse;
