function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`; // Manually constructing the date string to include the comma
}

function getPeriodForBacktest({ period, customDates }) {
  let startDate, endDate;

  const now = new Date();
  switch (period) {
    case 'week':
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      endDate = new Date();
      break;
    case 'month':
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      endDate = new Date();
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      endDate = new Date();
      break;
    case 'custom':
      if (customDates && customDates.from && customDates.to) {
        startDate = new Date(customDates.from);
        endDate = new Date(customDates.to);
      } else {
        console.log("Custom dates are required for 'custom' period.");
        return "['Invalid', 'Invalid']"; // Handle as needed
      }
      break;
    default:
      console.log('Invalid period specified.');
      return "['Invalid', 'Invalid']"; // Handle as needed
  }

  return `['${formatDate(startDate)}', '${formatDate(endDate)}']`;
}

export default getPeriodForBacktest;
