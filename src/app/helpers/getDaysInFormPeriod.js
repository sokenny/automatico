function getDaysInFormPeriod({ period, customDates }) {
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
        return null; // Handle as needed
      }
      break;
    default:
      console.log('Invalid period specified.');
      return null; // Handle as needed
  }

  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  return diffDays;
}

export default getDaysInFormPeriod;
