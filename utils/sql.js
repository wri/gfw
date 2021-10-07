const TOKENS = {
  gte: '>=',
  lte: '<=',
  eq: '=',
  neq: '!=',
};

function serializeValue(value) {
  if (value.match(/\d{4}-\d{2}-\d{2}/)) {
    return `'${value}'`;
  }
  if (isNaN(value)) {
    return `'${value}'`;
  }
  return value;
}

function parseToken(strings, values, token) {
  let str = '';
  strings.forEach((string, i) => {
    if (values[i]) {
      str += string + values[i];
    } else {
      str += string;
    }
  });
  return `${TOKENS[token]} ${serializeValue(str)}`;
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
