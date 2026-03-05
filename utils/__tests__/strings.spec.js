import { deburrUpper, parseStringWithVars } from '../strings';

describe('utils/strings', () => {
  it('removes accents and uppercases strings', () => {
    expect(deburrUpper('ação')).toBe('ACAO');
    expect(deburrUpper('Málaga')).toBe('MALAGA');
  });

  it('replaces variables in a string template', () => {
    const result = parseStringWithVars('Hello {name} {place}', {
      name: 'World',
      place: 'Earth',
    });

    expect(result).toBe('Hello World Earth');
  });
});
