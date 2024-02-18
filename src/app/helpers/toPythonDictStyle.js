function toPythonDictStyle(obj) {
  let parts = [];
  for (const [key, value] of Object.entries(obj)) {
    let valPart = '';
    if (typeof value === 'string') {
      valPart = `'${value}'`; // Wrap string values with single quotes
    } else {
      valPart = value; // Leave non-string values as is (numbers, booleans)
    }
    parts.push(`'${key}': ${valPart}`);
  }
  return `{${parts.join(', ')}}`;
}

export default toPythonDictStyle;
