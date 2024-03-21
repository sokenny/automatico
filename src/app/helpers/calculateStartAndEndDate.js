function calculateStartAndEndDate(period, customDates) {
  let startDate, endDate;
  const now = new Date();

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      endDate = new Date();
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      endDate = new Date();
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      endDate = new Date();
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      endDate = new Date();
      break;
    case 'custom':
      if (customDates && customDates.from && customDates.to) {
        startDate = new Date(customDates.from);
        endDate = new Date(customDates.to);
      } else {
        console.log("Custom dates are required for 'custom' period.");
        return null;
      }
      break;
    default:
      console.log('Invalid period specified.');
      return null;
  }

  return { startDate, endDate };
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function getPeriodForBacktest({ period, customDates }) {
  const dates = calculateStartAndEndDate(period, customDates);
  if (!dates) {
    return "['Invalid', 'Invalid']";
  }
  return `['${formatDate(dates.startDate)}', '${formatDate(dates.endDate)}']`;
}

function getDaysInFormPeriod({ period, customDates }) {
  const dates = calculateStartAndEndDate(period, customDates);
  if (!dates) {
    return null;
  }

  const diffTime = Math.abs(dates.endDate - dates.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export { getPeriodForBacktest, getDaysInFormPeriod };
