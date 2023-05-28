import { Character, Swordsman, Bowman, Magician, generateTeam, characterGenerator } from '../PositionedCharacter.js';

describe('Character', () => {
  test('throws an exception when creating an instance of the base Character class', () => {
    expect(() => new Character()).toThrow();
  });

  test('does not throw an exception when creating instances of inherited classes', () => {
    expect(() => new Swordsman()).not.toThrow();
    expect(() => new Bowman()).not.toThrow();
    expect(() => new Magician()).not.toThrow();
  });
});

describe('generateTeam', () => {
  test('creates characters with correct level and type', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 1;
    const characterCount = 3;
    const team = generateTeam(allowedTypes, maxLevel, characterCount);

    expect(team.characters).toHaveLength(characterCount);
    team.characters.forEach((character) => {
      expect(character.level).toBe(maxLevel);
      expect(allowedTypes).toContain(character.constructor);
    });
  });
});

describe('characterGenerator', () => {
  test('returns an infinite sequence of characters from the allowed types', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const generator = characterGenerator(allowedTypes);

    for (let i = 0; i < 10; i++) {
      const character = generator.next().value;
      expect(allowedTypes).toContain(character.constructor);
    }
  });
});

