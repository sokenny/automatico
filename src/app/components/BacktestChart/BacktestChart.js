'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
import colors from '../../contants/colors';
import unixToShortDate from '../../helpers/unixToShortDate';
import styles from './BacktestChart.module.css';

function getTooltipLabel(item) {
  if (item?.raw?.type === 'entry') {
    return `Bought ${item.raw.quantity}`;
  }
  if (item?.raw?.type === 'exit') {
    return `Sold ${item.raw.quantity} | PNL: ${item.raw.pnl + ' (USDT)'}`;
  }
  return item.formattedValue;
}

function getChartOptions(defaultOptions, customOptions) {
  const optionsToReturn = { ...defaultOptions };

  if (customOptions.showScales) {
    optionsToReturn.scales = {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    };
  }

  return optionsToReturn;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'x',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#fafafa',
      borderColor: '#dbdbdb',
      padding: {
        top: 8,
        bottom: 8,
        left: 12,
        right: 12,
      },
      borderWidth: 0.5,
      displayColors: false,
      enabled: true,
      callbacks: {
        title: (item) => unixToShortDate(item[0].label),
        label: getTooltipLabel,
      },
      titleColor: '#000',
      bodyColor: colors.linkBlue,
      titleFont: {
        size: 12,
        weight: 300,
      },
      bodyFont: {
        size: 12,
        weight: 300,
      },
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

function prepareChartData(pricePoints, operations) {
  operations.forEach((operation) => {
    pricePoints.push({
      time: operation.open_time,
      price: operation.open_price,
    });
    pricePoints.push({
      time: operation.close_time,
      price: operation.exit_price,
    });
  });

  pricePoints.sort((a, b) => a.time - b.time);

  const labelsToUse = pricePoints.map((obj) => obj.time);

  const lineDataset = {
    label: 'Price',
    data: pricePoints.map((obj) => ({ x: obj.time, y: parseFloat(obj.price) })),
    fill: false,
    borderColor: '#0363ff',
    borderWidth: 1.5,
    pointRadius: 0,
    type: 'line',
  };

  const trades = [];

  operations.forEach((operation) => {
    trades.push({
      x: operation.open_time,
      y: parseFloat(operation.open_price),
      type: 'entry',
      quantity: operation.quantity,
    });
    trades.push({
      x: operation.close_time,
      y: parseFloat(operation.exit_price),
      type: 'exit',
      quantity: operation.quantity,
      pnl: operation.pnl,
    });
  });

  const scatterDataset = {
    label: 'Trades',
    data: trades.map((trade) => ({
      x: trade.x,
      y: parseFloat(trade.y),
      type: trade.type,
      quantity: trade.quantity,
      pnl: trade.pnl,
    })),
    backgroundColor: trades.map((trade) =>
      trade.type === 'entry' ? colors.green : colors.error,
    ),
    pointRadius: 4,
    type: 'scatter',
  };

  return {
    labels: labelsToUse,
    datasets: [lineDataset, scatterDataset],
  };
}

const BacktestChart = ({ chartData, closedOperations, showScales = false }) => {
  return (
    <div className={styles.BacktestChart}>
      <Line
        data={prepareChartData(chartData, closedOperations)}
        options={getChartOptions(defaultOptions, { showScales })}
      />
    </div>
  );
};

export default React.memo(BacktestChart);
