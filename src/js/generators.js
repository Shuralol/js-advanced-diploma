/* eslint-disable no-plusplus */
/* eslint-disable new-cap */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
import Team from './Team.js';

import { characterGenerator as charGenerator } from '../generators.js';

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const characterClass = allowedTypes[randomInteger(0, allowedTypes.length - 1)];
    const level = randomInteger(1, maxLevel);
    yield new characterClass(level);
  }
}

export function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const teamCharacters = [];
  const playerGenerator = charGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    const character = playerGenerator.next().value;
    teamCharacters.push(character);
  }

  return new Team(teamCharacters);
}
