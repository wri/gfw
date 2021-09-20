const TOKENS = {
  gte: '>=',
  lte: '<=',
  eq: '=',
  neq: '!=',
};

function parseToken(strings, values, token) {
  let str = '';
  strings.forEach((string, i) => {
    if (values[i]) {
      str += string + values[i];
    } else {
      str += string;
    }
  });
  return `${TOKENS[token]} ${str}`;
}

export function gte(strings, ...values) {
  return parseToken(strings, values, 'gte');
}

export function lte(strings, ...values) {
  return parseToken(strings, values, 'lte');
}

export function eq(strings, ...values) {
  return parseToken(strings, values, 'eq');
}

export function neq(strings, ...values) {
  return parseToken(strings, values, 'neq');
}
