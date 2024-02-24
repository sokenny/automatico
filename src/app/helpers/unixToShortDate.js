function unixToShortDate(unixDate) {
  return new Date(parseInt(unixDate)).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default unixToShortDate;
