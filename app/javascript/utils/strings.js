export const pluralise = str => {
  if (str.substr(-1) === 's') return str;
  return str.substr(-1) === 'y' && str.substr(-1) !== 's'
    ? `${str.substr(0, str.length - 1)}ies`
    : `${str}s`;
};

// formats/create ellipsis nodes text using # of lines available, node width, etc
export const splitSVGText = (
  text,
  height,
  _labelCharHeight,
  _labelCharsPerLine,
  _labelMaxLines
) => {
  if (height < _labelCharHeight - 6) return '';
  const maxLinesForNode = Math.max(
    1,
    Math.min(_labelMaxLines, Math.floor(height / _labelCharHeight))
  );
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let line = word;
    if (currentLine.trim() !== '') {
      line = `${currentLine} ${line} `;
    }
    // line is too long
    if (line.length > _labelCharsPerLine) {
      // last allowed line: show max length possible with ellipsis
      if (lines.length === maxLinesForNode - 1) {
        currentLine = `${line.substr(0, _labelCharsPerLine - 1)} …`;
        break;
      } else if (word.length > _labelCharsPerLine) {
        // word longer than allowed line length: split word in two with a dash
        const wordStart = line.substr(0, _labelCharsPerLine - 1);
        currentLine = line.substr(_labelCharsPerLine - 1);
        lines.push(`${wordStart} -`);
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    } else {
      currentLine = line;
    }
  }

  lines.push(currentLine);
  return lines;
};
