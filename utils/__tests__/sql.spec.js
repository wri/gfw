import { gte, lte, eq, neq } from '../sql';

describe('utils/sql', () => {
  it('builds comparison expressions with numbers', () => {
    expect(gte`${10}`).toBe('>= 10');
    expect(lte`${5}`).toBe('<= 5');
    expect(eq`${3}`).toBe('= 3');
    expect(neq`${7}`).toBe('!= 7');
  });

  it('quotes string and date values', () => {
    expect(eq`foo`).toBe("= 'foo'");
    expect(gte`2024-01-15`).toBe(">= '2024-01-15'");
  });
});
