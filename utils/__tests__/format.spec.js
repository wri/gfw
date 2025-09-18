import { formatNumber, formatUSD } from '../format';

describe('formatUSD', () => {
  it('should format to Billion (B)', () => {
    const unformattedNumber = 1000000000;
    const formattedNumber = `${formatUSD(unformattedNumber)} USD`;
    const expected = '1.0B USD';

    expect(formattedNumber).toBe(expected);
  });

  it('should format to Million (M)', () => {
    const unformattedNumber = 1000000;
    const formattedNumber = `${formatUSD(unformattedNumber)} USD`;
    const expected = '1.0M USD';

    expect(formattedNumber).toBe(expected);
  });

  it('should format to Thousand (K)', () => {
    const unformattedNumber = 100000;
    const formattedNumber = `${formatUSD(unformattedNumber)} USD`;
    const expected = '100k USD';

    expect(formattedNumber).toBe(expected);
  });

  it('should format to Billion without short unit', () => {
    const unformattedNumber = 1000000000;
    const formattedNumber = `${formatUSD(unformattedNumber, false)} USD`;
    const expected = '1.0 billion USD';

    expect(formattedNumber).toBe(expected);
  });
});

describe('formatNumber', () => {
  describe('Hectares (ha)', () => {
    it('should format to hectares (ha) with no space between numbers and units', () => {
      const unformattedNumber = 100;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'ha',
        spaceUnit: false,
      });
      const expected = '100ha';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to Mega (Million) hectares (Mha) with space between numbers and units', () => {
      const unformattedNumber = 1200000;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'ha',
        spaceUnit: true,
      });
      const expected = '1.2 Mha';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to Killo (Thousand) hectares (Kha) with space between numbers and units', () => {
      const unformattedNumber = 1200;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'ha',
        spaceUnit: true,
      });
      const expected = '1.2 kha';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to Giga (Billion) hectares (Gha) with space between numbers and units', () => {
      const unformattedNumber = 3921234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'ha',
        spaceUnit: true,
      });
      const expected = '3.9 Gha';

      expect(formattedNumber).toBe(expected);
    });
  });

  describe('Percentage (%)', () => {
    it('should format to percentage (%) with no space between numbers and units', () => {
      const unformattedNumber = 36.24;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: '%',
        spaceUnit: false,
      });
      const expected = '36%';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to percentage (%) with space between numbers and units', () => {
      const unformattedNumber = 36.24;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: '%',
        spaceUnit: true,
      });
      const expected = '36 %';

      expect(formattedNumber).toBe(expected);
    });
  });

  describe('Carbon (tCO2 or t)', () => {
    it('should format to gigatons of carbon (GtCO₂e) with space between numbers and units', () => {
      const unformattedNumber = 1234567891;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'tCO2',
        spaceUnit: true,
      });
      const expected = '1.2 GtCO\u2082e';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to gigatons (Gt) with space between numbers and units', () => {
      const unformattedNumber = 1234567891;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 't',
        spaceUnit: true,
      });
      const expected = '1.2 Gt';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to megatons of carbon (MtCO₂e) with space between numbers and units', () => {
      const unformattedNumber = 1234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'tCO2',
        spaceUnit: true,
      });
      const expected = '1.2 MtCO\u2082e';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to megatons (Mt) with space between numbers and units', () => {
      const unformattedNumber = 1234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 't',
        spaceUnit: true,
      });
      const expected = '1.2 Mt';

      expect(formattedNumber).toBe(expected);
    });
  });

  describe('Counts units (counts/countsK)', () => {
    it('should format to countsK with no space between numbers and units', () => {
      const unformattedNumber = 123456;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'countsK',
        spaceUnit: false,
      });
      const expected = '120k';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to simple number format separated by comma and without unit', () => {
      const unformattedNumber = 1234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: 'counts',
        spaceUnit: false,
      });
      const expected = '1,234,567';

      expect(formattedNumber).toBe(expected);
    });
  });

  describe('Special units', () => {
    it('should format to simple number format separated by comma and without unit', () => {
      const unformattedNumber = 1234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: ',',
        spaceUnit: false,
      });
      const expected = '1,234,567';

      expect(formattedNumber).toBe(expected);
    });

    it('should format to simple number format with fixed point notation and without unit', () => {
      const unformattedNumber = 1234567;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: '',
        spaceUnit: false,
      });
      const expected = '1234567.00';

      expect(formattedNumber).toBe(expected);
    });

    it('should format using a specialSpecifier from d3-format', () => {
      const unformattedNumber = 1775000;
      const specialSpecificer = unformattedNumber < 1 ? '.2r' : '.2s';
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        specialSpecificer, // https://github.com/d3/d3-format#format
        spaceUnit: false,
      });
      const expected = '1.8M';

      expect(formattedNumber).toBe(expected);
    });

    it('should format using a different precision', () => {
      const unformattedNumber = 175;
      const formattedNumber = formatNumber({
        num: unformattedNumber,
        unit: '%',
        precision: 3,
      });

      const expected = '175%';

      expect(formattedNumber).toBe(expected);
    });

    it('should return < 1 when the unit is different of % and value is less than 1', () => {
      const unformattedNumber = 0.001;
      const formattedNumber = formatNumber({ num: unformattedNumber });

      const expected = '< 1';

      expect(formattedNumber).toBe(expected);
    });
  });
});
