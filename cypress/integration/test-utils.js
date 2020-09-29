/* eslint no-unused-expressions: 0 */
import { Sentence } from '../utils/template-tags';

/*
  Any util created for our tests needs to end up here
  this is to make sure we don't end up with false positives when using test utils.
*/

describe('Test utils should perform as expected', () => {
  it('Sentense util should parse correctly', () => {
    const condition = 'In 2001, {location} had {primaryForest} of primary forest*';
    const expectedPage = 'In 2001, Madrid had 22x of primary forest*'
    const serialized = Sentence`${condition}`;

    // Ensure our regex tests are compiled correctly
    expect(serialized.toString()).equal('/In 2001, ([^\\s]+) had ([^\\s]+) of primary forest\\*/');

    // Ensure our string that we expect to be true is in-fact "true"
    expect(serialized.test(expectedPage)).to.be.true;

    // Put in a random string that we expect to fail
    expect(serialized.test('not correct')).to.be.false;

    // If a sentence is partially fuzzy, it should still return true
    const condition2 = 'In 2001, Madrid had {primaryForest} of primary forest*';
    expect(Sentence`${condition2}`.test('In 2001, Madrid had 22x of primary forest*')).to.be.true;
  });
});
