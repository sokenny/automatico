'use client';
// TODO-p1 delete chart_data column from backtests table
import React, { useState, useRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';
import { Spinner } from '@nextui-org/react';
import styles from './CandleStickChart.module.css';

const CandleStickChart = ({ backtestId, className }) => {
  const chartContainerRef = useRef(null);

  const [chartData, setChartData] = useState({
    candles: [],
    marks: [],
    ema: [],
    sma: [],
    bbands: {},
  });

  const isLoading = !chartData.candles.length;

  useEffect(() => {
    async function fetchChartData() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chart/${backtestId}`,
      );
      const data = await response.json();
      console.log(data);

      // Update the consolidated state object
      setChartData((prev) => ({
        ...prev,
        candles: data.candles,
        marks: data.marks,
        ema: data.ema || prev.ema,
        sma: data.sma || prev.sma,
        bbands: Object.keys(data.bbands).length > 0 ? data.bbands : prev.bbands,
      }));
    }
    fetchChartData();
  }, [backtestId]);

  useEffect(() => {
    if (chartContainerRef.current && chartData.candles.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 300,
        layout: {
          textColor: 'black',
          background: { type: 'solid', color: 'white' },
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceFormat: {
          type: 'price',
          precision: 6,
          minMove: 0.000001,
        },
      });

      candlestickSeries.setData(chartData.candles);

      candlestickSeries.setMarkers(
        chartData.marks.map((mark) => ({
          time: mark.time,
          text: mark.type,
          position: mark.type === 'entry' ? 'aboveBar' : 'belowBar',
          id: mark.time,
          color: mark.type === 'entry' ? '#2196F3' : '#f44336',
          shape: mark.type === 'entry' ? 'arrowDown' : 'arrowUp',
        })),
      );

      if (chartData.ema.length > 0) {
        const emaSeries = chart.addLineSeries({
          color: 'blue',
          lineWidth: 1,
          crossHairMarkerVisible: false,
        });
        emaSeries.setData(chartData.ema);
      }

      if (chartData.sma.length > 0) {
        const smaSeries = chart.addLineSeries({
          color: 'blue',
          lineWidth: 1,
          crossHairMarkerVisible: false,
        });
        smaSeries.setData(chartData.sma);
      }

      if (Object.keys(chartData.bbands).length > 0) {
        const { upper, lower } = chartData.bbands;
        const upperBbandSeries = chart.addLineSeries({
          color: 'green',
          lineWidth: 1,
        });
        upperBbandSeries.setData(upper);
        const lowerBbandSeries = chart.addLineSeries({
          color: 'red',
          lineWidth: 1,
        });
        lowerBbandSeries.setData(lower);
      }

      chart.timeScale().fitContent();

      return () => chart.remove();
    }
  }, [chartData]); // Now depends on the consolidated state

  return (
    <div
      className={`${styles.container} ${
        isLoading ? styles.isLoading : ''
      } ${className}`}
    >
      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
          <div className={styles.text}>Loading candle stick chart...</div>
        </div>
      )}
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default CandleStickChart;
