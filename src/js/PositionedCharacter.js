import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error(
        'character must be instance of Character or its children',
      );
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }
}
/*
import { generateTeam } from "../utils.js";
import { PositionedCharacter } from "../PositionedCharacter.js";
import GamePlay from "../GamePlay.js";

const playerAllowedTypes = [Swordsman, Bowman, Magician];
const playerMaxLevel = 3;
const playerCharacterCount = 2;
const playerTeam = generateTeam(
  playerAllowedTypes,
  playerMaxLevel,
  playerCharacterCount
);

const enemyAllowedTypes = [Undead, Vampire, Daemon];
const enemyMaxLevel = 4;
const enemyCharacterCount = 2;
const enemyTeam = generateTeam(
  enemyAllowedTypes,
  enemyMaxLevel,
  enemyCharacterCount
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
 */
