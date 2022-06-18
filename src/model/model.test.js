import {
  generateCharactersList,
  generatePassword,
  validate,
  adjustAt,
} from './model';

describe('generateCharactersList()', () => {
  test('returns selected characters', () => {
    expect(
      generateCharactersList([
        { selected: true, characters: 'abcd' },
        { selected: false, characters: '1234' },
        { selected: true, characters: 'efgh' },
      ])
    ).toEqual('abcdefgh');
  });
});

describe('generatePassword()', () => {
  const testCases = [
    [
      Uint16Array.of(0, 1, 100, 1000, 10000, 32767, 32768, 51234, 65535),
      'ab',
      'aaaaaabbb',
    ],
    [
      Uint16Array.of(0, 1, 100, 1000, 2521, 5041, 5042, 65535),
      'abcdefghijklmnopqrstuvwxyz',
      'aaaabbcz',
    ],
  ];

  test.each(testCases)(
    'given (%p, %p) returns %p',
    (randomNumbers, characters, expected) => {
      expect(generatePassword(randomNumbers, characters)).toEqual(expected);
    }
  );
});

describe('validate()', () => {
  const testCases = [
    ['passwordLength', 0, 2],
    ['passwordLength', 2, 2],
    ['passwordLength', 150, 150],
    ['passwordLength', 255, 255],
    ['passwordLength', 300, 255],
    ['passwordLength', -300, 2],
    ['numberOfPasswords', 0, 1],
    ['numberOfPasswords', 1, 1],
    ['numberOfPasswords', 123, 123],
    ['numberOfPasswords', 199, 199],
    ['numberOfPasswords', 321, 199],
    ['numberOfPasswords', -321, 1],
    ['fieldDoesNotExist', 0, 0],
    ['fieldDoesNotExist', 5000, 5000],
  ];

  test.each(testCases)(
    'given (%p, %p) returns %p',
    (field, value, expected) => {
      expect(validate(field, value)).toEqual(expected);
    }
  );
});

describe('adjustAt()', () => {
  const testCases = [
    [[1, 2, 3], 0, (x) => x * 2, [2, 2, 3]],
    [[4, 8, 12], 2, (x) => x ** 2, [4, 8, 144]],
    [['a', 'b', 'c'], 2, (x) => x + 2, ['a', 'b', 'c2']],
    [
      ['Albertas', 'Arūnas', 'Rasa'],
      0,
      (x) => 'Hello, ' + x,
      ['Hello, Albertas', 'Arūnas', 'Rasa'],
    ],
  ];

  test.each(testCases)(
    'given (%p, %p, %p) returns %p',
    (items, index, adjuster, expected) => {
      expect(adjustAt(items, index, adjuster)).toStrictEqual(expected);
    }
  );
});
