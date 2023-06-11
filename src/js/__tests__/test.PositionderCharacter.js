/* eslint-disable no-undef */
/* eslint-disable import/named */
import { generateTeam } from '../utils.js';
import PositionedCharacter from '../PositionedCharacter.js';
import GamePlay from '../GamePlay.js';
// eslint-disable-next-line import/no-unresolved, no-unused-vars
import Character from './Character.js'; // Подставьте правильный путь к файлу Character.js

describe('Game Initialization', () => {
  beforeEach(() => {
    GamePlay.clearGame();
  });

  test('correctly initializes player and enemy teams with positioned characters', () => {
    const playerAllowedTypes = [Swordsman, Bowman, Magician];
    const playerMaxLevel = 3;
    const playerCharacterCount = 2;
    const enemyAllowedTypes = [Undead, Vampire, Daemon];
    const enemyMaxLevel = 4;
    const enemyCharacterCount = 2;

    const playerTeam = generateTeam(
      playerAllowedTypes,
      playerMaxLevel,
      playerCharacterCount,
    );
    const enemyTeam = generateTeam(
      enemyAllowedTypes,
      enemyMaxLevel,
      enemyCharacterCount,
    );

    const playerPositionedCharacters = [];
    const enemyPositionedCharacters = [];

    playerTeam.characters.forEach((character, index) => {
      const position = index + 1;
      const positionedCharacter = new PositionedCharacter(character, position);
      playerPositionedCharacters.push(positionedCharacter);
    });

    enemyTeam.characters.forEach((character, index) => {
      const position = index + 57;
      const positionedCharacter = new PositionedCharacter(character, position);
      enemyPositionedCharacters.push(positionedCharacter);
    });

    const allPositionedCharacters = [
      ...playerPositionedCharacters,
      ...enemyPositionedCharacters,
    ];

    GamePlay.redrawPositions(allPositionedCharacters);

    expect(GamePlay.boardSize).toBe(64);

    allPositionedCharacters.forEach((positionedCharacter) => {
      // eslint-disable-next-line object-curly-spacing
      const { position } = positionedCharacter;
      // eslint-disable-next-line prefer-destructuring
      const character = positionedCharacter.character;

      expect(GamePlay.board.getCellValue(position)).toEqual(character);
    });
  });
});
