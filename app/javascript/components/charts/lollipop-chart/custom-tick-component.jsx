import React from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';

const getTextWidth = (text, font = '500 12px sans-serif') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
};

const breakString = (word, maxWidth, hyphenCharacter = '-') => {
  const characters = word.split('');
  const lines = [];
  let currentLine = '';

  characters.forEach((character, i) => {
    const nextLine = `${currentLine}${character}`;
    const lineWidth = getTextWidth(nextLine);
    if (lineWidth >= maxWidth) {
      const currentCharacter = i + 1;
      const isLastLine = characters.length === currentCharacter;
      const hyphenatedNextLine = `${nextLine}${hyphenCharacter}`;
      lines.push(isLastLine ? nextLine : hyphenatedNextLine);
      currentLine = '';
    } else {
      currentLine = nextLine;
    }
  });

  return { hyphenatedStrings: lines, remainingWord: currentLine };
};

const wrapLabel = (label, maxWidth) => {
  const words = label.split(' ');
  const completedLines = [];
  let nextLine = '';
  words.forEach((word, index) => {
    const wordLength = getTextWidth(`${word} `);
    const nextLineLength = getTextWidth(nextLine);
    if (wordLength > maxWidth) {
      const { hyphenatedStrings, remainingWord } = breakString(word, maxWidth);
      completedLines.push(nextLine, ...hyphenatedStrings);
      nextLine = remainingWord;
    } else if (nextLineLength + wordLength >= maxWidth) {
      completedLines.push(nextLine);
      nextLine = word;
    } else {
      nextLine = [nextLine, word].filter(Boolean).join(' ');
    }
    const currentWord = index + 1;
    const isLastWord = currentWord === words.length;
    if (isLastWord) {
      completedLines.push(nextLine);
    }
  });
  return completedLines.filter(line => line !== '');
};

const CustomTick = props => {
  const { x, y, index, data, isDesktop } = props;
  const { extLink, path, label } = data[index];

  const number = index + 1;
  const tickText = wrapLabel(label, 140);

  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="16" cy={isDesktop ? -4 : -24} r="8" fill="#e5e5df" />
      <text
        x={number > 9 ? '10' : '13'}
        y={isDesktop ? 0 : -20}
        textAnchor="start"
        fontSize="12px"
        fill="#555"
      >
        {number}
      </text>
      <text
        x={isDesktop ? 175 : 40}
        y={isDesktop ? 0 : -20}
        textAnchor={isDesktop ? 'end' : 'start'}
        fontSize="12px"
        fill="#555555"
      >
        {extLink ? (
          <a href={path} target="_blank" rel="noopener nofollower">
            {label}
          </a>
        ) : (
          <Link to={path}>
            {isDesktop && tickText.length > 1
              ? tickText.map((word, i) => (
                <tspan x="175" y={i === 0 ? -7 : 7 * i} key={word}>
                  {word}
                </tspan>
              ))
              : tickText[0]}
          </Link>
        )}
      </text>
    </g>
  );
};

CustomTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
  data: PropTypes.array,
  isDesktop: PropTypes.bool
};

export default CustomTick;
