function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Could not copy text to clipboard: ', err);
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
  }
}

export default copyToClipboard;
