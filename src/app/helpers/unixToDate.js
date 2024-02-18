function unixToDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default unixToDate;
